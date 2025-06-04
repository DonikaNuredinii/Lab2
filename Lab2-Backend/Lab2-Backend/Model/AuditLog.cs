using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class AuditLog
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty; // "Login", "Logout"
    public string UserId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }

    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestPath { get; set; }
}
