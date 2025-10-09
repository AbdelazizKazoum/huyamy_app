import { NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";
import { generateSlug } from "@/lib/utils";
import { Category } from "@/types";
import { deleteImageFromR2, uploadImageToR2 } from "@/lib/services/R2Service";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const nameAr = formData.get("name[ar]") as string;
    const nameFr = formData.get("name[fr]") as string;
    const descriptionAr = formData.get("description[ar]") as string;
    const descriptionFr = formData.get("description[fr]") as string;
    const imageFile = formData.get("image") as File | null;

    const updateData: Partial<Category> = {
      name: { ar: nameAr, fr: nameFr },
      description: { ar: descriptionAr, fr: descriptionFr },
      slug: generateSlug(nameAr),
    };

    if (imageFile) {
      const oldCategory = await getCategoryById(id);
      if (oldCategory?.image) {
        await deleteImageFromR2(oldCategory.image).catch(console.error);
      }
      updateData.image = await uploadImageToR2(imageFile);
    }

    await updateCategory(id, updateData);

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(`Failed to update category ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const categoryToDelete = await getCategoryById(id);

    if (categoryToDelete?.image) {
      await deleteImageFromR2(categoryToDelete.image).catch(console.error);
    }

    await deleteCategory(id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete category ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
