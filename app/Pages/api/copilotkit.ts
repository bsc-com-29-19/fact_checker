import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API hit: /api/copilot");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  console.log("Received message:", message);

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // Use an env variable
  if (!OPENAI_API_KEY) {
    console.error("Missing OpenAI API Key");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      }),
    });

    const responseData = await openaiResponse.json();
    console.log("OpenAI response:", responseData);

    const reply = responseData.choices?.[0]?.message?.content || "I couldn't find an answer.";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error fetching AI response:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
