using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Threading.Tasks;
using Lab2_Backend.MongoService;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.DependencyInjection;
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
                var token = context.Request.Query["token"].ToString();
                var userIdParam = context.Request.Query["userId"].ToString();

                if (string.IsNullOrWhiteSpace(token) || !int.TryParse(userIdParam, out int userId))
                {
                    context.Response.StatusCode = 401;
                    return;
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParams = _serviceProvider.GetRequiredService<TokenValidationParameters>();

                try
                {
                    var principal = tokenHandler.ValidateToken(token, validationParams, out _);
                    var claimUserId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                    if (claimUserId != userId.ToString())
                    {
                        context.Response.StatusCode = 403;
                        return;
                    }

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();

                    using var scope = _serviceProvider.CreateScope();
                    var chatService = scope.ServiceProvider.GetRequiredService<ChatService>();

                    await WebSocketHandler.Handle(webSocket, userId, chatService);
                }
                catch (SecurityTokenException ex)
                {
                    Console.WriteLine("JWT validation failed: " + ex.Message);
                    context.Response.StatusCode = 401;
                }
            }
            else
            {
                await _next(context);
            }
        }
    }
}
