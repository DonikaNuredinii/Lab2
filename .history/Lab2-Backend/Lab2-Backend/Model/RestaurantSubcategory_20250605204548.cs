[HttpPost("assign-to-restaurants")]
public async Task<IActionResult> AssignToRestaurants([FromBody] AssignSubcategoryToRestaurantsDTO dto)
{
    var entries = dto.RestaurantIds.Select(rid => new RestaurantSubcategory
    {
        RestaurantId = rid,
        SubcategoryId = dto.SubcategoryId
    });

    await _context.RestaurantSubcategories.AddRangeAsync(entries);
    await _context.SaveChangesAsync();
    return Ok();
}
