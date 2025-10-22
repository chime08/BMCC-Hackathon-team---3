const chatDiv = document.getElementById('chat');
const form = document.getElementById('form');
const promptInput = document.getElementById('prompt');

function addMessage(text, who = 'ai') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${who}`;

  const meta = document.createElement('div');
  meta.className = 'meta';
  const now = new Date();
  meta.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  msgDiv.appendChild(meta);

  const content = document.createElement('div');
  content.className = 'content';
  content.textContent = text;
  msgDiv.appendChild(content);
  chatDiv.appendChild(msgDiv);

  chatDiv.scrollTop = chatDiv.scrollHeight;
  return msgDiv;
}

// Example API call placeholder (replace URL or logic with your real endpoint)
async function askBackend(prompt) {
  try {
    // For now, simulate AI with a fake math reply
    const simulatedReply = `Let's solve that step by step... (this is where the AI's reply will appear).`;
    await new Promise(r => setTimeout(r, 800)); // small delay for realism
    return simulatedReply;

    /* 
    To connect a real API later:
    const resp = await fetch('YOUR_BACKEND_URL/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await resp.json();
    return data.reply || "Sorry, no response.";
    */
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// Render math expressions if found
function renderMath(msgDiv) {
  const contentDiv = msgDiv.querySelector('.content');
  try {
    katex.render(contentDiv.textContent, contentDiv, { throwOnError: false, displayMode: true });
  } catch {}
}

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

// Greeting
addMessage('🍂 Welcome! Ask me a calculus question like "differentiate x² sin(x)" or "integrate x³ from 0 to 1".', 'ai');
