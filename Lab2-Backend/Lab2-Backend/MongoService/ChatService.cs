using Lab2_Backend.Configurations;
using Lab2_Backend.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Lab2_Backend.MongoService
{
    public class ChatService
    {
        private readonly IMongoCollection<ChatMessage> _messages;

        public ChatService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _messages = database.GetCollection<ChatMessage>("Messages");
        }

        public async Task SaveMessage(ChatMessage message)
        {
            await _messages.InsertOneAsync(message);
        }

        public async Task<List<ChatMessage>> GetMessagesBetween(int userId1, int userId2)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.SenderId, userId1),
                    Builders<ChatMessage>.Filter.Eq(m => m.ReceiverId, userId2)
                ),
                Builders<ChatMessage>.Filter.And(
                    Builders<ChatMessage>.Filter.Eq(m => m.SenderId, userId2),
                    Builders<ChatMessage>.Filter.Eq(m => m.ReceiverId, userId1)
                )
            );

            return await _messages.Find(filter)
                                  .SortBy(m => m.Timestamp)
                                  .ToListAsync();
        }
    }
}
