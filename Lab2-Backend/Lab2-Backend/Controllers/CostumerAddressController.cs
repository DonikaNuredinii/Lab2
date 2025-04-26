using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAddressController : ControllerBase
    {
        private readonly MyContext _context;

        public CustomerAddressController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerAddress>>> GetCustomerAddresses()
        {
            return await _context.CustomerAddresses.Include(ca => ca.Customer).ToListAsync();
        }

        [HttpPost]
public async Task<ActionResult<CustomerAddress>> CreateCustomerAddress([FromBody] CustomerAddressCreateDto addressDto)
{
    var address = new CustomerAddress
    {
        CustomerID = addressDto.CustomerID,
        AddressLine = addressDto.AddressLine,
        City = addressDto.City,
        PostalCode = addressDto.PostalCode
    };

    _context.CustomerAddresses.Add(address);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetCustomerAddresses), new { id = address.CustomerAddressID }, address);
}

    }
}
