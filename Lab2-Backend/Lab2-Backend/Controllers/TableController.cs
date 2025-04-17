using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Models;  // Make sure this is added
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TableController : ControllerBase
    {
        private readonly MyContext _context;

        public TableController(MyContext context)
        {
            _context = context;
        }

        // GET: api/Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lab2_Backend.Models.Table>>> GetTables()  // Full namespace
        {
            return await _context.Tables.Include(t => t.Restaurant).ToListAsync();
        }

        // GET: api/Table/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lab2_Backend.Models.Table>> GetTable(int id)  // Full namespace
        {
            var table = await _context.Tables.Include(t => t.Restaurant).FirstOrDefaultAsync(t => t.ID == id);

            if (table == null)
            {
                return NotFound();
            }

            return table;
        }

        // POST: api/Table
        [HttpPost]
        public async Task<ActionResult<Lab2_Backend.Models.Table>> PostTable(Lab2_Backend.Models.Table table)  // Full namespace
        {
            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTable", new { id = table.ID }, table);
        }

        // PUT: api/Table/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, Lab2_Backend.Models.Table table)  // Full namespace
        {
            if (id != table.ID)
            {
                return BadRequest();
            }

            _context.Entry(table).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
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

        // DELETE: api/Table/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Lab2_Backend.Models.Table>> DeleteTable(int id)  // Full namespace
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound();
            }

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();

            return table;
        }

        private bool TableExists(int id)
        {
            return _context.Tables.Any(e => e.ID == id);
        }
    }
}
