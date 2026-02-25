const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: userMessage }),
});

const data = await response.json();
setMessages([...messages, { role: "assistant", content: data.reply }]);