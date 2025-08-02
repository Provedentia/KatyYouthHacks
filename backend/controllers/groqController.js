const Groq = require("groq-sdk");

const MODEL_ID = "llama3-70b-8192";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Express route handler for POST /groq/analyze
exports.callGroq = async (req, res) => {
    try {
        const { product, description } = req.body;
        if (!product || !description) {
            return res.status(400).json({ error: 'Missing product or description in request body.' });
        }
        const prompt = `You are an expert environmental analyst. Analyze the following product and its description, and rate how good it is for the environment, giving it a score from 1 to 10. Provide a brief explanation for your score.\n\nProduct: ${product}\n\nDescription: ${description}`;
        
        const completion = await groq.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
        });
        
        const result = completion.choices[0].message.content;
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
};







