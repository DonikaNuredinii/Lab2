using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ProductsAndRelatedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductNotes",
                columns: table => new
                {
                    ProductNotesID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuItemsID = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductNotes", x => x.ProductNotesID);
                    table.ForeignKey(
                        name: "FK_ProductNotes_MenuItems_MenuItemsID",
                        column: x => x.MenuItemsID,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductsID);
                });

            migrationBuilder.CreateTable(
                name: "MenuItemProducts",
                columns: table => new
                {
                    MIProducts = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuItemID = table.Column<int>(type: "int", nullable: false),
                    ProductsID = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    ProductsID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemProducts", x => x.MIProducts);
                    table.ForeignKey(
                        name: "FK_MenuItemProducts_MenuItems_MenuItemID",
                        column: x => x.MenuItemID,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItemProducts_Products_ProductsID",
                        column: x => x.ProductsID,
                        principalTable: "Products",
                        principalColumn: "ProductsID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItemProducts_Products_ProductsID1",
                        column: x => x.ProductsID1,
                        principalTable: "Products",
                        principalColumn: "ProductsID");
                });

            migrationBuilder.CreateTable(
                name: "OrderItems_RemovedProducts",
                columns: table => new
                {
                    OIRPID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderItemsID = table.Column<int>(type: "int", nullable: false),
                    ProductsID = table.Column<int>(type: "int", nullable: false),
                    ProductsID1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems_RemovedProducts", x => x.OIRPID);
                    table.ForeignKey(
                        name: "FK_OrderItems_RemovedProducts_OrderItems_OrderItemsID",
                        column: x => x.OrderItemsID,
                        principalTable: "OrderItems",
                        principalColumn: "OrderItemsID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_RemovedProducts_Products_ProductsID",
                        column: x => x.ProductsID,
                        principalTable: "Products",
                        principalColumn: "ProductsID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_RemovedProducts_Products_ProductsID1",
                        column: x => x.ProductsID1,
                        principalTable: "Products",
                        principalColumn: "ProductsID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemProducts_MenuItemID",
                table: "MenuItemProducts",
                column: "MenuItemID");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemProducts_ProductsID",
                table: "MenuItemProducts",
                column: "ProductsID");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemProducts_ProductsID1",
                table: "MenuItemProducts",
                column: "ProductsID1");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_RemovedProducts_OrderItemsID",
                table: "OrderItems_RemovedProducts",
                column: "OrderItemsID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_RemovedProducts_ProductsID",
                table: "OrderItems_RemovedProducts",
                column: "ProductsID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_RemovedProducts_ProductsID1",
                table: "OrderItems_RemovedProducts",
                column: "ProductsID1");

            migrationBuilder.CreateIndex(
                name: "IX_ProductNotes_MenuItemsID",
                table: "ProductNotes",
                column: "MenuItemsID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuItemProducts");

            migrationBuilder.DropTable(
                name: "OrderItems_RemovedProducts");

            migrationBuilder.DropTable(
                name: "ProductNotes");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
