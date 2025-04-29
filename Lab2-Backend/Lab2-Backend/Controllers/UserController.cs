using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model; 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        Password = userDto.Password,
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



        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.UserID)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

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