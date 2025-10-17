/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/services/productService";
import { revalidatePath } from "next/cache"; // Import revalidatePath

import { generateSlug } from "@/lib/utils";
import { Product } from "@/types";
import {
  deleteImageFromR2,
  deleteImagesFromR2,
  uploadImagesToR2,
  uploadImageToR2,
} from "@/lib/services/R2Service";
import { requireAdmin } from "@/lib/utils/requireAdmin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  // Admin guard
  const adminCheck = await requireAdmin(request);
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    // Await the params since they're now a Promise in Next.js 15
    const { id } = await params;
    const formData = await request.formData();
    const productDataString = formData.get("productData") as string;
    const mainImageFile = formData.get("mainImage") as File | null;
    const newSubImageFiles = formData.getAll("subImages") as File[];
    const newCertificationImageFiles = formData.getAll(
      "certificationImages"
    ) as File[];
    const deletedUrlsString = formData.get("deletedSubImageUrls") as
      | string
      | null;
    const deletedCertUrlsString = formData.get(
      "deletedCertificationImageUrls"
    ) as string | null;

    const deletedSubImageUrls: string[] = deletedUrlsString
      ? JSON.parse(deletedUrlsString)
      : [];
    const deletedCertificationImageUrls: string[] = deletedCertUrlsString
      ? JSON.parse(deletedCertUrlsString)
      : [];

    if (!productDataString) {
      return NextResponse.json(
        { error: "Product data is required." },
        { status: 400 }
      );
    }

    const productData = JSON.parse(productDataString);
    const updateData: Partial<Product> = {
      ...productData,
      slug: generateSlug(productData.name.fr),
    };

    const oldProduct = await getProductById(id);
    if (!oldProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (mainImageFile) {
      if (oldProduct.image) {
        await deleteImageFromR2(oldProduct.image).catch(console.error);
      }
      updateData.image = await uploadImageToR2(mainImageFile);
    }

    if (deletedSubImageUrls.length > 0) {
      await deleteImagesFromR2(deletedSubImageUrls).catch(console.error);
    }
    if (deletedCertificationImageUrls.length > 0) {
      await deleteImagesFromR2(deletedCertificationImageUrls).catch(
        console.error
      );
    }

    const newSubImageUrls =
      newSubImageFiles.length > 0
        ? await uploadImagesToR2(newSubImageFiles)
        : [];
    const newCertificationImageUrls =
      newCertificationImageFiles.length > 0
        ? await uploadImagesToR2(newCertificationImageFiles)
        : [];

    // 4. Construct the final image arrays
    const remainingSubImages =
      oldProduct.subImages?.filter(
        (url) => !deletedSubImageUrls.includes(url)
      ) || [];
    updateData.subImages = [...remainingSubImages, ...newSubImageUrls];

    const remainingCertificationImages =
      oldProduct.certificationImages?.filter(
        (url) => !deletedCertificationImageUrls.includes(url)
      ) || [];
    updateData.certificationImages = [
      ...remainingCertificationImages,
      ...newCertificationImageUrls,
    ];

    // 5. Update product in Firestore
    await updateProduct(id, updateData);

    // 6. Revalidate the paths for the updated product and the main products page
    if (updateData.slug) {
      revalidatePath(`/fr/products/${updateData.slug}`);
      revalidatePath(`/ar/products/${updateData.slug}`);
    }
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    return NextResponse.json({
      message: "Product updated successfully",
      productId: id,
    });
  } catch (error) {
    console.error(`Failed to update product:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // Admin guard
  const adminCheck = await requireAdmin(request);
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    // Await the params since they're now a Promise in Next.js 15
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productToDelete = await getProductById(id);

    if (productToDelete) {
      const imagesToDelete: string[] = [];
      if (productToDelete.image) {
        imagesToDelete.push(productToDelete.image);
      }
      // Handle subImages as a direct array of strings
      if (productToDelete.subImages && productToDelete.subImages.length > 0) {
        imagesToDelete.push(...productToDelete.subImages);
      }
      if (
        productToDelete.certificationImages &&
        productToDelete.certificationImages.length > 0
      ) {
        imagesToDelete.push(...productToDelete.certificationImages);
      }
      await deleteImagesFromR2(imagesToDelete);
    }

    await deleteProduct(id);

    // Revalidate the paths for the deleted product and the main products page
    if (productToDelete?.slug) {
      revalidatePath(`/fr/products/${productToDelete.slug}`);
      revalidatePath(`/ar/products/${productToDelete.slug}`);
    }
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    return NextResponse.json(
      { message: `Product ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to delete product:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
