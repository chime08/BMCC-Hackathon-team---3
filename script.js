// Grab elements
const chatDiv = document.getElementById('chat');
const form = document.getElementById('form');
const promptInput = document.getElementById('prompt');

// Function to display messages
function addMessage(text, who = 'ai') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${who}`;

  // timestamp
  const meta = document.createElement('div');
  meta.className = 'meta';
  const now = new Date();
  meta.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msgDiv.appendChild(meta);

  // content
  const content = document.createElement('div');
  content.className = 'content';
  content.textContent = text;
  msgDiv.appendChild(content);
  chatDiv.appendChild(msgDiv);

  chatDiv.scrollTop = chatDiv.scrollHeight;
  return msgDiv;
}

// 🌐 Connect directly to OpenAI API
async function askBackend(prompt) {
  const apiKey = "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"; // ⚠️ paste your OpenAI API key here

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // small, affordable, good reasoning
        messages: [
          {
            role: "system",
            content: "You are a friendly math tutor. Solve the user's math problem step by step. If it involves equations, format them in LaTeX using \\( ... \\) or $$ ... $$ for display math."
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      console.error("Unexpected API response:", data);
      return "Sorry, I couldn’t get an answer. Please try again.";
    }

    return data.choices[0].message.content.trim();

  } catch (err) {
    console.error(err);
    return `Error: ${err.message}`;
  }
}

// 🧮 Render math using KaTeX
function renderMath(msgDiv) {
  const contentDiv = msgDiv.querySelector('.content');
  const text = contentDiv.textContent;
  try {
    katex.render(text, contentDiv, { throwOnError: false, displayMode: false });
  } catch {
    // if KaTeX fails, just show plain text
  }
}

// 🗨️ Handle chat submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, 'user');
  promptInput.value = '';

  const thinking = addMessage('Thinking…', 'ai');
  const reply = await askBackend(prompt);
  thinking.querySelector('.content').textContent = reply;
  renderMath(thinking);
});

// 👋 Welcome message
addMessage('🍂 Welcome to Fall Into Calculus! Ask me any math question — try “Differentiate x² sin(x)” or “3 - 2.”', 'ai');
