// Chatbot interface: sends the question to /api/chat and shows the reply.
(function () {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const box = document.getElementById("chatMessages");
  const history = [];

  function addMessage(text, kind) {
    const div = document.createElement("div");
    div.className = "msg " + kind;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    input.value = "";
    sendBtn.disabled = true;
    const thinking = addMessage("Thinking...", "bot");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, history: history.slice(-6) })
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
      const data = await res.json();
      if (!data.reply) throw new Error("Empty reply");
      thinking.textContent = data.reply;
      history.push({ role: "user", content: question });
      history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      thinking.className = "msg error";
      thinking.textContent =
        "Sorry, the chatbot couldn't answer right now. Please try again in a moment, or email me directly.";
    } finally {
      sendBtn.disabled = false;
      box.scrollTop = box.scrollHeight;
    }
  });
})();
