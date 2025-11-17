// app/api/parameters/location-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getSiteConfig,
  updateLocationVerification,
} from "@/lib/services/configService";

export async function GET() {
  try {
    const config = await getSiteConfig();

    // Return only location verification fields
    const locationVerification = {
      location: config?.location || "",
      locationCoordinates: config?.locationCoordinates || {
        lat: undefined,
        lng: undefined,
      },
      verification: config?.verification || { google: "" },
    };

    return NextResponse.json(locationVerification);
  } catch (error) {
    console.error("Error fetching location verification:", error);
    return NextResponse.json(
      { error: "Failed to fetch location verification" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { location, locationCoordinates, verification } = body;

    // Validate required fields
    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Validate coordinates if provided
    if (locationCoordinates) {
      const { lat, lng } = locationCoordinates;
      if (lat !== undefined && (lat < -90 || lat > 90)) {
        return NextResponse.json(
          { error: "Latitude must be between -90 and 90" },
          { status: 400 }
        );
      }
      if (lng !== undefined && (lng < -180 || lng > 180)) {
        return NextResponse.json(
          { error: "Longitude must be between -180 and 180" },
          { status: 400 }
        );
      }
    }

    // Update location verification
    await updateLocationVerification({
      location,
      locationCoordinates,
      verification,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating location verification:", error);
    return NextResponse.json(
      { error: "Failed to update location verification" },
      { status: 500 }
    );
  }
}
