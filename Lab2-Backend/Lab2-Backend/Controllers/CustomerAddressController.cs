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
            return await _context.CustomerAddresses.ToListAsync(); 
        }

        [HttpPost]
public async Task<ActionResult<object>> CreateCustomerAddress([FromBody] CustomerAddressCreateDto addressDto)
{
    var address = new CustomerAddress
    {
        AddressLine = addressDto.AddressLine,
        City = addressDto.City,
        PostalCode = addressDto.PostalCode
    };

    _context.CustomerAddresses.Add(address);
    await _context.SaveChangesAsync();

    // ✅ Assign the address to the customer
    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserID == addressDto.UserID);
    if (customer != null)
    {
        customer.CustomerAddressID = address.CustomerAddressID;
        await _context.SaveChangesAsync(); // update customer
    }

    // 🔁 Now fetch the updated customer info
    var customerInfo = await _context.Customers
        .Where(c => c.CustomerAddressID == address.CustomerAddressID)
        .Select(c => new
        {
            c.UserID,
            c.FirstName,
            c.LastName,
            c.Email,
            c.PhoneNumber,
            c.CreationDate
        })
        .FirstOrDefaultAsync();

    var result = new
    {
        address.CustomerAddressID,
        address.AddressLine,
        address.City,
        address.PostalCode,
        customer = customerInfo
    };

    return CreatedAtAction(nameof(GetCustomerAddresses), new { id = address.CustomerAddressID }, result);
}


    }
}
