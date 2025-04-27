using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ProductFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductNotes_MenuItems_MenuItemsID",
                table: "ProductNotes");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductNotes_MenuItems_MenuItemsID",
                table: "ProductNotes",
                column: "MenuItemsID",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductNotes_MenuItems_MenuItemsID",
                table: "ProductNotes");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductNotes_MenuItems_MenuItemsID",
                table: "ProductNotes",
                column: "MenuItemsID",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
