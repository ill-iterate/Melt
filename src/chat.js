// Assuming config.js defines CONFIG.ANTHROPIC_API_KEY
async function sendMessageToAnthropic(message) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}

function addMessage(message, isUser = false) {
  const chatMessages = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();

  if (message) {
    // Display user message
    addMessage(message, true);
    messageInput.value = "";

    // Get and display bot response
    const response = await sendMessageToAnthropic(message);
    addMessage(response);
  }
});
