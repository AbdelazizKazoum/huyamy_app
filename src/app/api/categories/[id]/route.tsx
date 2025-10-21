import { NextRequest, NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";
import { generateSlug } from "@/lib/utils";
import { Category } from "@/types";
import { deleteImageFromR2, uploadImageToR2 } from "@/lib/services/R2Service";
import { requireAdmin } from "@/lib/utils/requireAdmin";
import { revalidateTag, revalidatePath } from "next/cache";
import { MASTER_CACHE_TAGS } from "@/lib/cache/tags";

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
    const nameAr = formData.get("name[ar]") as string;
    const nameFr = formData.get("name[fr]") as string;
    const descriptionAr = formData.get("description[ar]") as string;
    const descriptionFr = formData.get("description[fr]") as string;
    const imageFile = formData.get("image") as File | null;

    const updateData: Partial<Category> = {
      name: { ar: nameAr, fr: nameFr },
      description: { ar: descriptionAr, fr: descriptionFr },
      slug: generateSlug(nameFr),
    };

    if (imageFile) {
      const oldCategory = await getCategoryById(id);
      if (oldCategory?.image) {
        await deleteImageFromR2(oldCategory.image).catch(console.error);
      }
      updateData.image = await uploadImageToR2(imageFile);
    }

    await updateCategory(id, updateData);

    // Revalidate the landing page cache tag
    revalidateTag(MASTER_CACHE_TAGS.LANDING_PAGE);

    // Revalidate the products pages
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    // Revalidate the category pages for both languages
    // revalidatePath(`/category/${updateData.slug}`);
    revalidatePath(`/fr/category/${updateData.slug}`);
    revalidatePath(`/ar/category/${updateData.slug}`);

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(`Failed to update category:`, error);
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
    const categoryToDelete = await getCategoryById(id);

    if (categoryToDelete?.image) {
      await deleteImageFromR2(categoryToDelete.image).catch(console.error);
    }

    await deleteCategory(id);

    // Revalidate the landing page cache tag
    revalidateTag(MASTER_CACHE_TAGS.LANDING_PAGE);

    // Revalidate the products pages
    revalidatePath("/fr/products");
    revalidatePath("/ar/products");

    // Revalidate the category pages for both languages
    if (categoryToDelete?.slug) {
      // revalidatePath(`/category/${categoryToDelete.slug}`);
      revalidatePath(`/fr/category/${categoryToDelete.slug}`);
      revalidatePath(`/ar/category/${categoryToDelete.slug}`);
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete category:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
