using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Lab2_Backend.Model
{
    public class AuditLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? RoleId { get; set; }

        public DateTime? LoginTimestamp { get; set; }
        public DateTime? LogoutTimestamp { get; set; }

        public string? UserAgent { get; set; }  
    }
}
