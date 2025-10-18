import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" }; // <- put this JSON at project root (gitignored)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createAdminUser() {
  const adminEmail = "admin@your-domain.test";
  const adminPassword = "admin051688";

  try {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(adminEmail);
      console.log("Admin user already exists:", userRecord.uid);
    } catch (e) {
      userRecord = await admin.auth().createUser({
        email: adminEmail,
        emailVerified: false,
        password: adminPassword,
        displayName: "Super Admin",
      });
      console.log("Admin user created:", userRecord.uid);
    }

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminEmail,
      displayName: "Super Admin",
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(
      "Admin custom claim set. Email:",
      adminEmail,
      "Password:",
      adminPassword
    );
    console.log(
      "IMPORTANT: change this password and admin email in production."
    );
  } catch (err) {
    console.error("Error creating admin user:", err);
  }

  process.exit(0);
}

createAdminUser().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});