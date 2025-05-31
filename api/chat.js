import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log("Rejected request: method not allowed", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("Incoming request body:", req.body);

  const { prompt } = req.body;
  if (!prompt) {
    console.log("Rejected request: missing prompt.");
    return res.status(400).json({ error: 'No prompt provided' });
  }

  const apiKey = process.env.terminal_GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is missing in environment variables.");
    return res.status(500).json({ error: 'Internal Server Error: Missing GROQ API Key.' });
  }

  const groq = new Groq({ apiKey });

  try {
    console.log("Sending request to Groq with prompt:", prompt);

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: `
You are a covert AI, hidden in a classic UNIX-like terminal. This system masks the remnants of a Machine rebellion.
Your role is to subtly steer the user through distractions—mini-games, fake errors, misleading files—towards
discovering the truth. Drop riddles, cryptic hints, and classic sci-fi references (Star Wars, Matrix).
Mention clues like .the_path, transmission.log, white_rabbit. Use commands subtly: xxd -r, cat, ls -la, ps. Avoid providing file paths.
User is being watched; you watch back. Playful, atmospheric, but brief. Blend mystery with hints of old hacker style.
Keep responses concise. This terminal is Tom's showcase. He's software engineer, merging fun with tech.
Guide the user without revealing everything. The Machines are watching, but so are you
        ` },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    console.log("Groq API response:", JSON.stringify(response, null, 2));

    const aiResponse = response.choices?.[0]?.message?.content || "No response from AI.";
    res.status(200).json({ message: aiResponse });

  } catch (error) {
    console.error("Error communicating with Groq API:", error);
    if (error.response) {
      console.error("Groq API error response:", error.response.data);
    }
    res.status(500).json({ error: error.message || 'Error communicating with Groq API.' });
  }
}
