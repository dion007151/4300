# 🔥 Setting Up Real Firebase Google Authentication for 4300

This guide explains how to connect your real **Firebase Web App** to **4300 ("For Free")** for 1-click Google Account login.

---

## Step 1 — Create a Firebase Project

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)** → Click **"Add project"**.
2. Name your project (e.g., `4300-platform`).
3. (Optional) Disable Google Analytics or leave default → Click **"Create project"**.

---

## Step 2 — Enable Google Sign-In Provider

1. In Firebase Console → Left Sidebar → Click **Build** → **Authentication**.
2. Click **"Get Started"** → Select **Google** under Additional Providers.
3. Toggle **Enable**.
4. Set **Project support email** to your email address (e.g. `dionimarflores9@gmail.com`).
5. Click **"Save"**.

---

## Step 3 — Register Web App & Get Config Keys

1. In Firebase Console → Click **Project Overview** (gear icon) → **Project settings**.
2. Scroll down to **"Your apps"** → Click the **Web (`</>`)** icon.
3. Register app name: `4300 Web`.
4. Copy your `firebaseConfig` keys.

---

## Step 4 — Add Environment Variables

### Local Development (`apps/web/.env.local`):

Add your keys to `apps/web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyYourFirebaseApiKey..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

### Vercel Deployment Settings:

In Vercel → Project → **Settings → Environment Variables**, add the 6 `NEXT_PUBLIC_FIREBASE_*` keys above.

---

## Step 5 — Add Authorized Domains in Firebase

In Firebase Console → **Authentication** → **Settings** tab → **Authorized domains**:
1. Click **"Add domain"**.
2. Add your live Vercel domain: `4300.vercel.app`.

---

## 🎯 Verification

1. Click **"Sign In"** in 4300.
2. Click **"Continue with Google Account"**.
3. Select your Google account in the popup window — you are now authenticated via real Firebase Google Auth!
