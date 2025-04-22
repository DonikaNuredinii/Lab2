using Microsoft.AspNetCore.Mvc;
using Lab2_Backend.Model;
using System.Collections.Generic;
using System.Linq;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private static List<MenuItems> _menuItems = new List<MenuItems>();

        [HttpGet]
        public ActionResult<IEnumerable<MenuItems>> GetAll()
        {
            return Ok(_menuItems);
        }

        [HttpGet("{id}")]
        public ActionResult<MenuItems> GetById(int id)
        {
            var item = _menuItems.FirstOrDefault(m => m.Id == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<MenuItems> Create(MenuItems menuItem)
        {
            menuItem.Id = _menuItems.Count > 0 ? _menuItems.Max(m => m.Id) + 1 : 1;
            _menuItems.Add(menuItem);
            return CreatedAtAction(nameof(GetById), new { id = menuItem.Id }, menuItem);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, MenuItems updatedItem)
        {
            var item = _menuItems.FirstOrDefault(m => m.Id == id);
            if (item == null) return NotFound();

            item.Name = updatedItem.Name;
            item.Description = updatedItem.Description;
            item.Image = updatedItem.Image;
            item.Price = updatedItem.Price;
            item.IsActive = updatedItem.IsActive;
            item.RestaurantId = updatedItem.RestaurantId;
            item.SubCategoryId = updatedItem.SubCategoryId;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _menuItems.FirstOrDefault(m => m.Id == id);
            if (item == null) return NotFound();

            _menuItems.Remove(item);
            return NoContent();
        }
    }
}
