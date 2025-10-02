// lib/firebaseAdmin.ts
import admin from "firebase-admin";

// Function to get Firebase credentials
function getFirebaseCredentials() {
  // First try environment variables (preferred for production)
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // If no environment variables, throw error with helpful message
  throw new Error(
    `Firebase credentials not found. Please add the following environment variables:
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_CLIENT_EMAIL=your-service-account-email
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour private key\\n-----END PRIVATE KEY-----\\n"
    
    You can get these values from your Firebase project's service account key.`
  );
}

if (!admin.apps.length) {
  const credentials = getFirebaseCredentials();
  
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;
