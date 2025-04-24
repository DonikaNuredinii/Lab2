using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    public class OrdersController
    {
        [Route("api/[controller]")]
        [ApiController]
        public class OrderController : ControllerBase
        {
            private readonly MyContext _context;

            public OrderController(MyContext context)
            {
                _context = context;
            }

            // GET: api/Order
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Orders>>> GetOrders()
            {
                return await _context.Orders.ToListAsync();
            }

            // GET: api/Order/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Orders>> GetOrder(int id)
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound();
                }
                return order;
            }

            // POST: api/Order
            [HttpPost]
            public async Task<ActionResult<Orders>> PostOrder(Orders order)
            {
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetOrder", new { id = order.OrdersID }, order);
            }

            // PUT: api/Order/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutOrders(int id, Orders order)
            {
                if (id != order.OrdersID)
                {
                    return BadRequest();
                }

                _context.Entry(order).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrderExists(id))
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

            // DELETE: api/Order/5
            [HttpDelete("{id}")]
            public async Task<ActionResult<Orders>> DeleteOrders(int id)
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound();
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return order;
            }

            private bool OrderExists(int id)
            {
                return _context.Orders.Any(e => e.OrdersID == id);
            }
        }
    }
}
