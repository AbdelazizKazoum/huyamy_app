import { NextResponse } from "next/server";
import {
  getAllSectionsWithProducts,
  createSection,
} from "@/lib/services/sectionService";
import { Section } from "@/types";
import { uploadImageToR2 } from "@/lib/services/R2Service";

export async function GET() {
  try {
    const sections = await getAllSectionsWithProducts();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sectionDataString = formData.get("sectionData") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (!sectionDataString) {
      return NextResponse.json(
        { error: "Section data is required." },
        { status: 400 }
      );
    }

    const parsedData = JSON.parse(sectionDataString);
    const newSection: Omit<Section, "id"> = {
      type: parsedData.type,
      data: parsedData.data,
      isActive: parsedData.isActive ?? true,
      order: parsedData.order ?? 0,
    };

    if (imageFile) {
      newSection.data.imageUrl = await uploadImageToR2(imageFile);
    }

    const createdSection = await createSection(newSection);

    return NextResponse.json(createdSection, { status: 201 });
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
