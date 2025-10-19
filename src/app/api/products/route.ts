import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/lib/services/productService";
import { generateSlug } from "@/lib/utils";
import { Product } from "@/types";
import { uploadImagesToR2, uploadImageToR2 } from "@/lib/services/R2Service";
import { requireAdmin } from "@/lib/utils/requireAdmin";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  console.log("Products API called");
  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries())
  );
  console.log("Environment variables check:", {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "Set" : "Not set",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL
      ? "Set"
      : "Not set",
    FIREBASE_PRIVATE_KEY:
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_PRIVATE_KEY.length > 0
        ? "Set (length: " + process.env.FIREBASE_PRIVATE_KEY.length + ")"
        : "Not set",
  });

  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Admin guard
  const adminCheck = await requireAdmin(request);
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const formData = await request.formData();
    const productDataString = formData.get("productData") as string;
    const mainImageFile = formData.get("mainImage") as File | null;
    const subImageFiles = formData.getAll("subImages") as File[];
    const certificationImageFiles = formData.getAll(
      "certificationImages"
    ) as File[];

    if (!productDataString || !mainImageFile) {
      return NextResponse.json(
        { error: "Product data and main image are required." },
        { status: 400 }
      );
    }

    const productData = JSON.parse(productDataString);

    // 1. Upload images to R2 and get their URLs
    const mainImageUrl = await uploadImageToR2(mainImageFile);
    const subImageUrls =
      subImageFiles.length > 0 ? await uploadImagesToR2(subImageFiles) : [];
    const certificationImageUrls =
      certificationImageFiles.length > 0
        ? await uploadImagesToR2(certificationImageFiles)
        : [];

    // 2. Prepare the final product object for the database
    const finalProduct: Omit<Product, "id"> = {
      ...productData,
      slug: generateSlug(productData.name.fr),
      image: mainImageUrl,
      subImages: subImageUrls,
      certificationImages: certificationImageUrls,
      createdAt: new Date(), // Placeholder, will be replaced by server timestamp
      updatedAt: new Date(), // Placeholder, will be replaced by server timestamp
    };

    // If variants exist, ensure the base price is set to the lowest variant price
    if (finalProduct.variants && finalProduct.variants.length > 0) {
      const prices = finalProduct.variants.map((v) => v.price);
      finalProduct.price = Math.min(...prices);
    }

    // 3. Create product in Firestore
    const newProduct = await createProduct(finalProduct);

    // 4. Revalidate products pages
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    // 5. Revalidate category pages for the new product
    if (finalProduct.category?.slug) {
      revalidatePath(`/fr/category/${finalProduct.category.slug}`);
      revalidatePath(`/ar/category/${finalProduct.category.slug}`);
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
