using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddSubmissionCompensationPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompensationPoints",
                table: "Submissions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 26, 2, 19, 27, 790, DateTimeKind.Utc).AddTicks(5617), new DateTime(2026, 4, 26, 2, 19, 27, 790, DateTimeKind.Utc).AddTicks(5615) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompensationPoints",
                table: "Submissions");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 22, 53, 40, 781, DateTimeKind.Utc).AddTicks(7111), new DateTime(2026, 4, 25, 22, 53, 40, 781, DateTimeKind.Utc).AddTicks(7108) });
        }
    }
}
