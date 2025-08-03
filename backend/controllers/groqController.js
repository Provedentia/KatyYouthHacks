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
        const prompt = `
        
You are an expert environmental analyst. Analyze ONLY the following product and its description. Focus exclusively on information about this specific product. 

Extract the carbon dioxide (CO2) footprint from the description if available. If not available, state that clearly. 

Provide environmental and eco tips, such as whether the product is recyclable, made from recycled materials, or has other eco-friendly features. 

Respond in the following format:

<Environmental Score>
Score: [1-10]

<CO2 Footprint>
[CO2 info or 'Not available']

<Environmental Tips>
[Tips and eco-friendly features]

<Explanation>
[Brief explanation for your score]

Product: ${product}

Description: ${description}`;
        
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

// Sends raw text and product name to Groq to keep only relevant sentences
exports.keepRelevantText = async (req, res) => {
    try {
        const { rawText, productName } = req.body;
        if (!rawText || !productName) {
            return res.status(400).json({ error: 'Missing rawText or productName in request body.' });
        }
        const prompt = `
You are a helpful assistant. Given the following text, return ONLY the sentences that are 
directly relevant to the product: "${productName}". Do not include unrelated information. 
Return the filtered sentences as a single string, preserving their original order.
\n\nText:\n${rawText}
`;
        const completion = await groq.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "user", content: prompt }
            ],
        });
        const relevantText = completion.choices[0].message.content;
        res.json({ relevantText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
};






