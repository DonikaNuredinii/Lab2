using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    public class OrderItemsController
    {
        [Route("api/[controller]")]
        [ApiController]
        public class OrderItemController : ControllerBase
        {
            private readonly MyContext _context;

            public OrderItemController(MyContext context)
            {
                _context = context;
            }

            // GET: api/OrderItem
            [HttpGet]
            public async Task<ActionResult<IEnumerable<OrderItems>>> GetOrderItems()
            {
                return await _context.OrderItems.ToListAsync();
            }

            // GET: api/OrderItem/5
            [HttpGet("{id}")]
            public async Task<ActionResult<OrderItems>> GetOrderItem(int id)
            {
                var orderItem = await _context.OrderItems.FindAsync(id);
                if (orderItem == null)
                {
                    return NotFound();
                }

                return orderItem;
            }

            // POST: api/OrderItem
            [HttpPost]
            public async Task<ActionResult<OrderItems>> PostOrderItems(OrderItems orderItem)
            {
                _context.OrderItems.Add(orderItem);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetOrderItem", new { id = orderItem.OrderItemsID }, orderItem);
            }

            // PUT: api/OrderItem/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutOrderItems(int id, OrderItems orderItem)
            {
                if (id != orderItem.OrderItemsID)
                {
                    return BadRequest();
                }

                _context.Entry(orderItem).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrderItemExists(id))
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

            // DELETE: api/OrderItem/5
            [HttpDelete("{id}")]
            public async Task<ActionResult<OrderItems>> DeleteOrderItem(int id)
            {
                var orderItem = await _context.OrderItems.FindAsync(id);
                if (orderItem == null)
                {
                    return NotFound();
                }

                _context.OrderItems.Remove(orderItem);
                await _context.SaveChangesAsync();

                return orderItem;
            }

            private bool OrderItemExists(int id)
            {
                return _context.OrderItems.Any(e => e.OrderItemsID == id);
            }
        }
    }
}
