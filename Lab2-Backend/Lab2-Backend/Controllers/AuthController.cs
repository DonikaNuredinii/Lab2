// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Lab2_Backend.Model; 
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Lab2_Backend.Helpers;



// namespace Lab2_Backend.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class AuthController : ControllerBase
//     {
//         private readonly MyContext _context;
//         private readonly IConfiguration _config;
//         private readonly AuditLogService _auditLogService;

//         public AuthController(MyContext context, IConfiguration config, AuditLogService auditLogService)
//         {
//             _context = context;
//             _config = config;
//             _auditLogService = auditLogService;
//         }

//         [HttpPost("login")]
//         public async Task<ActionResult<object>> Login([FromBody] LoginDto loginDto)
//         {
//             var user = await _context.Users.Include(u => u.Role)
//                                            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

//             if (user == null || !PasswordHelper.VerifyPassword(loginDto.Password, user.Password))
//             {
//                 return Unauthorized("Invalid credentials.");
//             }

//             string token = TokenHelper.GenerateToken(user, _config);

//             return Ok(new
//             {
//                 Token = token,
//                 User = new
//                 {
//                     user.UserID,
//                     user.FirstName,
//                     user.LastName,
//                     user.Email,
//                     Role = user.Role?.RoleName ?? "Unknown"
//                 }
//             });
//         }

//         [HttpPost("signup")]
//         public async Task<ActionResult<UserDto>> SignUp(UserCreateDto userDto)
//         {
//             if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
//                 return BadRequest("Email already exists.");

//             var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
//             if (defaultRole == null)
//                 return BadRequest("Default role 'Customer' not found.");

//             var user = new User
//             {
//                 FirstName = userDto.FirstName,
//                 LastName = userDto.LastName,
//                 Email = userDto.Email,
//                 PhoneNumber = userDto.PhoneNumber,
//                 Password = PasswordHelper.HashPassword(userDto.Password),
//                 CreationDate = DateTime.UtcNow,
//                 RoleID = defaultRole.RoleID
//             };

//             _context.Users.Add(user);
//             await _context.SaveChangesAsync();

//             var createdUserDto = new UserDto
//             {
//                 UserID = user.UserID,
//                 FirstName = user.FirstName,
//                 LastName = user.LastName,
//                 Email = user.Email,
//                 PhoneNumber = user.PhoneNumber,
//                 CreationDate = user.CreationDate,
//                 RoleID = user.RoleID,
//                 RoleName = defaultRole.RoleName
//             };

//             return CreatedAtAction("GetUser", "User", new { id = user.UserID }, createdUserDto);
//         }

//         [Authorize]
//         [HttpPost("logout")]
//         public async Task<IActionResult> Logout()
//         {
//             var userId = User.FindFirst("id")?.Value ?? "unknown";

//             await _auditLogService.CreateAsync(new AuditLog
//             {
//                 Action = "Logout",
//                 UserId = userId,
//                 Timestamp = DateTime.UtcNow,
//                 IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
//                 UserAgent = Request.Headers["User-Agent"].ToString(),
//                 RequestPath = HttpContext.Request.Path
//             });

//             return Ok(new { message = "Logged out successfully. Please delete the token on client side." });
//         }
//     }
// }
