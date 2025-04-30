using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class CustomerAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerID",
                table: "CustomerAddresses");

            migrationBuilder.DropIndex(
                name: "IX_CustomerAddresses_CustomerID",
                table: "CustomerAddresses");

            migrationBuilder.DropColumn(
                name: "CustomerID",
                table: "CustomerAddresses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerID",
                table: "CustomerAddresses",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_CustomerID",
                table: "CustomerAddresses",
                column: "CustomerID");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerAddresses_Customers_CustomerID",
                table: "CustomerAddresses",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "UserID");
        }
    }
}
