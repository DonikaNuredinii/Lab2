using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class StaffSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StaffSchedules_Tables_TableID",
                table: "StaffSchedules");

            migrationBuilder.DropIndex(
                name: "IX_StaffSchedules_TableID",
                table: "StaffSchedules");

            migrationBuilder.DropColumn(
                name: "TableID",
                table: "StaffSchedules");

            migrationBuilder.CreateTable(
                name: "StaffScheduleTables",
                columns: table => new
                {
                    StaffScheduleID = table.Column<int>(type: "int", nullable: false),
                    TableID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffScheduleTables", x => new { x.StaffScheduleID, x.TableID });
                    table.ForeignKey(
                        name: "FK_StaffScheduleTables_StaffSchedules_StaffScheduleID",
                        column: x => x.StaffScheduleID,
                        principalTable: "StaffSchedules",
                        principalColumn: "ScheduleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffScheduleTables_Tables_TableID",
                        column: x => x.TableID,
                        principalTable: "Tables",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffScheduleTables_TableID",
                table: "StaffScheduleTables",
                column: "TableID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffScheduleTables");

            migrationBuilder.AddColumn<int>(
                name: "TableID",
                table: "StaffSchedules",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_TableID",
                table: "StaffSchedules",
                column: "TableID");

            migrationBuilder.AddForeignKey(
                name: "FK_StaffSchedules_Tables_TableID",
                table: "StaffSchedules",
                column: "TableID",
                principalTable: "Tables",
                principalColumn: "ID");
        }
    }
}
