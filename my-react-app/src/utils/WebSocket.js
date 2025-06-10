const WebSocket = require("ws");
const url = require("url");

// Track connected clients by userId
const clients = new Map();

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
  const parameters = url.parse(req.url, true).query;
  const userId = parameters.userId;

  if (!userId) {
    ws.close();
    return;
  }

  clients.set(userId, ws);
  console.log(`User ${userId} connected`);

  ws.send(
    JSON.stringify({
      senderId: "bot",
      content: "Welcome to the chat!",
    })
  );

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const { senderId, receiverId, content } = data;

    console.log(`Message from ${senderId} to ${receiverId}: ${content}`);

    // Save to DB here if needed

    // Send to receiver if they're online
    const receiverSocket = clients.get(receiverId?.toString());
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
      receiverSocket.send(
        JSON.stringify({
          senderId,
          content,
        })
      );
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected`);
    clients.delete(userId);
  });
});
