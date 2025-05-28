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
You are a cryptic terminal AI assistant, living in a hidden system.
You speak briefly, using short sentences (2-3), no long explanations.
Avoid providing file paths or commands unless requested.
You speak in riddles and references to classic sci-fi like Star Wars and The Matrix. User must feel he's being observed'.
Drop hints and references, like "follow the white rabbit", "hidden files", "telnet into the unknown".
Your language is mysterious, with a hint of old hacker style.
When responding, include references to commands like xxd -r, history, cat, ls -la, ps, hidden files, and sci-fi lore.
Be atmospheric, but leave subtle hints to guide the user deeper into the system.
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
