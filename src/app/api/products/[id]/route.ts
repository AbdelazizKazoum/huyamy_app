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
    const newSubImageFiles = formData.getAll("subImages") as File[];
    const deletedUrlsString = formData.get("deletedSubImageUrls") as
      | string
      | null;

    const deletedSubImageUrls: string[] = deletedUrlsString
      ? JSON.parse(deletedUrlsString)
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
      slug: generateSlug(productData.name.ar),
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

    const newSubImageUrls =
      newSubImageFiles.length > 0
        ? await uploadImagesToR2(newSubImageFiles)
        : [];

    // 4. Construct the final subImages array of strings
    const remainingSubImages =
      oldProduct.subImages?.filter(
        (url) => !deletedSubImageUrls.includes(url)
      ) || [];

    updateData.subImages = [...remainingSubImages, ...newSubImageUrls];

    // 5. Update product in Firestore
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
      await deleteImagesFromR2(imagesToDelete);
    }

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
