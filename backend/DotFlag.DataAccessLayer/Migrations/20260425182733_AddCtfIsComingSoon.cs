using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddCtfIsComingSoon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsComingSoon",
                table: "CtfEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "IsComingSoon", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 18, 27, 33, 669, DateTimeKind.Utc).AddTicks(3235), false, new DateTime(2026, 4, 25, 18, 27, 33, 669, DateTimeKind.Utc).AddTicks(3232) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsComingSoon",
                table: "CtfEvents");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 16, 27, 18, 106, DateTimeKind.Utc).AddTicks(8844), new DateTime(2026, 4, 25, 16, 27, 18, 106, DateTimeKind.Utc).AddTicks(8839) });
        }
    }
}
