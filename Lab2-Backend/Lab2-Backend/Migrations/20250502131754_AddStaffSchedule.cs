using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StaffSchedules",
                columns: table => new
                {
                    ScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffID = table.Column<int>(type: "int", nullable: false),
                    TableID = table.Column<int>(type: "int", nullable: true),
                    DayOfWeek = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    AssignedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffSchedules", x => x.ScheduleID);
                    table.ForeignKey(
                        name: "FK_StaffSchedules_Tables_TableID",
                        column: x => x.TableID,
                        principalTable: "Tables",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_StaffSchedules_Users_AssignedBy",
                        column: x => x.AssignedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StaffSchedules_Users_StaffID",
                        column: x => x.StaffID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_AssignedBy",
                table: "StaffSchedules",
                column: "AssignedBy");

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_StaffID",
                table: "StaffSchedules",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_StaffSchedules_TableID",
                table: "StaffSchedules",
                column: "TableID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffSchedules");
        }
    }
}
