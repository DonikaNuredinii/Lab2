using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2_Backend.Helpers;


namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MyContext _context;

        public UserController(MyContext context)
        {
            _context = context;
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


        // Signup
        [HttpPost("signup")]
        public async Task<ActionResult<UserDto>> SignUp(UserCreateDto userDto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
                return BadRequest("Email already exists.");
        
            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
            if (defaultRole == null)
                return BadRequest("Default role 'Customer' not found.");
        
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                Password = PasswordHelper.HashPassword(userDto.Password),
                CreationDate = DateTime.UtcNow,
                RoleID = defaultRole.RoleID  // 👈 Assign "Customer"
            };
        
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        
            return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, userDto);
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


        

    }
}