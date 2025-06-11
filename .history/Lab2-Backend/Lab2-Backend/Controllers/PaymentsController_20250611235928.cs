using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly MyContext _context;

        public PaymentsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payments>>> GetPayments()
        {
            return await _context.Payments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payments>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            return payment;
        }

        [HttpPost]
        public async Task<ActionResult<Payments>> PostPayment(PaymentCreateDto paymentDto)
        {
            var payment = new Payments
            {
                OrderID = paymentDto.OrderID,
                PaymentMethod = paymentDto.PaymentMethod,
                Status = paymentDto.Status,
                Amount = paymentDto.Amount,
                TransactionID = paymentDto.TransactionID,
                CreatedAt = paymentDto.CreatedAt
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.PaymentsID }, payment);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payments payment)
        {
            if (id != payment.PaymentsID)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        [HttpDelete("{id}")]
        public async Task<ActionResult<Payments>> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.PaymentsID == id);
        }
        
    }
    
}
