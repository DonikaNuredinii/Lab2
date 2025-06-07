using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model;
using System.Threading.Tasks;
using Lab2_Backend.Helpers;
using Lab2_Backend.MongoService;  // AuditLogService namespace
using Microsoft.AspNetCore.Authorization;


namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IConfiguration _config;
        private readonly AuditLogService _auditLogService;


        public AuthController(MyContext context, AuditLogService auditLogService, IConfiguration config)
        {
            _context = context;
            _auditLogService = auditLogService;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !PasswordHelper.VerifyPassword(loginDto.Password, user.Password))
            {
                return Unauthorized("Invalid credentials.");
            }

            if (user is Staff staff)
            {
                staff.LastLogin = DateTime.UtcNow;
                _context.Entry(staff).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

    
            await _auditLogService.CreateAsync(new AuditLog
            {
                Action = "Login",
                UserId = user.UserID.ToString(),
                Timestamp = DateTime.UtcNow,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString(),
                RequestPath = HttpContext.Request.Path
            });

            
            var token = TokenHelper.GenerateToken(user, _config); 

    
            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.UserID,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    Role = user.Role?.RoleName,
                    Type = user.GetType().Name
                }
            });
        }


        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst("id")?.Value ?? "unknown";

            await _auditLogService.CreateAsync(new AuditLog
            {
                Action = "Logout",
                UserId = userId,
                Timestamp = DateTime.UtcNow,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString(),
                RequestPath = HttpContext.Request.Path
            });

            return Ok(new { message = "Logged out successfully. Please delete the token on client side." });
        }


    }
}
