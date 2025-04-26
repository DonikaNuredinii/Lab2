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
    public class CustomerController : ControllerBase
    {
        private readonly MyContext _context;

        public CustomerController(MyContext context)
        {
            _context = context;
        }

        // GET all customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers
                                 .Include(c => c.CustomerAddress)
                                 .ToListAsync();
        }

        // GET customer by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers
                                         .Include(c => c.CustomerAddress)
                                         .FirstOrDefaultAsync(c => c.UserID == id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        // POST create new customer
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] CustomerCreateDto customerDto)
        {
            if (customerDto == null)
            {
                return BadRequest("Customer data is missing");
            }

            var user = await _context.Users.FindAsync(customerDto.UserID);
            if (user == null)
            {
                return BadRequest($"User with ID {customerDto.UserID} does not exist.");
            }

            var customer = new Customer
            {
                UserID = customerDto.UserID,
                CustomerAddressID = customerDto.CustomerAddressID
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.UserID }, customer);
        }

        // PUT update customer
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto customerDto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.CustomerAddressID = customerDto.CustomerAddressID;

            _context.Entry(customer).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE customer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
