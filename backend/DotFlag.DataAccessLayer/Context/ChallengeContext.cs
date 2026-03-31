using DotFlag.Domain.Entities.Challenge;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.DataAccessLayer.Context
{
    public class ChallengeContext : DbContext
    {
        public DbSet<ChallengeData> Challenges { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
