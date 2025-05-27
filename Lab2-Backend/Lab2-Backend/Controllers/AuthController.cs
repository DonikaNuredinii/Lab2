using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2_Backend.Helpers;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MyContext _context;

        public AuthController(MyContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == loginDto.Email);
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

            var result = new
            {
                user.UserID,
                user.FirstName,
                user.LastName,
                user.Email,
                Role = user.Role?.RoleName,
                Type = user.GetType().Name  // "User", "Staff", "Customer", etc.
            };

            return Ok(result);
        }
    }
}