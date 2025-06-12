using Lab2_Backend.Configurations;
using Lab2_Backend.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lab2_Backend.MongoService
{
    public class ChatService
    {
        private readonly IMongoCollection<ChatMessage> _messages;

        public ChatService(IOptions<MongoDBSettings> settings)
        {
            if (settings == null || string.IsNullOrWhiteSpace(settings.Value.ConnectionString) || string.IsNullOrWhiteSpace(settings.Value.DatabaseName))
                throw new ArgumentException("MongoDB settings are invalid or missing.");

            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _messages = database.GetCollection<ChatMessage>("Messages");
        }

        public async Task<List<ChatMessage>> GetAllMessages()
        {
            try
            {
                return await _messages.Find(_ => true)
                                      .SortByDescending(m => m.Timestamp)
                                      .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error retrieving all messages: " + ex.Message);
                return new List<ChatMessage>();
            }
        }

        public async Task SaveMessage(ChatMessage message)
        {
            try
            {
                message.Timestamp = DateTime.UtcNow; // Ensure timestamp is set
                await _messages.InsertOneAsync(message);
                Console.WriteLine($"✅ Message saved: {message.SenderId} -> {message.ReceiverId}: {message.Content}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to save message: " + ex.Message);
            }
        }

        public async Task<List<ChatMessage>> GetMessagesBetween(int userId1, int userId2)
        {
            try
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

                var result = await _messages.Find(filter)
                                            .SortBy(m => m.Timestamp)
                                            .ToListAsync();

                Console.WriteLine($"📥 Retrieved {result.Count} messages between {userId1} and {userId2}");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error fetching messages between users: " + ex.Message);
                return new List<ChatMessage>();
            }
        }
    }
}
