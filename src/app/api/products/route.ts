import { NextResponse } from "next/server";
import { createProduct, getAllProducts } from "@/lib/services/productService";
import { generateSlug } from "@/lib/utils";
import { Product } from "@/types";
import { uploadImagesToR2, uploadImageToR2 } from "@/lib/services/R2Service";

export async function GET() {
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
  try {
    const formData = await request.formData();
    const productDataString = formData.get("productData") as string;
    const mainImageFile = formData.get("mainImage") as File | null;
    const subImageFiles = formData.getAll("subImages") as File[];

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

    // 2. Prepare the final product object for the database
    const finalProduct: Omit<Product, "id"> = {
      ...productData,
      slug: generateSlug(productData.name.ar),
      image: mainImageUrl,
      // Ensure subImages are stored in the correct format { url: string }

      subImages: subImageUrls,
      createdAt: new Date(), // Placeholder, will be replaced by server timestamp
      updatedAt: new Date(), // Placeholder, will be replaced by server timestamp
    };

    // 3. Create product in Firestore
    const newProduct = await createProduct(finalProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    // In case of an error, you might want to delete any uploaded images to avoid orphans.
    // This part is optional but good practice.
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
