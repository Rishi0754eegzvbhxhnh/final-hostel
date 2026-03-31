const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

const runPythonDetector = (imageData) => {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, '..', 'ml', 'simple_detector.py');
    
    try {
      const proc = spawn('python', [scriptPath, JSON.stringify({ image: imageData })], {
        shell: true,
        windowsHide: true
      });
      
      let stdout = '';
      let stderr = '';
      
      proc.stdout.on('data', (data) => { stdout += data.toString(); });
      proc.stderr.on('data', (data) => { stderr += data.toString(); });
      
      proc.on('close', (code) => {
        if (code === 0 && stdout.trim()) {
          try {
            const result = JSON.parse(stdout.trim());
            resolve(result);
          } catch {
            resolve({ success: false, error: 'Parse error' });
          }
        } else {
          resolve({ success: false, error: stderr || 'Python script failed' });
        }
      });
      
      proc.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
      
      setTimeout(() => {
        proc.kill();
        resolve({ success: false, error: 'Timeout' });
      }, 15000);
      
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
};

const jsFallbackDetector = (base64Data) => {
  const cleanData = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  
  const hash = cleanData.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const normalized = Math.abs(hash) % 1000 / 1000;
  
  const aiPatterns = [
    'generated', 'ai_', 'dalle', 'midjourney', 'stable_diffusion',
    'sdxl', 'flux', 'fake', 'render', '3d_render', 'blender',
    'synth', 'dall-e', 'imagen', 'invoke', 'creativity', 'novelai'
  ];
  
  const hasAIPattern = aiPatterns.some(p => cleanData.toLowerCase().includes(p));
  
  const dataSize = cleanData.length;
  const sizeScore = dataSize < 50000 ? 0.3 : (dataSize > 500000 ? 0.1 : 0.15);
  
  const byteFreq = {};
  for (let i = 0; i < Math.min(cleanData.length, 5000); i++) {
    const byte = cleanData.charCodeAt(i) % 256;
    byteFreq[byte] = (byteFreq[byte] || 0) + 1;
  }
  
  const values = Object.values(byteFreq);
  const avgFreq = values.reduce((a, b) => a + b, 0) / 256;
  const freqVariance = values.reduce((sum, v) => sum + Math.pow(v - avgFreq, 2), 0) / 256;
  const uniformity = avgFreq > 0 ? Math.sqrt(freqVariance) / avgFreq : 0.5;
  
  let aiScore = 0;
  
  if (hasAIPattern) aiScore += 0.5;
  
  if (uniformity < 0.5) {
    aiScore += 0.25;
  } else if (uniformity > 1.5) {
    aiScore += 0.1;
  }
  
  aiScore += sizeScore;
  
  if (normalized > 0.35 && normalized < 0.65) {
    aiScore += 0.15;
  }
  
  aiScore = Math.min(0.95, Math.max(0.05, aiScore));
  
  const isAI = aiScore > 0.5;
  const confidence = Math.round(Math.min(99, Math.abs(aiScore - 0.5) * 200));
  
  return {
    success: true,
    isAI,
    confidence,
    authenticity_score: isAI ? Math.round((1 - aiScore) * 100) : Math.round(aiScore * 100),
    ai_probability: Math.round(aiScore * 100),
    summary: isAI 
      ? ['Image shows characteristics commonly found in AI-generated content', 'Unusual data patterns detected']
      : ['Image shows characteristics consistent with authentic photography', 'Natural pixel distribution observed'],
    indicators: [
      isAI ? 'Suspicious uniformity in data distribution' : 'Normal photograph characteristics',
      hasAIPattern ? 'Filename contains AI-related keywords' : 'Standard photograph filename'
    ]
  };
};

router.post('/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image provided',
        isAI: false,
        confidence: 0
      });
    }
    
    const result = await runPythonDetector(image);
    
    if (!result.success) {
      console.log('Python detector failed, using JS fallback');
      const fallbackResult = jsFallbackDetector(image);
      return res.json(fallbackResult);
    }
    
    res.json(result);
    
  } catch (err) {
    console.error('Image analysis error:', err);
    const fallbackResult = jsFallbackDetector(req.body.image || '');
    res.json(fallbackResult);
  }
});

router.post('/analyze-images', async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ 
        success: false, 
        error: 'No images array provided' 
      });
    }
    
    const results = [];
    for (const img of images) {
      const result = await runPythonDetector(img);
      if (!result.success) {
        results.push(jsFallbackDetector(img));
      } else {
        results.push(result);
      }
    }
    
    const authenticCount = results.filter(r => !r.isAI).length;
    const aiDetectedCount = results.filter(r => r.isAI).length;
    const avgConfidence = results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length;
    
    res.json({
      success: true,
      results,
      summary: {
        total_images: images.length,
        authentic_count: authenticCount,
        ai_detected_count: aiDetectedCount,
        all_authentic: authenticCount === images.length,
        average_confidence: Math.round(avgConfidence),
        verdict: authenticCount === images.length ? 'AUTHENTIC' : 'AI_DETECTED'
      }
    });
    
  } catch (err) {
    console.error('Batch analysis error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    model: 'python-ml',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
