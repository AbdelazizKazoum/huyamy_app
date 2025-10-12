// lib/firebaseAdmin.ts
import admin from "firebase-admin";

// Use a global variable to track initialization across module reloads
declare global {
  var _firebaseAdminInitialized: boolean | undefined;
}

// Function to get Firebase credentials from environment variables
function getFirebaseCredentials() {
  // Check if all required environment variables are present
  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    return {
      type: "service_account",
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
        process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      )}`,
      universe_domain: "googleapis.com",
    };
  }

  throw new Error("Firebase Admin credentials not found");
}

// Function to ensure Firebase Admin SDK is initialized
function ensureInitialized() {
  // Check global flag first, then admin.apps.length
  if (global._firebaseAdminInitialized || admin.apps.length > 0) {
    return;
  }

  try {
    const credentials = getFirebaseCredentials();

    admin.initializeApp({
      credential: admin.credential.cert(credentials as admin.ServiceAccount),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });

    // Set global flag to prevent re-initialization
    global._firebaseAdminInitialized = true;

    // Only log once in development
    if (process.env.NODE_ENV === "development") {
      console.log("Firebase Admin initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

// Exported function to get admin.auth()
export function getAdminAuth() {
  ensureInitialized();
  return admin.auth();
}

// Exported function to get admin.firestore()
export function getAdminDb() {
  ensureInitialized();
  return admin.firestore();
}

// Initialize immediately
ensureInitialized();

export const adminAuth = getAdminAuth();
export const adminDb = getAdminDb();
export default admin;
