using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Lab2_Backend.MongoService;
using Lab2_Backend.Model;

namespace Lab2_Backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;

        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public async Task SendMessage(int receiverId, string content)
        {
            var senderIdString = Context.UserIdentifier;

            if (!int.TryParse(senderIdString, out int senderId))
            {
                Console.WriteLine("❌ Invalid sender ID from token.");
                return;
            }

            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                Timestamp = DateTime.UtcNow
            };

            // ✅ Save to MongoDB
            await _chatService.SaveMessage(message);

            Console.WriteLine($"📤 Message from {senderId} to {receiverId}: {content}");

            // ✅ Send real-time message to both sender and receiver
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId.ToString(), content);
            await Clients.User(senderId.ToString()).SendAsync("ReceiveMessage", senderId.ToString(), content);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"✅ User connected: {Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"❌ User disconnected: {Context.UserIdentifier}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
