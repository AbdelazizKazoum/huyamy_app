#!/usr/bin/env node
/**
 * Script to extract Firebase credentials from serviceAccountKey.json
 * and create environment variables for production deployment
 */

const fs = require("fs");
const path = require("path");

const keyPath = path.join(process.cwd(), "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error("❌ serviceAccountKey.json not found in project root");
  console.log(
    "Please download it from Firebase Console -> Project Settings -> Service Accounts"
  );
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

  console.log("🔥 Firebase Environment Variables for Production:");
  console.log("================================================");
  console.log(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
  console.log(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
  console.log(`FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"`);
  console.log("================================================");
  console.log("");
  console.log("📋 Instructions:");
  console.log("1. Copy these environment variables");
  console.log("2. Add them to your Vercel deployment:");
  console.log("   - Go to your Vercel project dashboard");
  console.log("   - Settings → Environment Variables");
  console.log("   - Add each variable above");
  console.log("3. Redeploy your project");
  console.log("");
  console.log("⚠️  Security Note:");
  console.log("- Never commit serviceAccountKey.json to git");
  console.log("- Add it to .gitignore");
  console.log("- Only use environment variables in production");
} catch (error) {
  console.error("❌ Error reading serviceAccountKey.json:", error.message);
  process.exit(1);
}
