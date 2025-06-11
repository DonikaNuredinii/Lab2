using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixRemovedProductsFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItemProducts_Products_ProductsID1",
                table: "MenuItemProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_RemovedProducts_Products_ProductsID1",
                table: "OrderItems_RemovedProducts");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_RemovedProducts_ProductsID1",
                table: "OrderItems_RemovedProducts");

            migrationBuilder.DropIndex(
                name: "IX_MenuItemProducts_ProductsID1",
                table: "MenuItemProducts");

            migrationBuilder.DropColumn(
                name: "ProductsID1",
                table: "OrderItems_RemovedProducts");

            migrationBuilder.DropColumn(
                name: "ProductsID1",
                table: "MenuItemProducts");

            migrationBuilder.AlterColumn<string>(
                name: "AddressLine",
                table: "CustomerAddresses",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductsID1",
                table: "OrderItems_RemovedProducts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductsID1",
                table: "MenuItemProducts",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AddressLine",
                table: "CustomerAddresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_RemovedProducts_ProductsID1",
                table: "OrderItems_RemovedProducts",
                column: "ProductsID1");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemProducts_ProductsID1",
                table: "MenuItemProducts",
                column: "ProductsID1");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItemProducts_Products_ProductsID1",
                table: "MenuItemProducts",
                column: "ProductsID1",
                principalTable: "Products",
                principalColumn: "ProductsID");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_RemovedProducts_Products_ProductsID1",
                table: "OrderItems_RemovedProducts",
                column: "ProductsID1",
                principalTable: "Products",
                principalColumn: "ProductsID");
        }
    }
}
