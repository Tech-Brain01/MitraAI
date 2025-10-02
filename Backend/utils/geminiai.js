import "dotenv/config";

export const getGeminiAPIResponse = async (userPrompt) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const modelName = 'gemini-1.5-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: userPrompt
      }]
    }]
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
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    const content = data.candidates[0].content;
    const role = content.role;
    const text = content.parts[0].text;

    return {
      role: role,
      text: text
    };

  } catch (err) {
    console.error("Error in getGeminiAPIResponse:", err);
    throw err;
  }
};

export default getGeminiAPIResponse;