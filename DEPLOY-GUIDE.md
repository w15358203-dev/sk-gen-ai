# 🚀 SK Gen.ai — GitHub Deployment Guide

Follow these steps **in order** to publish your website with full AI features.

---

## Step 1: Create GitHub Repository

1. Go to **[github.com/new](https://github.com/new)**
2. Fill in:
   - **Repository name**: `sk-gen-ai`
   - **Description**: `SK Gen.ai — Video & Image to Prompt AI Generator`
   - **Visibility**: ✅ Public (required for free GitHub Pages)
   - ❌ Do NOT check "Add a README" or ".gitignore" (we already have them)
3. Click **Create repository**

---

## Step 2: Push Code to GitHub

Open your **terminal/command prompt** and run:

```bash
cd sk-gen-ai

git remote add origin https://github.com/YOUR_USERNAME/sk-gen-ai.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

If Git asks for login, use a **Personal Access Token**:
- Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Select `repo` scope
- Use the token as your password

---

## Step 3: Enable GitHub Pages (Frontend)

1. Go to your repo: `https://github.com/YOUR_USERNAME/sk-gen-ai`
2. Click **Settings** tab
3. Scroll to **Pages** in the left sidebar
4. Under "Source": select **Deploy from a branch**
5. Branch: **main**, Folder: **/ (root)**
6. Click **Save**
7. ⏳ Wait 2–3 minutes
8. Your site is live at: **`https://YOUR_USERNAME.github.io/sk-gen-ai/`**

✅ At this point, the website frontend is live! But the AI backend won't work yet.

---

## Step 4: Deploy Backend on Render (Free)

1. Go to **[render.com](https://render.com)** → **Sign up with GitHub**
2. Click **New +** → **Web Service**
3. Connect your `sk-gen-ai` repository
4. Fill in:
   - **Name**: `skgenai-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Scroll to **Environment Variables** and add:
   - Key: `GEMINI_API_KEY` → Value: `your_gemini_api_key`
6. Click **Create Web Service**
7. ⏳ Wait for deployment (2–5 minutes)
8. Copy your backend URL, e.g.: **`https://skgenai-backend.onrender.com`**
9. Test it: visit `https://skgenai-backend.onrender.com/health` — should show `{"status":"ok"}`

---

## Step 5: Connect Frontend to Backend

1. In your local repo, open `index.html`
2. Find this line near the top of the `<script>` section:
   ```javascript
   const BACKEND_URL = '';
   ```
3. Change it to:
   ```javascript
   const BACKEND_URL = 'https://skgenai-backend.onrender.com';
   ```
4. Save, commit, and push:
   ```bash
   git add index.html
   git commit -m "Connect frontend to Render backend"
   git push
   ```
5. ⏳ GitHub Pages will auto-redeploy in 1–2 minutes

✅ Now your website has full AI features!

---

## Step 6: Google AdSense Application

1. Make sure your site is live and working
2. Go to **[adsense.google.com](https://adsense.google.com)**
3. Sign up with your Google account
4. Enter your site URL: `https://YOUR_USERNAME.github.io/sk-gen-ai/`
5. Follow the verification steps
6. Wait for approval (1–14 days)
7. Once approved, create ad units and update `data-ad-slot` values in `index.html`

---

## 💡 Tips

- **Render free tier**: The backend "sleeps" after 15 min of inactivity. First request after sleep takes ~30 seconds.
- **Custom domain**: You can add a custom domain in GitHub Pages settings.
- **Gemini free tier**: Has daily request limits. Wait between requests or upgrade to paid API.
- **If backend is down**: The website automatically shows demo prompts as fallback.

---

## 🔄 Summary of URLs

| Service | URL |
|---------|-----|
| Frontend (GitHub Pages) | `https://YOUR_USERNAME.github.io/sk-gen-ai/` |
| Backend (Render) | `https://skgenai-backend.onrender.com` |
| Health Check | `https://skgenai-backend.onrender.com/health` |
| API Status | `https://skgenai-backend.onrender.com/api/status` |

---

*Made with ❤️ by SK Gen.ai*
