import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded relative to Backend even if process is started elsewhere
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

export const getGeminiAPIResponse = async (userPrompt) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // Use one of the available models from your API
  // Options in order of recommendation:
  // 1. gemini-2.5-flash - Latest stable flash model
  // 2. gemini-2.0-flash - Previous stable version
  // 3. gemini-flash-latest - Points to latest flash model
  // 4. gemini-pro-latest - Latest pro model (more capable but slower)
  
  const modelName = 'gemini-2.5-flash';  // Using the latest stable flash model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: userPrompt
      }]
    }],
    // Add generation config for better results
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Response:", errorData);
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Add validation to check if response has expected structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Invalid response structure from Gemini API");
    }
    
    const content = data.candidates[0].content;
    // Gemini returns 'model' as role, but your MongoDB schema expects 'assistant'
    const role = content.role === 'model' ? 'assistant' : content.role;
    const text = content.parts[0].text;

    return {
      role: role,
      text: text
    };

  } catch (err) {
    console.error("Error in getGeminiAPIResponse:", err);
    // Return a fallback error message instead of throwing
    return {
      role: 'assistant',
      text: 'Sorry, I encountered an error processing your request. Please try again.'
    };
  }
};

// Alternative function with model fallback support
export const getGeminiAPIResponseWithFallback = async (userPrompt) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // List of models to try in order of preference
  const modelsToTry = [
    'gemini-2.5-flash',        // Latest and fastest
    'gemini-2.0-flash',        // Stable fallback
    'gemini-flash-latest',     // Always points to latest
    'gemini-2.5-flash-lite',   // Lighter version if others fail
  ];
  
  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: userPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const content = data.candidates[0].content;
          const role = content.role === 'model' ? 'assistant' : content.role;
          const text = content.parts[0].text;
          
          // console.log(`Successfully used model: ${model}`);
          return {
            role: role,
            text: text
          };
        }
      } else {
        const errorData = await response.json();
        // console.error(`Model ${model} failed:`, errorData.error?.message);
        continue;
      }
    } catch (err) {
      // console.error(`Error with model ${model}:`, err.message);
      continue; 
    }
  }
  
  return {
    role: 'assistant',
    text: 'Sorry, I encountered an error processing your request. Please try again later.'
  };
};

export default getGeminiAPIResponse;