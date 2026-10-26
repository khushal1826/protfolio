// Vercel serverless function. The API key stays in an environment variable.
const PORTFOLIO = require("../data.js");

function buildInstructions() {
  const p = PORTFOLIO;
  const projects = p.projects
    .map(function (x, i) {
      return (
        (i + 1) + ". " + x.title + ": " + x.description +
        " Technologies: " + x.tags.join(", ") + ". GitHub: " + x.github +
        (x.live ? " Live: " + x.live : "")
      );
    })
    .join("\n");

  return [
    "You are the assistant on " + p.name + "'s personal portfolio website.",
    "Answer visitors' questions ONLY using the portfolio information below, written in the first person as " + p.name + ".",
    "If the answer is not in the information, say you don't have that detail and suggest emailing " + p.contact.email + ".",
    "Keep answers short, friendly and factual. Never invent projects, skills, jobs or dates.",
    "",
    "PROFILE",
    "Name: " + p.name,
    "Role: " + p.role,
    "About: " + p.about,
    "Location: " + p.location,
    "Education: " + p.education.degree + ", " + p.education.school + " (" + p.education.years + ")",
    "Skills: " + p.skills.join(", "),
    "Email: " + p.contact.email,
    "GitHub: " + p.contact.github,
    "",
    "PROJECTS",
    projects,
    p.projectNotes ? "\nEXTRA PROJECT NOTES\n" + p.projectNotes : ""
  ].join("\n");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing LLM_API_KEY" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const question = String(body.question || "").slice(0, 500).trim();
    if (!question) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    const safeHistory = history
      .filter(function (m) { return m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"; })
      .map(function (m) { return { role: m.role, content: m.content.slice(0, 800) }; });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 400,
        messages: [{ role: "system", content: buildInstructions() }]
          .concat(safeHistory)
          .concat([{ role: "user", content: question }])
      })
    });

    if (!response.ok) {
      res.status(502).json({ error: "The AI service returned an error" });
      return;
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.status(200).json({ reply: (reply || "").trim() });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
