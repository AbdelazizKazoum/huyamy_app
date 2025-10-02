// scripts/seedFirestore.js
import admin from "firebase-admin";

// 1) path to the JSON key you downloaded from Firebase console:
import serviceAccount from "../serviceAccountKey.json" with { type: "json" }; // <- put this JSON at project root (gitignored)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// import your prepared data
import { categories } from "../src/data/categories.ts";
import { products } from "../src/data/products.ts";

// helper slugify (keeps Arabic characters, removes spaces & diacritics from Latin)
function slugify(text) {
  if (!text) return "";
  const s = String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^0-9a-z\u0600-\u06FF]+/g, "-") // allow Arabic range
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
  return s || `item-${Date.now()}`;
}

async function seed() {
  console.log("Seeding Firestore...");

  // use batch for categories + products
  const batch = db.batch();

  // 1) categories -> ids: cat-<id>
  categories.forEach((cat) => {
    const docId = `cat-${cat.id}`;
    const ref = db.collection("categories").doc(docId);
    batch.set(ref, {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      slug: slugify(cat.name.fr || cat.name.ar),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  // 2) products -> ids: prod-<id>, link to categoryId "cat-<id>"
  products.forEach((p) => {
    const docId = `prod-${p.id}`;
    const ref = db.collection("products").doc(docId);
    batch.set(ref, {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || null,
      image: p.image,
      subImages: p.subImages || [],
      isNew: !!p.isNew,
      description: p.description,
      keywords: p.keywords || [],
      categoryId: `cat-${p.category.id}`,
      category: { id: p.category.id, name: p.category.name }, // denormalized tiny snapshot
      slug: slugify(p.name.fr || p.name.ar) || `prod-${p.id}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  // 3) example sections document
  const sectionRef = db.collection("sections").doc("home-hero");
  batch.set(sectionRef, {
    id: "home-hero",
    type: "hero",
    data: {
      title: { ar: "منتجاتنا المميزة", fr: "Nos produits phares" },
      subtitle: {
        ar: "اختاري الأفضل لبشرتك",
        fr: "Choisissez le meilleur pour votre peau",
      },
      ctaProductIds: ["prod-1", "prod-4", "prod-9"],
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // commit
  await batch.commit();
  console.log("Categories, products and sections created.");

  // 4) create an admin Auth user and set custom claim 'admin'
  const adminEmail = "admin@your-domain.test";
  const adminPassword = "ChangeThisStrongPw123!";

  try {
    // try to find an existing user
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

    // set custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    // optionally write user profile to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminEmail,
      displayName: "Super Admin",
      role: "admin",
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

  console.log("Seeding finished.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
