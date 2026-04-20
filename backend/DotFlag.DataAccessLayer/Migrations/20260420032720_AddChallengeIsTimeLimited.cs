using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddChallengeIsTimeLimited : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTimeLimited",
                table: "Challenges",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 20, 3, 27, 19, 829, DateTimeKind.Utc).AddTicks(5354), new DateTime(2026, 4, 20, 3, 27, 19, 829, DateTimeKind.Utc).AddTicks(5353) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTimeLimited",
                table: "Challenges");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2295), new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2291) });
        }
    }
}
