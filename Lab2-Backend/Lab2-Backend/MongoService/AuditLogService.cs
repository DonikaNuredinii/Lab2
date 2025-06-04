using Lab2_Backend.Configurations;
using Lab2_Backend.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Lab2_Backend.MongoService
{
    public class AuditLogService
    {
        private readonly IMongoCollection<AuditLog> _auditLogs;

        public AuditLogService(IOptions<MongoDBSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
            _auditLogs = database.GetCollection<AuditLog>("AuditLogs");
        }

        public async Task CreateAsync(AuditLog log) =>
            await _auditLogs.InsertOneAsync(log);
    }
}
