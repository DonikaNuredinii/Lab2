using Lab2_Backend.Configurations;
using Lab2_Backend.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Lab2_Backend.MongoService
{
    public class MongoAuditLogService
    {
        private readonly IMongoCollection<AuditLog> _auditLogs;

        public MongoAuditLogService(IOptions<MongoDBSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
            _auditLogs = database.GetCollection<AuditLog>("AuditLogs");
        }
        
        public async Task CreateAsync(AuditLog log)
        {
            await _auditLogs.InsertOneAsync(log);
        }

        // Regjistron hyrjen (login)  
        public async Task CreateLoginLogAsync(AuditLog log)
        {
            log.LoginTimestamp = DateTime.UtcNow;
            await _auditLogs.InsertOneAsync(log);
        }

        //  Përditëson logout timestamp-in për userin aktiv
        public async Task UpdateLogoutTimestampAsync(int userId)
        {
            var filter = Builders<AuditLog>.Filter.And(
                Builders<AuditLog>.Filter.Eq(log => log.UserId, userId),
                Builders<AuditLog>.Filter.Eq(log => log.LogoutTimestamp, null)
            );

            var update = Builders<AuditLog>.Update
                .Set(log => log.LogoutTimestamp, DateTime.UtcNow);

            await _auditLogs.UpdateOneAsync(filter, update);
        }

        //  Merr të gjitha log-et për dashboard
        public async Task<List<AuditLog>> GetAllLogsAsync()
        {
            return await _auditLogs.Find(_ => true).ToListAsync();
        }
    }
}
