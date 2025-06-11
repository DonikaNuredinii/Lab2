using Lab2_Backend.Model;
using Lab2_Backend.MongoService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly MongoAuditLogService _auditLogService;

        public AuditLogController(MongoAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<AuditLog>>> GetAllAuditLogs()
        {
            var logs = await _auditLogService.GetAllLogsAsync();
            return Ok(logs);
        }
    }
}
