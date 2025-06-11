using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2_Backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lab2_Backend.MongoService;
using Lab2_Backend.Migrations;




namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IConfiguration _config;
        private readonly MongoAuditLogService _auditLogService;

        public UserController(MyContext context, IConfiguration config, MongoAuditLogService auditLogService)
        {
            _context = context;
            _config = config;
            _auditLogService = auditLogService;
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                                      .Include(u => u.Role)  // Include Role so we get RoleName
                                      .Select(user => new UserDto
                                      {
                                          UserID = user.UserID,
                                          FirstName = user.FirstName,
                                          LastName = user.LastName,
                                          Email = user.Email,
                                          PhoneNumber = user.PhoneNumber,
                                          CreationDate = user.CreationDate,
                                          RoleID = user.RoleID,
                                          RoleName = user.Role != null ? user.Role.RoleName : null
                                      })
                                      .ToListAsync();

            return Ok(users);
        }

        //Get with ID
       [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                                     .Include(u => u.Role)
                                     .FirstOrDefaultAsync(u => u.UserID == id);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CreationDate = user.CreationDate,
                RoleID = user.RoleID,
                RoleName = user.Role != null ? user.Role.RoleName : null
            };

            return userDto;
        }


    
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(UserCreateDto userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                Password = PasswordHelper.HashPassword(userDto.Password),
                CreationDate = userDto.CreationDate,
                RoleID = userDto.RoleID
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Re-fetch with Role
            var createdUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == user.UserID);

            var result = new UserDto
            {
                UserID = createdUser.UserID,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                Email = createdUser.Email,
                PhoneNumber = createdUser.PhoneNumber,
                CreationDate = createdUser.CreationDate,
                RoleID = createdUser.RoleID,
                RoleName = createdUser.Role != null ? createdUser.Role.RoleName : null
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, result);
        }



        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                Console.WriteLine("Login attempt: " + loginDto.Email);

                var user = await _context.Users.Include(u => u.Role)
                                               .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                {
                    Console.WriteLine("User not found.");
                    return Unauthorized("Invalid credentials.");
                }

                if (!PasswordHelper.VerifyPassword(loginDto.Password, user.Password))
                {
                    Console.WriteLine("Password mismatch.");
                    return Unauthorized("Invalid credentials.");
                }

                
                string token = TokenHelper.GenerateToken(user, _config);
                string refreshToken = TokenHelper.GenerateRefreshToken();
        
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _context.SaveChangesAsync();
                await _auditLogService.CreateLoginLogAsync(new AuditLog
                {
                    UserId = user.UserID,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    RoleId = user.RoleID,
                    UserAgent = Request.Headers["User-Agent"].ToString()
                });


                Console.WriteLine("Tokens generated and saved successfully.");
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(1)
                });



                return Ok(new
                {
                    token,
                    userId = user.UserID,
                    user = new
                    {
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        role = user.Role?.RoleName ?? "Unknown",
                        type = user.GetType().Name,
                        restaurantId = user is Staff staffUser ? staffUser.RestaurantID : null

                    }
                });


            }
            catch (Exception ex)
            {
                Console.WriteLine("Login error: " + ex);
                return StatusCode(500, $"Login failed: {ex.Message}");
            }
        }





        // Signup
        [HttpPost("signup")]
        public async Task<ActionResult<UserDto>> SignUp(UserCreateDto userDto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
                return BadRequest("Email already exists.");
        
            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (defaultRole == null)
                return BadRequest("Default role 'User' not found.");
        
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                Password = PasswordHelper.HashPassword(userDto.Password),
                CreationDate = DateTime.UtcNow,
                RoleID = defaultRole.RoleID 
            };
        
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        
            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, userDto);
        }


        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst("id")?.Value ?? "unknown";

            try
            {
                if (int.TryParse(userId, out int parsedId))
                {
                    await _auditLogService.UpdateLogoutTimestampAsync(parsedId);
                }

                // ✅ FSHIRJA E COOKIE-S
                Response.Cookies.Delete("refreshToken", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/" // 🔥 kjo është thelbësore – duhet të përputhet me path-in e vendosjes
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Audit log during logout failed: " + ex.Message);
            }

            return Ok(new { message = "Logged out successfully. Please delete the token on client side." });
        }



        //[HttpPost("migrate-passwords")]
        //public async Task<IActionResult> MigratePasswords()
        //{
        //    var users = await _context.Users.ToListAsync();

        //    foreach (var user in users)
        //    {
                
        //        if (!user.Password.StartsWith("$2"))
        //        {
        //            user.Password = PasswordHelper.HashPassword(user.Password);
        //        }
        //    }

        //    await _context.SaveChangesAsync();

        //    return Ok("Passwords migrated successfully.");
        //}



        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.UserID)
            {
                return BadRequest("User ID in URL does not match User ID in body.");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Update existing user properties from the incoming user object
            _context.Entry(existingUser).CurrentValues.SetValues(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(e => e.UserID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirst("id")?.Value;
        
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
                return Unauthorized();
        
            var user = await _context.Users
                                     .Include(u => u.Role)
                                     .FirstOrDefaultAsync(u => u.UserID == id);
        
            if (user == null)
                return NotFound();
        
            var userDto = new UserDto
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CreationDate = user.CreationDate,
                RoleID = user.RoleID,
                RoleName = user.Role?.RoleName
            };
        
            return Ok(userDto);
        }


        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateCurrentUser(UserUpdateDto updateDto)
        {
            var userIdStr = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.PhoneNumber = updateDto.PhoneNumber;
        
            if (!string.IsNullOrWhiteSpace(updateDto.Password))
            {
                user.Password = PasswordHelper.HashPassword(updateDto.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto tokenRequest)
        {
            if (tokenRequest == null || string.IsNullOrEmpty(tokenRequest.AccessToken))
                return BadRequest("Invalid client request");

            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("Refresh token is missing in cookies");

            var principal = TokenHelper.GetPrincipalFromExpiredToken(tokenRequest.AccessToken, _config);
            if (principal == null)
                return BadRequest("Invalid access token");

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return Unauthorized("Invalid refresh token");

            var newAccessToken = TokenHelper.GenerateToken(user, _config);
            var newRefreshToken = TokenHelper.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();

            // Overwrite the old cookie with a new refresh token
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions {

            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None, // ← important for cross-origin
            Expires = DateTime.UtcNow.AddDays(7)
        });


            return Ok(new
            {
                Token = newAccessToken
            });
        }

        

    }
}