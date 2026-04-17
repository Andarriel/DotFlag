using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddUserLastLoginAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2295), new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2291) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 16, 17, 59, 44, 498, DateTimeKind.Utc).AddTicks(8863), new DateTime(2026, 4, 16, 17, 59, 44, 498, DateTimeKind.Utc).AddTicks(8861) });
        }
    }
}
