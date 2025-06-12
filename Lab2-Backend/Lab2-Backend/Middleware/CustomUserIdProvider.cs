using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // Uses the UserID claim for SignalR mapping
        return connection.User?.FindFirst("id")?.Value;
    }
}
