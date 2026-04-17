using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class CreateCtfEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CtfEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CtfEvents", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "CtfEvents",
                columns: new[] { "Id", "EndTime", "Name", "StartTime" },
                values: new object[] { 1, new DateTime(2026, 4, 16, 17, 59, 44, 498, DateTimeKind.Utc).AddTicks(8863), "DotFlag CTF", new DateTime(2026, 4, 16, 17, 59, 44, 498, DateTimeKind.Utc).AddTicks(8861) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CtfEvents");
        }
    }
}
