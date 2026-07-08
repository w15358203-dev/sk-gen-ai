# 🚀 SK Gen.ai — Video & Image to Prompt AI Generator

**SK Gen.ai** transforms any video or image into detailed, accurate text prompts using cutting-edge AI. Built with a bold gradient dark theme, glassmorphism, and animated background orbs.

![SK Gen.ai](https://img.shields.io/badge/SK-Gen.ai-7C3AED?style=for-the-badge&logo=ai&logoColor=white)

## ✨ Features

- 🎬 **Video to Prompt** — Upload any video, get detailed AI-generated text prompts
- 🖼️ **Image to Prompt** — Transform images into prompts for Midjourney, DALL·E, Stable Diffusion
- 🤖 **Real AI Backend** — Powered by Google Gemini / OpenAI / Hugging Face
- 🌐 **10+ Pages** — Home, Video, Image, Features, How It Works, Platforms, Pricing, About, FAQ, Contact, Privacy, Terms
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🎨 **Beautiful UI** — Dark theme with purple/pink/blue gradients, glassmorphism, animated orbs
- 💰 **Google AdSense** — Ready with ad placements
- 🔒 **Privacy Policy & Terms** — AdSense-compliant legal pages

## 🏗️ Architecture

```
Frontend (GitHub Pages)  →  index.html (SPA — all pages in one file)
Backend (Render/Railway) →  server.js  (Node.js + Express + AI APIs)
```

## 📦 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/sk-gen-ai.git
cd sk-gen-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_key_here

# 4. Start the server
npm start

# 5. Open in browser
# http://localhost:3000
```

## 🌐 Deployment Guide

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SK Gen.ai website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sk-gen-ai.git
git push -u origin main
```

### Step 2: Deploy Frontend on GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Choose **main** branch, folder **/ (root)**, click **Save**
4. Your site will be live at: `https://YOUR_USERNAME.github.io/sk-gen-ai/`

### Step 3: Deploy Backend on Render (Free)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo `sk-gen-ai`
4. Settings:
   - **Name**: `skgenai-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add **Environment Variables**:
   - `GEMINI_API_KEY` = your_gemini_api_key
6. Click **Create Web Service**
7. Copy your backend URL (e.g., `https://skgenai-backend.onrender.com`)

### Step 4: Connect Frontend to Backend

Edit `index.html` and update the backend URL:

```javascript
const BACKEND_URL = 'https://skgenai-backend.onrender.com';
```

Then push the change:
```bash
git add index.html
git commit -m "Connect to deployed backend"
git push
```

## 💰 Google AdSense Setup

See [ADSENSE-GUIDE.md](ADSENSE-GUIDE.md) for detailed instructions.

Quick steps:
1. Deploy site publicly first
2. Apply at [adsense.google.com](https://adsense.google.com)
3. Replace `ca-pub-6708275279834644` with your approved publisher ID if needed
4. Create ad units in AdSense dashboard and replace `data-ad-slot="auto"` with real slot IDs

## 🔧 Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Recommended (free tier) |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Optional |
| `PORT` | Server port (default: 3000) | No |

## 📁 File Structure

```
sk-gen-ai/
├── index.html          # Complete SPA website (all pages)
├── server.js           # Node.js backend with AI integration
├── package.json        # Dependencies
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── ADSENSE-GUIDE.md    # AdSense setup guide
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (SPA)
- **Backend**: Node.js, Express
- **AI**: Google Gemini 2.0 Flash, OpenAI GPT-4o, Hugging Face
- **Hosting**: GitHub Pages (frontend) + Render (backend)

## 📄 License

© 2026 SK Gen.ai. All rights reserved.
