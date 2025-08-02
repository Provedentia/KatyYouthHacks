# Sustain-ify Backend

This is the backend server for the Sustain-ify application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3000
   TAVILY_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Base URL
`http://localhost:3000`

### Available Routes

#### GET /
- Description: Home route
- Response: Welcome message

#### GET /tavily
- Description: Get data from Tavily endpoint
- Response: Information about Tavily service

#### POST /tavily
- Description: Process data through Tavily
- Request Body: `{ "query": "your search query" }`
- Response: Search results from Tavily

## Dependencies

- Express.js - Web framework
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variable management
