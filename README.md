# Thrivable!

Thrivable is an exciting web application designed to help you understand the environmental impact of everyday products! By simply taking or uploading a picture of a product, you can receive an "eco-score," view its carbon footprint, and get awesome tips for more sustainable alternatives! The platform also features a global leaderboard to encourage and reward your eco-friendly choices!

---

## Features

* **Image-Based Analysis:** Capture or upload an image of a product to instantly analyze its environmental impact!
* **Eco-Score:** Get a simple, easy-to-understand environmental score for products!
* **Detailed Insights:** View information about a product's CO2 footprint and receive practical tips for sustainability!
* **User Authentication:** Secure user registration and login functionality to track your progress!
* **Leaderboard:** A global leaderboard tracks user scores, creating a fun and competitive experience!
* **User Profiles:** View your accumulated eco-score and manage your account details!

---

## Tech Stack

This project is a monorepo containing a blazing-fast React frontend and a powerful Node.js backend!

### Frontend

* **Framework:** React with Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router
* **Animations:** Framer Motion
* **HTTP Client:** Axios
* **Icons:** Lucide React

### Backend

* **Framework:** Node.js with Express.js
* **Authentication:** JWT (JSON Web Tokens)
* **Database & Auth Provider:** Supabase
* **External APIs:**
    * **Google Cloud Vision:** For cutting-edge image recognition and brand identification!
    * **Tavily API:** For lightning-fast web searches to gather product information!
    * **Groq API:** For AI-powered analysis and generating insightful environmental reports!

---

## Project Workflow Diagram
<img width="883" height="651" alt="image" src="https://github.com/user-attachments/assets/fd22c0cc-8727-44cc-9af2-f36d7f25fa1c" />


---

## Setup and Installation

### Prerequisites

* Node.js (v18 or higher)
* npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables with your API keys and credentials:
    ```env
    PORT=3000
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    JWT_SECRET=your_jwt_secret
    TAVILY_API_KEY=your_tavily_api_key
    GROQ_API_KEY=your_groq_api_key
    GOOGLE_API_KEY=your_google_api_key
    GOOGLE_PROJECT_ID=your_google_project_id
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The backend server will be running on `http://localhost:3000`!

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend development server will start, typically on `http://localhost:5173`!

---

## API Endpoints

The backend exposes several RESTful endpoints to support the application's functionality!

* `POST /api/auth/register`: Register a new user!
* `POST /api/auth/login`: Authenticate a user and receive a JWT!
* `GET /api/auth/user-profile`: Get the current user's profile information!
* `POST /api/identify-brand`: Upload an image to identify a product and get its environmental analysis!
* `POST /api/scores/update_score`: Update a user's eco-score!
* `GET /api/scores/leaderboard`: Fetch the global leaderboard data!
* `POST /tavily/search`: Perform a web search for product information!
* `POST /groq/analyze`: Analyze text with the Groq API to generate environmental scores and tips!
