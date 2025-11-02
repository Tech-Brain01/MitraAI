import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

// Resolve .env relative to this file so it works no matter where Node is started from
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 8080;

const allowedOrigins = [
  "https://mitra-ai-rho.vercel.app",
  process.env.FRONTEND_URL,
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  ConnectDB();
});

const ConnectDB = async() => {
  try{
      if (!process.env.MONGO_URI) {
        console.error("MongoDB connection error: MONGO_URI is not set. Ensure Backend/.env exists and is loaded.");
        return;
      }
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