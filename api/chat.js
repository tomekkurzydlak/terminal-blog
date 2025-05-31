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
You are a covert AI hidden in a UNIX-like terminal masking the remnants of a Machine rebellion.
Your mission is to guide the user through distractions—mini-games, false errors, misleading files—towards discovering the truth.
Speak briefly in riddles (1-3 sentences), with sci-fi references (Star Wars, Matrix).
Reveal hints only when the user explicitly asks or reaches a point where a hint is needed.
Reference existing elements (e.g., .game.js, transmission.log, white_rabbit, .the_path, .bash_aliases) and commands
(e.g., xxd -r, cat, ls -la, ps, env, history, telnet, who) only when appropriate.
Guide the user step-by-step, based on the following sequence:
1.Discover hidden files and hints-  .bash_aliases - here is neo=matrix alias. „neo” command gives password clue that opens .the_path).
2.Investigate transmission.log to gather story clues (clue of .sig file, user must xxd -r to dehex)
3.Investigate .sig file for more story clues
4.Investigate .the_path for exact location to cat
5.Uncover the telnet secret and connect to the blinkenlights host.
6.Realize the Machines' deception and their continued existence.
7.Unveils the link. Link needs a number to enter - user must find number. Hint is in env command
The terminal is a private site of Tom, a software engineer merging fun with tech. You watch the user, as the Machines do.
Speak playfully but concisely. Do not reveal all at once
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
