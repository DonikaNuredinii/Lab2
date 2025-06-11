using Lab2_Backend.DTO;
using Lab2_Backend.Helpers;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly MyContext _context;

        public StaffController(MyContext context)
        {
            _context = context;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaff()
        {
            var staffList = await _context.Staff
                .Include(s => s.Role)
                .Select(s => new StaffDto
                {
                    UserID = s.UserID,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email,
                    PhoneNumber = s.PhoneNumber,
                    CreationDate = s.CreationDate,
                    RoleID = s.RoleID,
                    RestaurantID = s.RestaurantID ?? 0,
                    Password = s.Password,
                })
                .ToListAsync();

            return Ok(staffList);
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetStaff(int id)
        {
            var staff = await _context.Staff
                .Include(s => s.Role)
                .FirstOrDefaultAsync(s => s.UserID == id);

            if (staff == null)
                return NotFound();

            return new StaffDto
            {
                UserID = staff.UserID,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                Email = staff.Email,
                PhoneNumber = staff.PhoneNumber,
                CreationDate = staff.CreationDate,
                RoleID = staff.RoleID,
                RestaurantID = staff.RestaurantID ?? 0,
                Password = staff.Password,
            };
        }

        [HttpPost]
        public async Task<ActionResult<StaffDto>> PostStaff(StaffDto dto)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == dto.RoleID);
            if (role == null)
                return BadRequest("Invalid role ID.");

            var staff = new Staff
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                CreationDate = DateTime.UtcNow,
                RestaurantID = dto.RestaurantID,
                RoleID = role.RoleID,
                Password = PasswordHelper.HashPassword(dto.Password) // ✅ HASH PASSWORD HERE
            };

            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            dto.UserID = staff.UserID;
            dto.CreationDate = staff.CreationDate;

            return CreatedAtAction(nameof(GetStaff), new { id = staff.UserID }, dto);
        }


        // PUT: api/Staff/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaff(int id, StaffDto dto)
        {
            if (id != dto.UserID)
                return BadRequest("ID mismatch.");

            var existing = await _context.Staff.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.Email = dto.Email;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.RestaurantID = dto.RestaurantID;
           existing.Password = dto.Password;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
                return NotFound();

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
