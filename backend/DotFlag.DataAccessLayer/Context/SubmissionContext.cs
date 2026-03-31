using DotFlag.Domain.Entities.Submission;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.DataAccessLayer.Context
{
    public class SubmissionContext : DbContext
    {
        public DbSet<SubmissionData> Submissions { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
