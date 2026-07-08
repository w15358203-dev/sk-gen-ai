const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://skgenai.github.io',
        /^https:\/\/[a-z0-9-]+\.github\.io$/,
        /^https:\/\/[a-z0-9-]+\.onrender\.com$/,
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
        /^https:\/\/[a-z0-9-]+\.netlify\.app$/
    ],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (our HTML pages)
// Health check — must be before static middleware
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

app.use(express.static(__dirname));

// Upload directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({
    dest: UPLOAD_DIR,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// ─── Provider Detection ─────────────────────────────────────
function getProvider() {
    if (process.env.OPENAI_API_KEY) return 'openai';
    if (process.env.GEMINI_API_KEY) return 'gemini';
    if (process.env.HUGGINGFACE_API_KEY) return 'huggingface';
    return null;
}

// ─── OpenAI (GPT-4o) ────────────────────────────────────────
async function generateWithOpenAI(imageBase64, frames, mediaType) {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const content = [];

    if (mediaType === 'video' && frames && frames.length > 0) {
        content.push({
            type: 'text',
            text: 'Analyze these video frames and generate a detailed, production-ready AI prompt that describes the video content. Include camera movements, lighting, mood, colors, composition, and style. Make it suitable for AI video generation platforms like Runway, Kling AI, or Veo 3.'
        });
        for (let i = 0; i < Math.min(frames.length, 4); i++) {
            content.push({
                type: 'image_url',
                image_url: { url: frames[i], detail: 'high' }
            });
        }
    } else {
        content.push({
            type: 'text',
            text: mediaType === 'image'
                ? 'Analyze this image and generate a detailed, production-ready AI prompt that describes it. Include composition, lighting, colors, mood, style, texture, and artistic details. Make it suitable for AI image generation platforms like Midjourney, DALL·E, or Stable Diffusion.'
                : 'Analyze this media and generate a detailed, production-ready AI prompt.'
        });
        content.push({
            type: 'image_url',
            image_url: { url: imageBase64, detail: 'high' }
        });
    }

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
            role: 'system',
            content: 'You are an expert AI prompt engineer. Generate detailed, vivid, and technically precise prompts for AI generation tools. Focus on visual details, artistic style, lighting, composition, mood, and camera work. Output only the prompt text, no explanations or prefixes.'
        }, {
            role: 'user',
            content
        }],
        max_tokens: 500,
        temperature: 0.7
    });

    return response.choices[0].message.content.trim();
}

// ─── Google Gemini ───────────────────────────────────────────
async function generateWithGemini(imageBase64, frames, mediaType) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try models in order of preference
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            const promptParts = [];

            if (mediaType === 'video' && frames && frames.length > 0) {
                promptParts.push({
                    text: 'Analyze these video frames and generate a detailed, production-ready AI prompt for the video. Include camera movements, lighting, mood, colors, composition, and style. Output only the prompt text.'
                });
                for (let i = 0; i < Math.min(frames.length, 4); i++) {
                    const base64Data = frames[i].split(',')[1] || frames[i];
                    promptParts.push({
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Data
                        }
                    });
                }
            } else {
                promptParts.push({
                    text: 'Analyze this image and generate a detailed, production-ready AI prompt. Include composition, lighting, colors, mood, style, texture, and artistic details. Suitable for Midjourney, DALL·E, or Stable Diffusion. Output only the prompt text.'
                });
                const base64Data = imageBase64.split(',')[1] || imageBase64;
                promptParts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                });
            }

            const result = await model.generateContent(promptParts);
            const response = await result.response;
            return response.text().trim();
        } catch (e) {
            const msg = e.message || '';
            if (msg.includes('429') || msg.includes('quota')) {
                throw new Error('Gemini API quota exceeded. Wait a minute and try again, or add an OpenAI API key for unlimited access.');
            }
            if (msg.includes('404') || msg.includes('not found')) {
                console.log(`Model ${modelName} not available, trying next...`);
                continue;
            }
            throw e;
        }
    }

    throw new Error('No available Gemini model found. Try adding an OpenAI API key instead.');
}

// ─── Hugging Face (Free Fallback) ──────────────────────────
async function generateWithHuggingFace(imageBase64, frames, mediaType) {
    const HF_API_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';
    const HF_API_URL_LARGE = 'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning';

    const headers = {};
    if (process.env.HUGGINGFACE_API_KEY) {
        headers['Authorization'] = `Bearer ${process.env.HUGGINGFACE_API_KEY}`;
    }

    let imageToAnalyze;

    if (mediaType === 'video' && frames && frames.length > 0) {
        // Use the middle frame for video
        imageToAnalyze = frames[Math.floor(frames.length / 2)];
    } else {
        imageToAnalyze = imageBase64;
    }

    // Remove data URL prefix if present
    const base64Data = imageToAnalyze.split(',')[1] || imageToAnalyze;
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Try BLIP model first
    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/octet-stream' },
            body: imageBuffer
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data[0] && data[0].generated_text) {
                const rawCaption = data[0].generated_text;
                return enhanceCaptionToPrompt(rawCaption, mediaType);
            }
        }
    } catch (e) {
        console.log('BLIP model failed, trying vit-gpt2...');
    }

    // Fallback to vit-gpt2
    try {
        const response = await fetch(HF_API_URL_LARGE, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/octet-stream' },
            body: imageBuffer
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data[0] && data[0].generated_text) {
                const rawCaption = data[0].generated_text;
                return enhanceCaptionToPrompt(rawCaption, mediaType);
            }
        }
    } catch (e) {
        console.log('vit-gpt2 model also failed');
    }

    throw new Error('All Hugging Face models failed. Try again or add an OpenAI/Gemini API key for better results.');
}

// ─── Enhance raw caption to production prompt ───────────────
function enhanceCaptionToPrompt(caption, mediaType) {
    const isVideo = mediaType === 'video';

    const templates = [
        `${isVideo ? 'Cinematic shot of' : 'A detailed depiction of'} ${caption}, dramatic lighting with soft shadows, rich color palette, ${isVideo ? 'smooth camera movement, 4K, cinematic color grading' : '8K resolution, intricate details, professional composition'}`,
        `${caption}, ${isVideo ? 'tracking shot with gentle camera motion, volumetric lighting' : 'studio-quality lighting, sharp focus'}, artistic style with attention to detail, ${isVideo ? '24fps cinematic motion' : 'high dynamic range'}`,
        `${isVideo ? 'A cinematic sequence showing' : 'A visually stunning rendering of'} ${caption}, ${isVideo ? 'with dynamic camera angles and atmospheric lighting' : 'with masterful composition and evocative lighting'}, ${isVideo ? 'professional video quality, anamorphic lens' : 'photorealistic detail, award-winning composition'}`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// ─── API Routes ─────────────────────────────────────────────

// Health check
app.get('/api/status', (req, res) => {
    const provider = getProvider();
    res.json({
        status: 'online',
        provider: provider || 'none',
        providerName: provider === 'openai' ? 'OpenAI GPT-4o' :
                      provider === 'gemini' ? 'Google Gemini' :
                      provider === 'huggingface' ? 'Hugging Face' : 'Not configured',
        configured: !!provider
    });
});

// Main prompt generation endpoint
app.post('/api/generate-prompt', upload.single('file'), async (req, res) => {
    try {
        const provider = getProvider();

        if (!provider) {
            return res.status(400).json({
                error: 'No AI provider configured. Please add an API key to the .env file. See .env.example for details.',
                setupRequired: true
            });
        }

        const mediaType = req.body.type || 'image'; // 'image' or 'video'
        let imageBase64 = null;
        let frames = null;

        // ─── Handle file upload ─────────────────────────
        if (req.file) {
            const filePath = req.file.path;
            try {
                // Convert to base64
                const buffer = fs.readFileSync(filePath);
                const base64 = buffer.toString('base64');

                // Check if it's an image or video
                const mimetype = req.file.mimetype;
                if (mimetype.startsWith('image/')) {
                    imageBase64 = `data:${mimetype};base64,${base64}`;
                } else if (mimetype.startsWith('video/')) {
                    // For videos, we can't extract frames server-side easily
                    // Client should send frames instead
                    return res.status(400).json({
                        error: 'Video files should be processed client-side. The frontend will extract frames and send them as images.',
                        hint: 'Use the frame extraction feature in the browser.'
                    });
                } else {
                    return res.status(400).json({ error: 'Unsupported file type' });
                }
            } finally {
                // Clean up uploaded file
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }

        // ─── Handle base64 image data ───────────────────
        if (req.body.imageData) {
            imageBase64 = req.body.imageData;
        }

        // ─── Handle video frames ────────────────────────
        if (req.body.frames) {
            try {
                frames = typeof req.body.frames === 'string' ? JSON.parse(req.body.frames) : req.body.frames;
            } catch (e) {
                frames = [req.body.frames];
            }
        }

        // ─── Handle URL ─────────────────────────────────
        if (req.body.url && !imageBase64 && !frames) {
            try {
                const urlResponse = await fetch(req.body.url);
                const buffer = Buffer.from(await urlResponse.arrayBuffer());
                const contentType = urlResponse.headers.get('content-type') || 'image/jpeg';
                const base64 = buffer.toString('base64');
                imageBase64 = `data:${contentType};base64,${base64}`;
            } catch (e) {
                return res.status(400).json({ error: 'Failed to fetch image from URL. Make sure the URL is accessible.' });
            }
        }

        if (!imageBase64 && !frames) {
            return res.status(400).json({ error: 'No image or video data provided. Please upload a file, paste a URL, or provide video frames.' });
        }

        console.log(`[SK Gen.ai] Generating prompt with ${provider} (${mediaType})...`);

        // ─── Call the appropriate provider ──────────────
        let prompt;

        switch (provider) {
            case 'openai':
                prompt = await generateWithOpenAI(imageBase64, frames, mediaType);
                break;
            case 'gemini':
                prompt = await generateWithGemini(imageBase64, frames, mediaType);
                break;
            case 'huggingface':
                prompt = await generateWithHuggingFace(imageBase64, frames, mediaType);
                break;
        }

        console.log(`[SK Gen.ai] Prompt generated successfully (${prompt.length} chars)`);

        res.json({ prompt, provider });

    } catch (error) {
        console.error('[SK Gen.ai] Error:', error.message);

        // Provide helpful error messages
        if (error.message.includes('API key')) {
            return res.status(401).json({ error: 'Invalid API key. Check your .env file.' });
        }
        if (error.message.includes('quota')) {
            return res.status(429).json({ error: 'API quota exceeded. Try again later or use a different provider.' });
        }
        if (error.message.includes('rate limit')) {
            return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' });
        }

        res.status(500).json({
            error: 'Failed to generate prompt. ' + error.message,
            fallback: true
        });
    }
});

// ─── SPA fallback ────────────────────────────────────────────
app.get('*', (req, res) => {
    const htmlPath = path.join(__dirname, req.path.endsWith('.html') ? req.path : 'index.html');
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.listen(PORT, () => {
    const provider = getProvider();
    console.log('\n' + '═'.repeat(50));
    console.log('  🚀 SK Gen.ai Server Running');
    console.log('═'.repeat(50));
    console.log(`  URL:      http://localhost:${PORT}`);
    console.log(`  Provider: ${provider ? provider.toUpperCase() : 'NONE CONFIGURED'}`);
    if (!provider) {
        console.log('');
        console.log('  ⚠️  No AI provider configured!');
        console.log('  Add an API key to .env file:');
        console.log('    - OPENAI_API_KEY (Recommended)');
        console.log('    - GEMINI_API_KEY (Free tier)');
        console.log('    - HUGGINGFACE_API_KEY (Free)');
        console.log('  See .env.example for details.');
    }
    console.log('═'.repeat(50) + '\n');
});
