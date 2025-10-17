/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../firebaseAdmin";

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
  address?: string; // <-- add this
  city?: string; // <-- add this
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phone: string | null;
  address: string | null; // <-- add this
  city: string | null; // <-- add this
  isAdmin: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

/**
 * Creates a new user account
 */
export async function createUser(data: SignUpData): Promise<AuthUser> {
  // Prepare createUser payload
  const createUserPayload: any = {
    email: data.email,
    password: data.password,
    displayName: data.displayName ?? undefined,
  };

  // Only add phoneNumber if it's a valid E.164 string
  if (data.phone && /^\+\d{10,15}$/.test(data.phone)) {
    createUserPayload.phoneNumber = data.phone;
  }

  // 1. Create user in Firebase Authentication
  const userRecord = await adminAuth.createUser(createUserPayload);

  // 2. Save extra info in Firestore
  const userProfile = {
    uid: userRecord.uid,
    email: userRecord.email ?? undefined,
    displayName: userRecord.displayName ?? undefined,
    phone: data.phone ?? undefined,
    address: data.address ?? undefined,
    city: data.city ?? undefined,
    isAdmin: false,
    emailVerified: userRecord.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb.collection("users").doc(userRecord.uid).set(userProfile);

  return {
    uid: userRecord.uid,
    email: userRecord.email ?? null,
    displayName: userRecord.displayName ?? null,
    phone: data.phone ?? null,
    address: data.address ?? null,
    city: data.city ?? null,
    isAdmin: false,
    emailVerified: userRecord.emailVerified,
    createdAt: new Date(),
  };
}

/**
 * Verifies a Firebase ID token and returns user data
 */
export async function verifyToken(idToken: string): Promise<AuthUser> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Get user profile from Firestore
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    const userData = userDoc.data();

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      displayName: userData?.displayName || null,
      phone: userData?.phone || null,
      address: userData?.address || null, // <-- add this
      city: userData?.city || null, // <-- add this
      isAdmin: userData?.isAdmin || false,
      emailVerified: decodedToken.email_verified || false,
      createdAt: userData?.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Gets user by ID
 */
export async function getUserById(uid: string): Promise<AuthUser | null> {
  try {
    const [userRecord, userDoc] = await Promise.all([
      adminAuth.getUser(uid),
      adminDb.collection("users").doc(uid).get(),
    ]);

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();

    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userData?.displayName || null,
      phone: userData?.phone || null,
      address: userData?.address || null, // <-- add this
      city: userData?.city || null, // <-- add this
      isAdmin: userData?.isAdmin || false,
      emailVerified: userRecord.emailVerified,
      createdAt: userData?.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Updates user profile
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<AuthUser, "displayName" | "phone" | "address" | "city">>
): Promise<void> {
  try {
    // Update Firebase Auth
    const authUpdate: { displayName?: string; phone?: string } = {};
    if (data.displayName !== undefined)
      authUpdate.displayName = data.displayName ?? undefined;
    if (data.phone !== undefined) authUpdate.phone = data.phone ?? undefined;

    if (Object.keys(authUpdate).length > 0) {
      await adminAuth.updateUser(uid, authUpdate);
    }

    // Update Firestore
    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

/**
 * Deletes a user account
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    // Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    // Delete from Firestore
    await adminDb.collection("users").doc(uid).delete();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Sets admin claim for a user
 */
export async function setAdminClaim(
  uid: string,
  isAdmin: boolean
): Promise<void> {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });

    // Update Firestore
    await adminDb.collection("users").doc(uid).update({
      isAdmin,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error setting admin claim:", error);
    throw error;
  }
}

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const link = await adminAuth.generatePasswordResetLink(email);
    // TODO: Send email using your email service
    console.log("Password reset link:", link);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
