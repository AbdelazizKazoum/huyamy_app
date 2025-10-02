# 🚀 Deployment Guide

## Firebase Configuration for Production

This project uses Firebase Admin SDK for server-side operations. For security reasons, we use environment variables in production instead of committing the service account key file.

### 🔧 Setup for Vercel Deployment

1. **Extract Firebase Credentials**
   ```bash
   node scripts/extractFirebaseEnv.js
   ```

2. **Add Environment Variables to Vercel**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Environment Variables
   - Add the following variables:

   ```env
   FIREBASE_PROJECT_ID=huyamy-6923a
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@huyamy-6923a.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
   [Your private key content]
   -----END PRIVATE KEY-----"
   ```

3. **Redeploy**
   ```bash
   git add .
   git commit -m "Configure Firebase for production"
   git push origin main
   ```

### 🔒 Security Best Practices

- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ Environment variables are used for production
- ✅ Private keys are properly formatted with escaped newlines
- ✅ Local development uses `.env.local` (also gitignored)

### 🛠️ Local Development

For local development, the app will automatically use the environment variables from `.env.local`. If you need to regenerate them:

```bash
node scripts/extractFirebaseEnv.js
```

Then copy the output to your `.env.local` file.

### 📁 File Structure

```
├── serviceAccountKey.json        # Local development only (gitignored)
├── .env.local                   # Local environment variables (gitignored)
├── .env.example                 # Template for environment variables
├── scripts/
│   └── extractFirebaseEnv.js    # Helper script to extract credentials
└── src/
    └── lib/
        └── firebaseAdmin.ts     # Firebase Admin configuration
```

### 🔍 Troubleshooting

**Error: "Module not found: Can't resolve serviceAccountKey.json"**
- ✅ Fixed: App now uses environment variables for production

**Error: "Firebase credentials not found"**
- Check that all three environment variables are set in Vercel
- Ensure the private key includes the full content with newlines

**Error: "Invalid private key"**
- Make sure the private key is wrapped in quotes
- Ensure newlines are properly escaped as `\\n`

### 🌍 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `huyamy-6923a` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-xxx@project.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Private key with escaped newlines | `"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"` |
