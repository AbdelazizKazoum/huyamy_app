import { NextResponse } from "next/server";
import { createSection, getAllSections } from "@/lib/services/sectionService";
import { Section } from "@/types";
import { uploadImageToR2 } from "@/lib/services/R2Service";
import { requireAdmin } from "@/lib/utils/requireAdmin";
import { revalidateTag } from "next/cache";
import { MASTER_CACHE_TAGS } from "@/lib/cache/tags";

export async function GET() {
  try {
    const sections = await getAllSections();
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
  // Admin guard
  const adminCheck = await requireAdmin(request);
  if ("error" in adminCheck) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

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

    // Revalidate the landing page cache tag
    revalidateTag(MASTER_CACHE_TAGS.LANDING_PAGE);

    return NextResponse.json(createdSection, { status: 201 });
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
