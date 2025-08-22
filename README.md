MitraAI
MitraAI is a cutting-edge chat application that seamlessly integrates with Google's powerful Gemini API. This project provides a user-friendly interface for interacting with the AI, allowing for natural and intuitive conversations. The application is architected with a robust backend and a dynamic frontend, ensuring a smooth and responsive user experience.

Live Demo 🚀
Experience MitraAI in action by visiting our live deployment:

mitraai-frontend.vercel.app

Features ✨
AI-Powered Conversations: Leverages the Gemini API for intelligent and context-aware responses.

Chat History: All conversations are saved and can be revisited at any time.

Real-time Interaction: Enjoy a dynamic and engaging chat experience with real-time message updates.

Sleek and Modern UI: A visually appealing and easy-to-navigate interface built with React.

Dockerized Deployment: The entire application is containerized with Docker for easy setup and deployment.

Tech Stack 🛠️
Frontend
React: A JavaScript library for building user interfaces.

Vite: A fast and lightweight build tool for modern web development.

React Router: For declarative routing in the React application.

Context API: For state management across the application.

Axios: A promise-based HTTP client for making requests to the backend.

Backend
Node.js: A JavaScript runtime for building server-side applications.

Express: A minimal and flexible Node.js web application framework.

MongoDB: A NoSQL database for storing chat history and user data.

Mongoose: An ODM library for MongoDB and Node.js.

Google Gemini API: The powerhouse behind the AI's conversational abilities.

Getting Started 🏁
Prerequisites
Node.js

npm

Docker

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/MitraAI.git
Navigate to the project directory:

Bash

cd MitraAI
Install dependencies for both frontend and backend:

Bash

npm install
cd Frontend && npm install
cd ../Backend && npm install
Set up environment variables:

Create a .env file in the Backend directory.

Add the following variables:

MONGO_URI=<your_mongodb_uri>
GOOGLE_API_KEY=<your_gemini_api_key>
Run the application with Docker Compose:

Bash

docker-compose up --build
The frontend will be available at http://localhost:5173 and the backend at http://localhost:8080.

Contributing 🤝
Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.
