using DotFlag.Domain.Entities.Team;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.DataAccessLayer.Context
{
    public class TeamContext : DbContext
    {
        public DbSet<TeamData> Teams { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
