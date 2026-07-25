# 🚀 Deploying 4300 to Vercel

## Step 1 — Push to GitHub

Make sure your project is pushed to GitHub first:

```bash
cd C:\Users\dioni\Documents\4300
git add .
git commit -m "feat: mobile responsive + Vercel deploy ready"
git push
```

---

## Step 2 — Import on Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign in
2. Click **"Add New Project"**
3. Select your `4300` GitHub repository
4. Vercel will auto-detect Next.js

**Override these settings:**

| Setting | Value |
|---------|-------|
| Framework Preset | **Next.js** |
| Root Directory | `apps/web` |
| Build Command | `npm run build` |
| Output Directory | `.next` *(leave default)* |
| Install Command | `npm install` |

---

## Step 3 — Add Environment Variables

In Vercel → Project → **Settings → Environment Variables**, add:

### Required (AI works without Python server)
| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | *(your key from console.groq.com — already in `apps/api/.env`)* |
| `AI_PROVIDER` | `groq` |
| `AUTH_SECRET` | *(run `openssl rand -base64 32` to generate a strong secret)* |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` *(your actual Vercel URL)* |

### Email OTP (optional but recommended)
| Key | Value |
|-----|-------|
| `GMAIL_APP_PASSWORD` | *(Gmail → Security → 2-Step → App Passwords)* |

### Google OAuth (optional — set to `true` when configured)
| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | *(from console.cloud.google.com)* |
| `GOOGLE_CLIENT_SECRET` | *(from console.cloud.google.com)* |
| `NEXT_PUBLIC_GOOGLE_CONFIGURED` | `true` |

> ⚠️ **Google OAuth redirect URI:** Add `https://your-app.vercel.app/api/auth/callback/google` in Google Cloud Console

### GitHub OAuth (optional)
| Key | Value |
|-----|-------|
| `GITHUB_CLIENT_ID` | *(from github.com/settings/developers)* |
| `GITHUB_CLIENT_SECRET` | *(from github.com/settings/developers)* |
| `NEXT_PUBLIC_GITHUB_CONFIGURED` | `true` |

> ⚠️ **GitHub OAuth callback URL:** Add `https://your-app.vercel.app/api/auth/callback/github` in GitHub OAuth App settings

---

## Step 4 — Deploy!

Click **"Deploy"** — Vercel will build and deploy automatically.

After deploy, your app will be live at:  
`https://your-project-name.vercel.app`

---

## Step 5 — Custom Domain (optional)

In Vercel → Settings → **Domains** → Add your domain.

---

## What works on Vercel (no extra server needed)

| Feature | Status |
|---------|--------|
| AI Chatbot (Groq) | ✅ Works via Next.js API route |
| Email OTP Login | ✅ Works with Gmail App Password |
| Google OAuth | ✅ Works after adding credentials |
| GitHub OAuth | ✅ Works after adding credentials |
| All 40+ Tool Pages | ✅ Static/client-rendered |
| Resume Builder | ✅ |
| Productivity Tools | ✅ |
| Image/Video/Document pages | ✅ |

> The Python API (`apps/api`) is **NOT needed** on Vercel. The AI chat was moved to a Next.js API route.

---

## Redeploy after changes

Every `git push` to your main branch auto-deploys on Vercel. ✨
