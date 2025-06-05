// Importo DTO-n tënd në krye:
using Lab2_Backend.DTO;

// Pastaj POST method:
[HttpPost("assign-to-restaurants")]
public async Task<IActionResult> AssignToRestaurants([FromBody] RestaurantSubcategoryDTO dto)
{
    if (dto == null || dto.RestaurantIds == null || !dto.RestaurantIds.Any())
        return BadRequest("Invalid data.");

    var entries = dto.RestaurantIds.Select(rid => new RestaurantSubcategory
    {
        RestaurantId = rid,
        SubcategoryId = dto.SubcategoryId
    });

    await _context.RestaurantSubcategories.AddRangeAsync(entries);
    await _context.SaveChangesAsync();
    return Ok(new { message = "Subcategory assigned to restaurants successfully." });
}
