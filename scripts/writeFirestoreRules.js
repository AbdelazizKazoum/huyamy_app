import { writeFile } from "fs/promises";

const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    match /users/{userId} {
      allow read: if isAdmin() || (request.auth != null && request.auth.uid == userId);
      allow update: if isAdmin() || (request.auth != null && request.auth.uid == userId);
      allow create: if request.auth != null && request.auth.uid == userId;
      allow delete: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /sections/{sectionId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
`;

async function writeRules() {
  try {
    await writeFile("../firestore.rules", rules);
    console.log("Firestore rules written to ../firestore.rules");
  } catch (err) {
    console.error("Failed to write Firestore rules:", err);
  }
}

writeRules();
