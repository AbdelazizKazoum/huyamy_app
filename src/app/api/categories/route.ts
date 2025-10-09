import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/services/categoryService";
import { generateSlug } from "@/lib/utils";
import { Category } from "@/types";
import { uploadImageToR2 } from "@/lib/services/R2Service";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nameAr = formData.get("name[ar]") as string;
    const nameFr = formData.get("name[fr]") as string;
    const descriptionAr = formData.get("description[ar]") as string;
    const descriptionFr = formData.get("description[fr]") as string;
    const imageFile = formData.get("image") as File | null;

    if (!nameAr || !nameFr || !descriptionAr || !descriptionFr || !imageFile) {
      return NextResponse.json(
        { error: "All fields and an image are required." },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImageToR2(imageFile);

    const newCategoryData: Omit<Category, "id"> = {
      name: { ar: nameAr, fr: nameFr },
      description: { ar: descriptionAr, fr: descriptionFr },
      slug: generateSlug(nameAr), // Generate slug from Arabic name
      image: imageUrl,
    };

    const createdCategory = await createCategory(newCategoryData);

    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
