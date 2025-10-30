import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/services/productService";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS, MASTER_CACHE_TAGS } from "@/lib/cache/tags";

import { generateSlug } from "@/lib/utils";
import { Product, ProductVariant } from "@/types"; // Import ProductVariant
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

    // --- 1. Get All Form Data ---
    const productDataString = formData.get("productData") as string;
    const mainImageFile = formData.get("mainImage") as File | null;
    const newSubImageFiles = formData.getAll("subImages") as File[];
    const newCertificationImageFiles = formData.getAll(
      "certificationImages"
    ) as File[];

    // Get all lists of deleted URLs
    const deletedUrlsString = formData.get("deletedSubImageUrls") as
      | string
      | null;
    const deletedCertUrlsString = formData.get(
      "deletedCertificationImageUrls"
    ) as string | null;
    // --- NEW: Get deleted variant image URLs ---
    const deletedVariantUrlsString = formData.get("deletedVariantImageUrls") as
      | string
      | null;

    const deletedSubImageUrls: string[] = deletedUrlsString
      ? JSON.parse(deletedUrlsString)
      : [];
    const deletedCertificationImageUrls: string[] = deletedCertUrlsString
      ? JSON.parse(deletedCertUrlsString)
      : [];
    // --- NEW: Parse deleted variant image URLs ---
    const deletedVariantImageUrls: string[] = deletedVariantUrlsString
      ? JSON.parse(deletedVariantUrlsString)
      : [];

    if (!productDataString) {
      return NextResponse.json(
        { error: "Product data is required." },
        { status: 400 }
      );
    }

    // --- 2. Prepare Base Update Data ---
    const productData = JSON.parse(productDataString);
    const updateData: Partial<Product> = {
      ...productData,
      slug: generateSlug(productData.name.fr),
      updatedAt: new Date(), // Will be replaced by server timestamp
    };

    // --- 3. Get Old Product Data ---
    const oldProduct = await getProductById(id);
    if (!oldProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // --- 4. Handle Main Image Upload/Update ---
    if (mainImageFile) {
      if (oldProduct.image) {
        await deleteImageFromR2(oldProduct.image).catch(console.error);
      }
      updateData.image = await uploadImageToR2(mainImageFile);
    }

    // --- 5. Handle All Image Deletions ---
    const allImagesToDelete = [
      ...deletedSubImageUrls,
      ...deletedCertificationImageUrls,
      ...deletedVariantImageUrls, // Add variant images to deletion list
    ];

    if (allImagesToDelete.length > 0) {
      await deleteImagesFromR2(allImagesToDelete).catch(console.error);
    }

    // --- 6. Handle Sub & Certification Image Uploads ---
    const newSubImageUrls =
      newSubImageFiles.length > 0
        ? await uploadImagesToR2(newSubImageFiles)
        : [];
    const newCertificationImageUrls =
      newCertificationImageFiles.length > 0
        ? await uploadImagesToR2(newCertificationImageFiles)
        : [];

    // Construct final image arrays
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

    // --- 7. NEW: Handle Variant Image Uploads & Updates ---
    if (productData.variants && productData.variants.length > 0) {
      updateData.variants = await Promise.all(
        productData.variants.map(async (variant: ProductVariant) => {
          // Get new files for this specific variant
          const newVariantImageFiles = formData.getAll(variant.id) as File[];
          const newVariantImageUrls =
            newVariantImageFiles.length > 0
              ? await uploadImagesToR2(newVariantImageFiles)
              : [];

          // Find the old variant's images from the product we fetched
          const oldVariant = oldProduct.variants?.find(
            (v) => v.id === variant.id
          );
          const oldVariantImages = oldVariant?.images || [];

          // Filter out any deleted images
          const remainingVariantImages = oldVariantImages.filter(
            (url) => !deletedVariantImageUrls.includes(url)
          );

          // Combine remaining and new images
          const finalVariantImages = [
            ...remainingVariantImages,
            ...newVariantImageUrls,
          ];

          return {
            ...variant,
            images: finalVariantImages,
          };
        })
      );

      // Recalculate main price based on new variant prices
      const prices = updateData.variants.map((v) => v.price);
      updateData.price = Math.min(...prices);
    } else {
      // No variants, so just use the base price from the form
      updateData.variants = [];
      updateData.price = productData.price; // Use the base price from form
    }
    // --- END NEW ---

    // 8. Update product in Firestore
    await updateProduct(id, updateData);

    // 9. Revalidate the paths for the updated product and the main products page
    if (updateData.slug) {
      revalidatePath(`/fr/products/${updateData.slug}`);
      revalidatePath(`/ar/products/${updateData.slug}`);
    }
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    // Revalidate all category pages using the categories tag
    revalidateTag(CACHE_TAGS.CATEGORIES);

    // Revalidate the landing page cache tag
    revalidateTag(MASTER_CACHE_TAGS.LANDING_PAGE);

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

      // Add main image
      if (productToDelete.image) {
        imagesToDelete.push(productToDelete.image);
      }
      // Handle subImages as a direct array of strings
      if (productToDelete.subImages && productToDelete.subImages.length > 0) {
        imagesToDelete.push(...productToDelete.subImages);
      }
      // Add certification images
      if (
        productToDelete.certificationImages &&
        productToDelete.certificationImages.length > 0
      ) {
        imagesToDelete.push(...productToDelete.certificationImages);
      }

      // --- NEW: Add all variant images to deletion list ---
      if (productToDelete.variants && productToDelete.variants.length > 0) {
        productToDelete.variants.forEach((variant) => {
          if (variant.images && variant.images.length > 0) {
            imagesToDelete.push(...variant.images);
          }
        });
      }
      // --- END NEW ---

      // Delete all collected images from R2
      if (imagesToDelete.length > 0) {
        await deleteImagesFromR2(imagesToDelete).catch(console.error);
      }
    }

    await deleteProduct(id);

    // Revalidate the paths for the deleted product and the main products page
    if (productToDelete?.slug) {
      revalidatePath(`/fr/products/${productToDelete.slug}`);
      revalidatePath(`/ar/products/${productToDelete.slug}`);
    }
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    // Revalidate all category pages using the categories tag
    revalidateTag(CACHE_TAGS.CATEGORIES);

    // Revalidate the landing page cache tag
    revalidateTag(MASTER_CACHE_TAGS.LANDING_PAGE);

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
