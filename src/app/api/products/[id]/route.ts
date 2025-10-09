/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/services/productService";

import { generateSlug } from "@/lib/utils";
import { Product } from "@/types";
import {
  deleteImageFromR2,
  deleteImagesFromR2,
  uploadImagesToR2,
  uploadImageToR2,
} from "@/lib/services/R2Service";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const productDataString = formData.get("productData") as string;
    const mainImageFile = formData.get("mainImage") as File | null;
    const subImageFiles = formData.getAll("subImages") as File[];

    if (!productDataString) {
      return NextResponse.json(
        { error: "Product data is required." },
        { status: 400 }
      );
    }

    const productData = JSON.parse(productDataString);
    const updateData: Partial<Product> = {
      ...productData,
      slug: generateSlug(productData.name.ar),
    };

    // Handle main image update: if a new one is uploaded, replace the old one.
    if (mainImageFile) {
      const oldProduct = await getProductById(id);
      if (oldProduct?.image) {
        await deleteImageFromR2(oldProduct.image); // Delete old image
      }
      updateData.image = await uploadImageToR2(mainImageFile); // Upload new one
    }

    // Handle sub-images: This example replaces all old sub-images with the new ones.
    // A more complex implementation could allow appending/removing individual images.
    if (subImageFiles.length > 0) {
      const oldProduct = await getProductById(id);
      if (oldProduct?.subImages && oldProduct.subImages.length > 0) {
        await deleteImagesFromR2(oldProduct.subImages);
      }
      const newSubImageUrls = await uploadImagesToR2(subImageFiles);

      updateData.subImages = newSubImageUrls;
    }

    await updateProduct(id, updateData);

    return NextResponse.json({
      message: "Product updated successfully",
      productId: id,
    });
  } catch (error) {
    console.error(`Failed to update product ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 1. Get the product record to find image URLs
    const productToDelete = await getProductById(id);

    if (productToDelete) {
      // 2. Delete all associated images from R2
      const imagesToDelete: string[] = [];
      if (productToDelete.image) {
        imagesToDelete.push(productToDelete.image);
      }
      if (productToDelete.subImages && productToDelete.subImages.length > 0) {
        // @ts-ignore
        imagesToDelete.push(...productToDelete.subImages.map((img) => img.url));
      }
      await deleteImagesFromR2(imagesToDelete);
    }

    // 3. Delete the product record from Firestore
    await deleteProduct(id);

    return NextResponse.json(
      { message: `Product ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to delete product ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
