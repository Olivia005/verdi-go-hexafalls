import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

// Configure multer for image handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

// ChatGPT text endpoint (keep existing)
router.post('/chat', async (req, res) => {
  try {
    const { message, max_tokens = 150 } = req.body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'api_key_here') {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: max_tokens,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'ChatGPT API error');
    }

    res.json({ response: data.choices[0].message.content });

  } catch (error) {
    console.error('ChatGPT error:', error);
    res.status(500).json({ error: 'ChatGPT API failed', fallback: true });
  }
});

// 🚀 TENSORFLOW IMAGE ANALYSIS ENDPOINT
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('🧠 Analyzing image with TensorFlow model...');
    console.log('📁 Dataset path:', process.env.AI_MODEL_PATH);
    
    const analysisResult = await analyzeWithTensorFlow(req.file);
    
    res.json(analysisResult);

  } catch (error) {
    console.error('❌ TensorFlow analysis error:', error);
    
    // Fallback to mock analysis if TensorFlow fails
    console.log('🔄 Falling back to mock analysis...');
    const mockResult = await getMockAnalysis(req.file);
    res.json(mockResult);
  }
});

// 🚀 TensorFlow Analysis Function
async function analyzeWithTensorFlow(file) {
  return new Promise((resolve, reject) => {
    try {
      // Create temp directory and file
      const tempDir = path.join(process.cwd(), 'temp');
      const tempImagePath = path.join(tempDir, `temp_${Date.now()}.jpg`);
      
      import('fs').then(fs => {
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Write image to temp file
        fs.writeFileSync(tempImagePath, file.buffer);
        
        // Path to TensorFlow script
        const tensorflowScriptPath = path.join(process.cwd(), 'ai_models', 'tensorflow_model.py');
        const datasetPath = process.env.AI_MODEL_PATH;
        
        console.log('🐍 Calling Python TensorFlow script...');
        console.log('📄 Script:', tensorflowScriptPath);
        console.log('📂 Dataset:', datasetPath);
        
        // Call Python TensorFlow script
        const python = spawn('python', [tensorflowScriptPath, datasetPath, tempImagePath]);
        
        let result = '';
        let error = '';
        
        python.stdout.on('data', (data) => {
          result += data.toString();
        });
        
        python.stderr.on('data', (data) => {
          error += data.toString();
          console.log('🐍 Python output:', data.toString());
        });
        
        python.on('close', (code) => {
          // Clean up temp file
          try {
            fs.unlinkSync(tempImagePath);
          } catch (e) {
            console.warn('⚠️ Failed to delete temp file:', e);
          }
          
          if (code === 0) {
            try {
              const analysisResult = JSON.parse(result);
              
              // Format response for frontend
              const formattedResult = {
                classifications: analysisResult.predictions,
                confidence: analysisResult.confidence,
                suggestions: generateEcoSuggestions(analysisResult.predictions),
                status: 'tensorflow_analysis',
                model_info: {
                  type: 'TensorFlow',
                  classes: analysisResult.all_classes
                }
              };
              
              resolve(formattedResult);
              
            } catch (e) {
              console.error('❌ Failed to parse TensorFlow output:', e);
              console.error('Raw output:', result);
              reject(new Error('Failed to parse TensorFlow script output'));
            }
          } else {
            console.error('❌ Python script failed with code:', code);
            console.error('Error output:', error);
            reject(new Error(`TensorFlow script failed: ${error}`));
          }
        });
      });
      
    } catch (error) {
      reject(new Error(`TensorFlow setup failed: ${error.message}`));
    }
  });
}

// Enhanced eco suggestions based on waste classification
function generateEcoSuggestions(classifications) {
  const suggestions = [];
  
  classifications.forEach(item => {
    const label = item.label.toLowerCase();
    const confidence = item.confidence;
    
    if (confidence > 0.7) { // High confidence suggestions
      if (label.includes('plastic')) {
        suggestions.push('♻️ High confidence: This plastic can be recycled! Check recycling codes.');
        suggestions.push('🌍 Consider switching to reusable alternatives to reduce plastic waste.');
      } else if (label.includes('organic') || label.includes('food')) {
        suggestions.push('🌱 High confidence: Perfect for composting! Start a home compost bin.');
        suggestions.push('♻️ Organic waste can reduce methane emissions by 30%.');
      } else if (label.includes('glass')) {
        suggestions.push('🔄 High confidence: Glass is infinitely recyclable without quality loss!');
      } else if (label.includes('metal')) {
        suggestions.push('⚡ High confidence: Metal recycling saves 95% of energy vs. new production.');
      } else if (label.includes('paper') || label.includes('cardboard')) {
        suggestions.push('📄 High confidence: Paper can be recycled up to 7 times.');
        suggestions.push('🌳 Recycling 1 ton of paper saves 17 trees!');
      } else if (label.includes('electronic')) {
        suggestions.push('🔌 High confidence: Take to e-waste centers for proper recycling.');
      }
    } else if (confidence > 0.4) { // Medium confidence
      suggestions.push(`🤔 Medium confidence: This might be ${label}. Check local waste guidelines.`);
    }
  });
  
  // Add general eco tips
  suggestions.push('🌍 Every small recycling action contributes to a healthier planet!');
  
  return [...new Set(suggestions)]; // Remove duplicates
}

// Keep mock analysis as fallback
async function getMockAnalysis(file) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    classifications: [
      { label: "Mixed Waste", confidence: 0.75 },
      { label: "Recyclable Material", confidence: 0.60 },
      { label: "Organic Matter", confidence: 0.45 }
    ],
    confidence: 0.75,
    suggestions: [
      "🤖 TensorFlow model unavailable - using fallback analysis",
      "♻️ Consider sorting waste into recyclable and non-recyclable categories",
      "🌱 Look for sustainable disposal options in your area"
    ],
    status: 'fallback_analysis'
  };
}

export default router;