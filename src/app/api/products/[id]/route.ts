import { NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/services/productService";
import { uploadImage, uploadImages } from "@/lib/fileUploader";
import { generateSlug } from "@/lib/utils";
import { Product } from "@/types";

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

    // 1. Handle main image update
    if (mainImageFile) {
      updateData.image = await uploadImage(mainImageFile);
    }

    // 2. Handle sub-images update
    // Note: This logic appends new images. A real-world scenario might need
    // to handle removal of existing images as well.
    if (subImageFiles.length > 0) {
      const newSubImageUrls = await uploadImages(subImageFiles);
      // You need to decide how to merge: replace all or add to existing.
      // Here we assume adding to the existing ones (which are not passed from the client).
      // A better approach is to pass existing image URLs and new files separately.
      // For now, we'll just set the new ones.
      updateData.subImages = newSubImageUrls;
    }

    // 3. Update product in Firestore
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

    // You should add logic here to delete images from your storage (Cloudflare R2)
    // before deleting the database record.

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
