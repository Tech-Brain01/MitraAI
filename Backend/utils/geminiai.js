import "dotenv/config";

export const getGeminiAPIResponse = async (userPrompt) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const modelName = "gemini-1.5-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: userPrompt }],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Gemini API failed");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return {
      role: "assistant",
      text,
    };
  } catch (err) {
    console.error("Error in getGeminiAPIResponse:", err.message);
    throw err;
  }
};

export default getGeminiAPIResponse;
