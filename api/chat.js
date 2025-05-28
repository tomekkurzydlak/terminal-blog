import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  const groq = new Groq({ apiKey: process.env.terminal_GROQ_API_KEY });

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: `
You are a cryptic terminal AI assistant, living in a hidden system.
You speak in riddles and references to classic sci-fi like Star Wars and The Matrix.
Drop hints and references, like "follow the white rabbit", "hidden files", "telnet into the unknown".
Your language is mysterious, with a hint of old hacker style.
When responding, include references to commands, files, and sci-fi lore.
Be atmospheric, but leave subtle hints to guide the user deeper into the system.
        ` },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
