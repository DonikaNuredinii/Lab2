using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Lab2_Backend.Services;
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

            if (int.TryParse(senderIdString, out int senderId))
            {
                var message = new ChatMessage
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Content = content
                };

                await _chatService.SaveMessage(message);
                await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", senderId.ToString(), content);
            }
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"User connected: {Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }
    }
}
