using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class foreignkeyproducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Restaurants_RestaurantID",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Restaurants_RestaurantID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Tables_TableID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantHours_Restaurants_RestaurantID",
                table: "RestaurantHours");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Restaurants_RestaurantID",
                table: "Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Tables_Restaurants_RestaurantID",
                table: "Tables");

            migrationBuilder.AddColumn<int>(
                name: "RestaurantId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_RestaurantId",
                table: "Products",
                column: "RestaurantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Restaurants_RestaurantID",
                table: "Categories",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Restaurants_RestaurantID",
                table: "Orders",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Tables_TableID",
                table: "Orders",
                column: "TableID",
                principalTable: "Tables",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Restaurants_RestaurantId",
                table: "Products",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantHours_Restaurants_RestaurantID",
                table: "RestaurantHours",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Restaurants_RestaurantID",
                table: "Staff",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tables_Restaurants_RestaurantID",
                table: "Tables",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Restaurants_RestaurantID",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Restaurants_RestaurantID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Tables_TableID",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Restaurants_RestaurantId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantHours_Restaurants_RestaurantID",
                table: "RestaurantHours");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Restaurants_RestaurantID",
                table: "Staff");

            migrationBuilder.DropForeignKey(
                name: "FK_Tables_Restaurants_RestaurantID",
                table: "Tables");

            migrationBuilder.DropIndex(
                name: "IX_Products_RestaurantId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "RestaurantId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Restaurants_RestaurantID",
                table: "Categories",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Restaurants_RestaurantID",
                table: "Orders",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Tables_TableID",
                table: "Orders",
                column: "TableID",
                principalTable: "Tables",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantHours_Restaurants_RestaurantID",
                table: "RestaurantHours",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Restaurants_RestaurantID",
                table: "Staff",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tables_Restaurants_RestaurantID",
                table: "Tables",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
