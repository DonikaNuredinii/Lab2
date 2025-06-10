using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Lab2_Backend.Model
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        public string Content { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
