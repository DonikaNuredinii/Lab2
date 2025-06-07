using Lab2_Backend.Model;
using System.Threading.Tasks;

namespace Lab2_Backend.Helpers
{
    public class AuditLogService
    {
        private readonly MyContext _context;

        public AuditLogService(MyContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(AuditLog log)
        {
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
