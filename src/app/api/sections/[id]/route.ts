import { NextResponse } from "next/server";
import {
  getSectionById,
  getSectionWithProducts,
  updateSection,
  deleteSection,
} from "@/lib/services/sectionService";
import { Section } from "@/types";
import { deleteImageFromR2, uploadImageToR2 } from "@/lib/services/R2Service";

interface RouteParams {
  // The params object is now a Promise in recent Next.js versions
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params; // Await the params
    const section = await getSectionWithProducts(id);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    return NextResponse.json(section);
  } catch (error) {
    // Log a generic error as ID might not be available if params promise rejects
    console.error(`Failed to fetch section:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  let id: string;
  try {
    const awaitedParams = await params; // Await the params
    id = awaitedParams.id;

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
    const updateData: Partial<Section> = {
      type: parsedData.type,
      data: parsedData.data,
      isActive: parsedData.isActive,
      // The 'order' field is now removed to prevent the Firestore error
    };

    if (imageFile) {
      const oldSection = await getSectionById(id);
      if (oldSection?.data.imageUrl) {
        await deleteImageFromR2(oldSection.data.imageUrl).catch(console.error);
      }
      if (!updateData.data) updateData.data = {};
      updateData.data.imageUrl = await uploadImageToR2(imageFile);
    }

    await updateSection(id, updateData);

    return NextResponse.json({ message: "Section updated successfully" });
  } catch (error) {
    console.error(`Failed to update section ${id!}:`, error); // Use the resolved id
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  let id: string;
  try {
    const awaitedParams = await params; // Await the params
    id = awaitedParams.id;

    const sectionToDelete = await getSectionById(id);

    if (sectionToDelete?.data.imageUrl) {
      await deleteImageFromR2(sectionToDelete.data.imageUrl).catch(
        console.error
      );
    }

    await deleteSection(id);

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error(`Failed to delete section ${id!}:`, error); // Use the resolved id
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
