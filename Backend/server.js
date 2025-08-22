import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: process.env.FRONTEND_URL, 
  optionsSuccessStatus: 200 
};


app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  ConnectDB();
});

const ConnectDB = async() => {
  try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
  }catch(err){
    console.error("MongoDB connection error:", err);
  }
}

// app.post("/test", async (req, res) => {

//   const userPrompt = req.body.prompt;

//   if (!userPrompt) {
//     return res.status(400).json({ error: "The 'prompt' field is required." });
//   }

  
//   const apiKey = process.env.GOOGLE_API_KEY;
//   const modelName = 'gemini-1.5-flash-latest'; 

//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

//   const requestBody = {
//     contents: [
//       {
//         parts: [
//           {
//             text: userPrompt
//           }
//         ]
//       }
//     ]
//   };


//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestBody),
//   };

//   try {

//     const response = await fetch(url, options);
    
//     if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error from Gemini:", errorData);
//         return res.status(response.status).json(errorData);
//     }

//     const data = await response.json();
//      const content =  data.candidates[0].content;

//      const role = content.role;
//      const text = content.parts[0].text;

//      const responselog = {
//       role : role,
//       text : text
//      };
//      console.log( responselog);
//     res.send(responselog);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     res.status(500).json({ error: "An internal error occurred." });
//   }
// });