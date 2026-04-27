using DotFlag.Domain.Entities.Audit;
using DotFlag.Domain.Entities.Badge;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.CtfEvent;
using DotFlag.Domain.Entities.Docker;
using DotFlag.Domain.Entities.Notification;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Entities.Team;
using DotFlag.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.DataAccessLayer.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserData> Users { get; set; }
        public DbSet<TeamData> Teams { get; set; }
        public DbSet<ChallengeData> Challenges { get; set; }
        public DbSet<SubmissionData> Submissions { get; set; }
        public DbSet<NotificationData> Notifications { get; set; }
        public DbSet<HintData> Hints { get; set; }
        public DbSet<ChallengeFileData> ChallengeFiles { get; set; }
        public DbSet<AuditLogData> AuditLogs { get; set; }
        public DbSet<CtfEventData> CtfEvents { get; set; }
        public DbSet<ChallengeInstanceData> ChallengeInstances { get; set; }
        public DbSet<DockerSettingsData> DockerSettings { get; set; }
        public DbSet<UserBadgeData> UserBadges { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Team are unique InviteCode
            modelBuilder.Entity<TeamData>()
                .HasIndex(t => t.InviteCode)
                .IsUnique();

            // Team -> Users
            modelBuilder.Entity<UserData>()
                .HasOne(u => u.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(u => u.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            // User ->Submissions
            modelBuilder.Entity<SubmissionData>()
                .HasOne(s => s.User)
                .WithMany(u => u.Submissions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Challenge ->  Submissions
            modelBuilder.Entity<SubmissionData>()
                .HasOne(s => s.Challenge)
                .WithMany(c => c.Submissions)
                .HasForeignKey(s => s.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Challenge -> Hints
            modelBuilder.Entity<HintData>()
                .HasOne(h => h.Challenge)
                .WithMany(c => c.Hints)
                .HasForeignKey(h => h.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Notifications
            modelBuilder.Entity<NotificationData>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Challenge -> Files
            modelBuilder.Entity<ChallengeFileData>()
                .HasOne(f => f.Challenge)
                .WithMany(c => c.Files)
                .HasForeignKey(f => f.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AuditLogData>()
                .HasOne(a => a.Actor)
                .WithMany()
                .HasForeignKey(a => a.ActorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<AuditLogData>()
                .HasIndex(a => a.CreatedOn);

            modelBuilder.Entity<AuditLogData>()
                .HasIndex(a => a.Action);

            modelBuilder.Entity<CtfEventData>()
                .HasData(new CtfEventData
                {
                    Id = 1,
                    Name = "DotFlag CTF",
                    StartTime = DateTime.UtcNow,
                    EndTime = DateTime.UtcNow,
                });

            // ChallengeInstance -> User
            modelBuilder.Entity<ChallengeInstanceData>()
                .HasOne(i => i.User)
                .WithMany()
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ChallengeInstance -> Challenge
            modelBuilder.Entity<ChallengeInstanceData>()
                .HasOne(i => i.Challenge)
                .WithMany()
                .HasForeignKey(i => i.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // One active instance per user (unique index on UserId where Status = running is enforced in business logic)

            modelBuilder.Entity<UserBadgeData>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserBadgeData>()
                .HasOne(b => b.CtfEvent)
                .WithMany()
                .HasForeignKey(b => b.CtfEventId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<UserBadgeData>()
                .HasIndex(b => b.UserId);

            // Docker settings seed
            modelBuilder.Entity<DockerSettingsData>()
                .HasData(new DockerSettingsData
                {
                    Id = 1,
                    Host = "tcp://localhost:2375",
                    MaxGlobalInstances = 20,
                    InstanceTimeoutMinutes = 60,
                });
        }

    }
}
