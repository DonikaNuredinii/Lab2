const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.send(
    JSON.stringify({
      senderId: "bot",
      content: "Welcome to the chat!",
    })
  );
});
