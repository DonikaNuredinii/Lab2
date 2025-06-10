using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Lab2_Backend.Model;
using Lab2_Backend.MongoService;

public static class WebSocketHandler
{
    private static readonly ConcurrentDictionary<int, WebSocket> _clients = new();
    private static ChatService _chatService;

    public static void Configure(ChatService chatService)
    {
        _chatService = chatService;
    }

    public static async Task Handle(WebSocket socket, int userId, ChatService chatService)
    {
        _clients[userId] = socket;

        var buffer = new byte[1024 * 4];

        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                _clients.TryRemove(userId, out _);
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
                break;
            }

            var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
            var message = JsonSerializer.Deserialize<ChatMessage>(json);

            message.SenderId = userId;
            message.Timestamp = DateTime.UtcNow;

            await _chatService.SaveMessage(message);

            if (_clients.TryGetValue(message.ReceiverId, out var receiverSocket) && receiverSocket.State == WebSocketState.Open)
            {
                var responseJson = JsonSerializer.Serialize(message);
                var bytes = Encoding.UTF8.GetBytes(responseJson);
                await receiverSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}
