import Groq from 'groq';

const MODEL_ID = "llama3-70b-8192";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const prompt = "You are going to go through this text and return how good for the environment this product is, giving it a score from 1 to 10"

exports.callGroq = async (prompt) => {
    console.log("Loaded GROQ_API_KEY:", !!process.env.GROQ_API_KEY);
    const completion = await groq.chat.completions
    .create({
        model: MODEL_ID,
        messages: [
            { role: "system", content: "This is a " },
            { role: "user", content: prompt }],
    });
    console.log(completion);
    return completion.choices[0].message.content;
};







