using Lab2_Backend.DTOs;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffScheduleController : ControllerBase
    {
        private readonly MyContext _context;

        public StaffScheduleController(MyContext context)
        {
            _context = context;
        }

        // GET: api/StaffSchedule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffScheduleResponseDTO>>> GetSchedules()
        {
            return await _context.StaffSchedules
                .Include(s => s.StaffUser)
                .Include(s => s.StaffScheduleTables)
                    .ThenInclude(sst => sst.Table)
                .Include(s => s.AssignedByUser)
                .Select(s => new StaffScheduleResponseDTO
                {
                    ScheduleID = s.ScheduleID,
                    StaffID = s.StaffID,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime.ToString(@"hh\:mm"),
                    EndTime = s.EndTime.ToString(@"hh\:mm"),
                    AssignedBy = s.AssignedBy,
                    StaffFirstName = s.StaffUser.FirstName,
                    StaffLastName = s.StaffUser.LastName,
                    AssignedByFirstName = s.AssignedByUser != null ? s.AssignedByUser.FirstName : null,
                    Tables = s.StaffScheduleTables.Select(t => new TableDTO
                    {
                        TableID = t.TableID,
                    }).ToList()
                })
                .ToListAsync();
        }


        // GET: api/StaffSchedule/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffSchedule>> GetSchedule(int id)
        {
            var schedule = await _context.StaffSchedules.FindAsync(id);
            if (schedule == null)
                return NotFound();

            return schedule;
        }

        // POST: api/StaffSchedule
        [HttpPost]
// POST: api/StaffSchedule
[HttpPost]
public async Task<ActionResult<StaffSchedule>> CreateSchedule(StaffScheduleDTO dto)
{
    // Convert string to TimeSpan
    if (!TimeSpan.TryParse(dto.StartTime.ToString(), out var startTime))
    {
        return BadRequest("Invalid startTime format.");
    }

    if (!TimeSpan.TryParse(dto.EndTime.ToString(), out var endTime))
    {
        return BadRequest("Invalid endTime format.");
    }

    // Check if AssignedBy user exists
    if (dto.AssignedBy != null)
    {
        var assignedByUser = await _context.Users.FindAsync(dto.AssignedBy);
        if (assignedByUser == null)
        {
            return BadRequest("AssignedBy user does not exist.");
        }
    }

            var schedule = new StaffSchedule
            {
                StaffID = dto.StaffID,
                DayOfWeek = dto.DayOfWeek,
                StartTime = startTime,
                EndTime = endTime,
                AssignedBy = dto.AssignedBy,
                StaffScheduleTables = dto.TableIDs?.Select(tid => new StaffScheduleTable
                {
                    TableID = tid
                }).ToList()
            };


            _context.StaffSchedules.Add(schedule);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetSchedule), new { id = schedule.ScheduleID }, schedule);
}


        // PUT: api/StaffSchedule/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, StaffScheduleDTO dto)
        {
            var schedule = await _context.StaffSchedules.FindAsync(id);
            if (schedule == null)
                return NotFound();

            schedule.StaffID = dto.StaffID;
            schedule.DayOfWeek = dto.DayOfWeek;
            schedule.StartTime = dto.StartTime;
            schedule.EndTime = dto.EndTime;
            schedule.AssignedBy = dto.AssignedBy;

            _context.StaffScheduleTables.RemoveRange(schedule.StaffScheduleTables);
            schedule.StaffScheduleTables = dto.TableIDs?.Select(tid => new StaffScheduleTable
            {
                StaffScheduleID = schedule.ScheduleID,
                TableID = tid
            }).ToList();


            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/StaffSchedule/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.StaffSchedules.FindAsync(id);
            if (schedule == null)
                return NotFound();

            _context.StaffSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
