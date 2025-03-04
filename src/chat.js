document.getElementById("chatForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  messageInput.value = "";

  // Add user message to chat
  addMessageToChat(message, "user");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const botResponse = data.content[0].text;
    addMessageToChat(botResponse, "bot");
  } catch (error) {
    console.error("Error:", error);
    addMessageToChat("Sorry, there was an error processing your request.", "bot");
  }
});

function addMessageToChat(message, sender) {
  const chatMessages = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Check login status
if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "../index.html";
}
