// app/api/parameters/contact-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateContactInfo } from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only contact info fields
    const contactInfo = {
      contact: config?.contact || { email: "", phone: "", whatsapp: "" },
    };

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { contact } = body;

    // Validate required fields
    if (!contact) {
      return NextResponse.json(
        { error: "Contact information is required" },
        { status: 400 }
      );
    }

    const { email, phone, whatsapp } = contact;

    if (!email || !phone || !whatsapp) {
      return NextResponse.json(
        { error: "Email, phone, and WhatsApp are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Update contact info
    await updateContactInfo({
      contact: {
        email,
        phone,
        whatsapp,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 }
    );
  }
}
