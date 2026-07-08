# 🚀 SK Gen.ai — Complete GitHub Deployment Guide (From Zero)

## ═══════════════════════════════════════════════
## OPTION 1: Easy Way — Upload via GitHub Website
## (No terminal, no git commands needed!)
## ═══════════════════════════════════════════════

### Step 1: Create GitHub Account
1. Go to https://github.com/signup
2. Enter your email → Create password → Choose username → Click "Create account"
3. Verify your email (check inbox)
4. Choose Free plan → Skip customization → Click "Complete setup"

### Step 2: Create a New Repository
1. Go to https://github.com/new
2. Repository name: `sk-gen-ai`
3. Description: `SK Gen.ai — Video & Image to Prompt AI Generator`
4. Select: ✅ Public (IMPORTANT — needed for free GitHub Pages)
5. ❌ Do NOT check "Add a README file"
6. ❌ Do NOT add .gitignore or license
7. Click "Create repository"

### Step 3: Upload Your Files
1. In your new empty repo, click **"uploading an existing file"**
2. Unzip `SK-Gen-ai-GitHub-Ready.zip` on your computer
3. Drag & drop ALL files from the unzipped folder into the GitHub page:
   - ✅ .env.example
   - ✅ .gitignore
   - ✅ 404.html
   - ✅ _headers
   - ✅ ADSENSE-GUIDE.md
   - ✅ DEPLOY-GUIDE.md
   - ✅ README.md
   - ✅ index.html
   - ✅ package.json
   - ✅ robots.txt
   - ✅ server.js
   - ✅ sitemap.xml
   - ⚠️ Do NOT upload .env (it has your API key — add it later on Render)
4. In the commit message box, type: `🚀 SK Gen.ai website`
5. Click **"Commit changes"**

### Step 4: Enable GitHub Pages (Your Website Goes Live!)
1. Go to your repo → **Settings** tab
2. Scroll left sidebar → Click **Pages**
3. Under "Source": select **Deploy from a branch**
4. Branch: select **main**, folder: **/ (root)**
5. Click **Save**
6. ⏳ Wait 2-3 minutes
7. 🎉 Your site is LIVE at:
   **https://YOUR_USERNAME.github.io/sk-gen-ai/**

---

## ═══════════════════════════════════════════════
## OPTION 2: Terminal Way — Using Git Commands
## (If you have git installed on your computer)
## ═══════════════════════════════════════════════

### Step 1: Create GitHub Account
(Same as Option 1, Step 1)

### Step 2: Create a New Repository
(Same as Option 1, Step 2)

### Step 3: Open Terminal & Run Commands

#### On Windows:
- Press `Win + R` → type `cmd` → press Enter

#### On Mac:
- Press `Cmd + Space` → type `terminal` → press Enter

#### On Linux:
- Press `Ctrl + Alt + T`

Then run these commands ONE BY ONE:

```bash
# Go to where you unzipped the file (change the path to match your computer)
cd Downloads/sk-gen-ai

# OR if you unzipped elsewhere:
# cd Desktop/sk-gen-ai
# cd /home/user/sk-gen-ai

# Initialize git repository
git init

# Add all files
git add .

# Commit the files
git commit -m "🚀 SK Gen.ai website"

# Rename branch to main
git branch -M main

# Connect to your GitHub repo (REPLACE YOUR_USERNAME with your actual username!)
git remote add origin https://github.com/YOUR_USERNAME/sk-gen-ai.git

# Push the code to GitHub
git push -u origin main
```

If GitHub asks for login:
- Username: your GitHub username
- Password: use a **Personal Access Token** (NOT your GitHub password)
  - Go to: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Select "repo" scope → Generate → Copy the token
  - Paste it as your password

### Step 4: Enable GitHub Pages
(Same as Option 1, Step 4)

---

## ═══════════════════════════════════════════════
## NEXT: Deploy Backend on Render (For AI Features)
## ═══════════════════════════════════════════════

1. Go to https://render.com → Sign up with GitHub
2. Click **New +** → **Web Service**
3. Connect your `sk-gen-ai` repository
4. Settings:
   - Name: `skgenai-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: Free
5. Scroll to **Environment Variables** → Add:
   - Key: `GEMINI_API_KEY`
   - Value: `AQ.Ab8RN6LJv47D7oLXYRfvL-RuJEagE-h2eLvvwSvyPIZedyk_NA`
6. Click **Create Web Service**
7. Wait 2-5 minutes for deployment
8. Copy your backend URL (e.g. `https://skgenai-backend.onrender.com`)

### Connect Frontend to Backend
1. Go to your GitHub repo
2. Open `index.html`
3. Find: `const BACKEND_URL = '';`
4. Change to: `const BACKEND_URL = 'https://skgenai-backend.onrender.com';`
5. Commit the change → GitHub Pages auto-redeploys in 1-2 minutes

✅ Your website now has full AI features!

---

## ═══════════════════════════════════════════════
## GOOGLE ANALYTICS SETUP
## ═══════════════════════════════════════════════

1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Account name: `SK Gen.ai`
4. Create a property: `SK Gen.ai Website`
5. Enter your URL: `https://YOUR_USERNAME.github.io/sk-gen-ai/`
6. Copy the Measurement ID (looks like `G-ABC123XYZ`)
7. In your GitHub repo, edit `index.html`
8. Find `G-XXXXXXXXXX` (appears twice) and replace with your real ID
9. Commit the change

---

## ═══════════════════════════════════════════════
## ADSENSE SETUP (After site is live)
## ═══════════════════════════════════════════════

1. Make sure your site is live and working first
2. Go to https://adsense.google.com
3. Sign up → Enter your site URL
4. Wait for approval (1-14 days)
5. Once approved, create ad units and replace `data-ad-slot="auto"` with real slot IDs

---

## 📋 Checklist

- [ ] Create GitHub account
- [ ] Create repository `sk-gen-ai`
- [ ] Upload files (Option 1) OR push code (Option 2)
- [ ] Enable GitHub Pages
- [ ] Verify site is live at `https://YOUR_USERNAME.github.io/sk-gen-ai/`
- [ ] Deploy backend on Render
- [ ] Update BACKEND_URL in index.html
- [ ] Set up Google Analytics
- [ ] Apply for AdSense

---

*Made with ❤️ by SK Gen.ai*
