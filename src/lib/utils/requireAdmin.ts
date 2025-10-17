import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }
  const idToken = authHeader.replace("Bearer ", "");
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return { error: "Invalid token", status: 401 };
  }
  // Check Firestore profile for isAdmin
  const doc = await adminDb.collection("users").doc(decoded.uid).get();
  if (!doc.exists || doc.data()?.isAdmin !== true) {
    return { error: "Forbidden", status: 403 };
  }
  return { uid: decoded.uid };
}
