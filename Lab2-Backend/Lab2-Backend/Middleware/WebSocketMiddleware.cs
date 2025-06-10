using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Threading.Tasks;
using Lab2_Backend.MongoService;
using System;

namespace Lab2_Backend.Middleware
{
    public class WebSocketMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceProvider _serviceProvider;

        public WebSocketMiddleware(RequestDelegate next, IServiceProvider serviceProvider)
        {
            _next = next;
            _serviceProvider = serviceProvider;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path == "/ws" && context.WebSockets.IsWebSocketRequest)
            {
                var user = context.User;
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    context.Response.StatusCode = 401;
                    return;
                }

                var webSocket = await context.WebSockets.AcceptWebSocketAsync();

                using var scope = _serviceProvider.CreateScope();
                var chatService = scope.ServiceProvider.GetRequiredService<ChatService>();

                await WebSocketHandler.Handle(webSocket, userId, chatService); 
            }
            else
            {
                await _next(context);
            }
        }
    }
}
