import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  isAdmin: boolean;
  emailVerified: boolean;
  createdAt: Date;
}

/**
 * Creates a new user account
 */
export async function createUser(data: SignUpData): Promise<AuthUser> {
  try {
    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: data.displayName || null,
      phoneNumber: data.phoneNumber || null,
      isAdmin: false,
      emailVerified: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userProfile);

    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: data.displayName || null,
      phoneNumber: data.phoneNumber || null,
      isAdmin: false,
      emailVerified: false,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
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
      phoneNumber: userData?.phoneNumber || null,
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
      phoneNumber: userData?.phoneNumber || null,
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
  data: Partial<Pick<AuthUser, "displayName" | "phoneNumber">>
): Promise<void> {
  try {
    // Update Firebase Auth
    const authUpdate: { displayName?: string; phoneNumber?: string } = {};
    if (data.displayName !== undefined)
      authUpdate.displayName = data.displayName;
    if (data.phoneNumber !== undefined)
      authUpdate.phoneNumber = data.phoneNumber;

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
