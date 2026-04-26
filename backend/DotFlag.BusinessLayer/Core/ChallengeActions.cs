using AutoMapper;
using DotFlag.BusinessLayer.Services;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.Notification;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions
    {
        protected readonly IMapper _mapper;

        protected ChallengeActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected ChallengeDto GetByIdExecution(int id, UserRole role, int? userId = null)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;

            var challenge = context.Challenges
                .Include(c => c.Hints)
                .Include(c => c.Files)
                .FirstOrDefault(c => c.Id == id && (includeInactive || c.IsActive));

            if (challenge == null)
                return null;

            var dto =  _mapper.Map<ChallengeDto>(challenge);

            if (userId.HasValue)
            {
                dto.IsSolved = context.Submissions
                    .Any(s => s.UserId == userId.Value && s.ChallengeId == id && s.IsCorrect);
            }

            return dto;
        }

        protected List<ChallengeDto> GetAllExecution(UserRole role, int? userId = null)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;

            var challenges = context.Challenges
                .Include(c => c.Hints)
                .Include(c => c.Files)
                .Where(c => includeInactive || c.IsActive)
                .ToList();

            var dtos = _mapper.Map<List<ChallengeDto>>(challenges);

            if (userId.HasValue)
            {
                var solvedIds = context.Submissions
                    .Where(s => s.UserId == userId.Value && s.IsCorrect)
                    .Select(s => s.ChallengeId)
                    .ToHashSet();
                foreach (var dto in dtos)
                    dto.IsSolved = solvedIds.Contains(dto.Id);
            }

            return dtos;
        }

        protected ActionResponse CreateExecution(CreateChallengeDto dto, int actorId)
        {
            using var context = new AppDbContext();

            var challenge = _mapper.Map<ChallengeData>(dto);

            challenge.FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag);
            challenge.CurrentPoints = dto.MaxPoints;

            context.Challenges.Add(challenge);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.ChallengeCreated, "Challenge", challenge.Id, $"name={challenge.Name}");

            context.Notifications.Add(new NotificationData
            {
                Title = "New Challenge Available",
                Message = $"\"{challenge.Name}\" has been added. Good luck!",
                Type = "challengeAdded",
                CreatedOn = DateTime.UtcNow,
                UserId = null
            });
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge created successfully." };
        }

        protected ActionResponse UpdateExecution(int id, UpdateChallengeDto dto, int actorId)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            bool wasActive = challenge.IsActive;
            bool flagChanged = !string.IsNullOrEmpty(dto.Flag);
            bool pointsChanged = challenge.MaxPoints != dto.MaxPoints
                || challenge.MinPoints != dto.MinPoints
                || challenge.DecayRate != dto.DecayRate;

            challenge.Name = dto.Name;
            challenge.Description = dto.Description;
            challenge.Category = dto.Category;
            challenge.MinPoints = dto.MinPoints;
            challenge.MaxPoints = dto.MaxPoints;
            challenge.Difficulty = dto.Difficulty;
            challenge.IsActive = dto.IsActive;
            challenge.DecayRate = dto.DecayRate;
            challenge.FirstBloodBonus = dto.FirstBloodBonus;
            challenge.HasInstance = dto.HasInstance;
            challenge.DockerImage = dto.HasInstance ? dto.DockerImage : null;
            challenge.ContainerPort = dto.HasInstance ? dto.ContainerPort : null;
            challenge.ContainerTimeoutMinutes = dto.HasInstance ? dto.ContainerTimeoutMinutes : null;

            if (flagChanged)
                challenge.FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag);

            challenge.CurrentPoints = challenge.CalculateCurrentPoints(
                dto.MaxPoints, dto.MinPoints, dto.DecayRate, challenge.SolveCount);

            context.SaveChanges();

            if (wasActive && !dto.IsActive)
            {
                AuditLog.Log(actorId, AuditAction.ChallengeDisabled, "Challenge", id, $"name={challenge.Name}");

                context.Notifications.Add(new NotificationData
                {
                    Title = "Challenge Deactivated",
                    Message = $"\"{challenge.Name}\" has been deactivated and is no longer available.",
                    Type = "challengeDeactivated",
                    CreatedOn = DateTime.UtcNow,
                    UserId = null
                });
                context.SaveChanges();
            }
            else if (!wasActive && dto.IsActive)
            {
                AuditLog.Log(actorId, AuditAction.ChallengeEnabled, "Challenge", id, $"name={challenge.Name}");
                context.Notifications.Add(new NotificationData
                {
                    Title = "Challenge Available",
                    Message = $"\"{challenge.Name}\" is now available. Good luck!",
                    Type = "challengeAdded",
                    CreatedOn = DateTime.UtcNow,
                    UserId = null
                });
                context.SaveChanges();
            }
            else
                AuditLog.Log(actorId, AuditAction.ChallengeUpdated, "Challenge", id, $"name={challenge.Name}");

            if (pointsChanged && dto.IsActive)
            {
                context.Notifications.Add(new NotificationData
                {
                    Title = "Challenge Points Updated",
                    Message = $"Scoring for \"{challenge.Name}\" has been adjusted.",
                    Type = "challengePointsChanged",
                    CreatedOn = DateTime.UtcNow,
                    UserId = null
                });
                context.SaveChanges();
            }

            if (flagChanged)
                AuditLog.Log(actorId, AuditAction.FlagChanged, "Challenge", id, $"name={challenge.Name}");

            return new ActionResponse { IsSuccess = true, Message = "Challenge updated successfully." };
        }

        protected ActionResponse CloneExecution(int id, int actorId)
        {
            using var context = new AppDbContext();

            var source = context.Challenges
                .Include(c => c.Hints)
                .Include(c => c.Files)
                .FirstOrDefault(c => c.Id == id);

            if (source == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            var clone = new ChallengeData
            {
                Name = $"Copy of {source.Name}",
                Description = source.Description,
                Category = source.Category,
                Difficulty = source.Difficulty,
                MinPoints = source.MinPoints,
                MaxPoints = source.MaxPoints,
                CurrentPoints = source.MaxPoints,
                DecayRate = source.DecayRate,
                FirstBloodBonus = source.FirstBloodBonus,
                FlagHash = source.FlagHash,
                IsActive = false,
                CreatedOn = DateTime.UtcNow,
                HasInstance = source.HasInstance,
                DockerImage = source.DockerImage,
                ContainerPort = source.ContainerPort,
                ContainerTimeoutMinutes = source.ContainerTimeoutMinutes,
            };

            context.Challenges.Add(clone);
            context.SaveChanges();

            foreach (var hint in source.Hints)
            {
                context.Hints.Add(new HintData
                {
                    ChallengeId = clone.Id,
                    Content = hint.Content,
                    Order = hint.Order
                });
            }
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.ChallengeCreated, "Challenge", clone.Id, $"name={clone.Name};sourceId={id}");

            return new ActionResponse { IsSuccess = true, Message = "Challenge cloned successfully." };
        }

        protected ActionResponse DeleteExecution(int id, int actorId, DeactivateChallengeDto dto)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            // Re-use full deactivation flow (stops containers, compensation, notifications)
            if (challenge.IsActive)
                RunDeactivationFlow(context, challenge, id, actorId, dto, isDelete: true);
            else
                AuditLog.Log(actorId, AuditAction.ChallengeDisabled, "Challenge", id, $"name={challenge.Name};reason=delete");

            return new ActionResponse { IsSuccess = true, Message = "Challenge deleted successfully." };
        }

        protected ActionResponse DeactivateExecution(int id, int actorId, DeactivateChallengeDto dto)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id && c.IsActive);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found or already inactive." };

            RunDeactivationFlow(context, challenge, id, actorId, dto, isDelete: false);

            return new ActionResponse { IsSuccess = true, Message = "Challenge deactivated successfully." };
        }

        private void RunDeactivationFlow(AppDbContext context, ChallengeData challenge, int id, int actorId, DeactivateChallengeDto dto, bool isDelete)
        {
            // 1. Deactivate
            challenge.IsActive = false;
            context.SaveChanges();

            // 2. Stop all running Docker containers for this challenge
            var instances = context.ChallengeInstances
                .Where(i => i.ChallengeId == id && i.Status == "running")
                .ToList();

            foreach (var inst in instances)
            {
                try
                {
                    var docker = DockerService.FromSettings().GetAwaiter().GetResult();
                    docker.StopContainer(inst.ContainerId).GetAwaiter().GetResult();
                }
                catch { /* best-effort — remove from DB regardless */ }
            }

            context.ChallengeInstances.RemoveRange(instances);
            if (instances.Any()) context.SaveChanges();

            // 3. Calculate and store per-submission compensation
            var correctSubmissions = context.Submissions
                .Where(s => s.ChallengeId == id && s.IsCorrect)
                .ToList();

            int compensationPoints = dto.CompensationType switch
            {
                CompensationType.Percentage => (int)Math.Round(challenge.CurrentPoints * dto.CompensationValue / 100.0),
                CompensationType.Fixed      => dto.CompensationValue,
                _                           => 0
            };

            foreach (var sub in correctSubmissions)
                sub.CompensationPoints = compensationPoints;

            if (correctSubmissions.Any()) context.SaveChanges();

            // 4. Notifications
            var solverIds = correctSubmissions.Select(s => s.UserId).Distinct().ToList();
            string action = isDelete ? "removed" : "deactivated";

            // Global
            context.Notifications.Add(new NotificationData
            {
                Title = isDelete ? "Challenge Removed" : "Challenge Deactivated",
                Message = $"\"{challenge.Name}\" has been {action} and is no longer available.",
                Type = "challengeDeactivated",
                CreatedOn = DateTime.UtcNow,
                UserId = null
            });

            // Per-solver
            if (solverIds.Count > 0)
            {
                string scoreMsg = dto.CompensationType switch
                {
                    CompensationType.None       => $"Points from \"{challenge.Name}\" no longer count toward your score.",
                    CompensationType.Percentage => $"Your points from \"{challenge.Name}\" were replaced with a {dto.CompensationValue}% compensation ({compensationPoints} pts).",
                    CompensationType.Fixed      => $"Your points from \"{challenge.Name}\" were replaced with a fixed compensation of {compensationPoints} pts.",
                    _                           => $"Points from \"{challenge.Name}\" no longer count toward your score."
                };

                foreach (var uid in solverIds)
                {
                    context.Notifications.Add(new NotificationData
                    {
                        Title = compensationPoints > 0 ? "Score Adjusted" : "Score Impact",
                        Message = scoreMsg,
                        Type = "challengeDeactivated",
                        CreatedOn = DateTime.UtcNow,
                        UserId = uid
                    });
                }
            }

            context.SaveChanges();

            AuditLog.Log(actorId,
                isDelete ? AuditAction.ChallengeDisabled : AuditAction.ChallengeDisabled,
                "Challenge", id,
                $"name={challenge.Name};action={action};compensation={dto.CompensationType};value={dto.CompensationValue};solvers={solverIds.Count};containers={instances.Count}");
        }

        protected ActionResponse AddHintExecution(int challengeId, CreateHintDto dto, int actorId)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            var hint = _mapper.Map<HintData>(dto);

            hint.ChallengeId = challengeId;

            context.Hints.Add(hint);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.HintAdded, "Hint", hint.Id, $"challengeId={challengeId}");

            return new ActionResponse { IsSuccess = true, Message = "Hint added to challenge successfully." };
        }

        protected ActionResponse RemoveHintExecution(int challengeId, int hintId, int actorId)
        {
            using var context = new AppDbContext();

            var hint = context.Hints.FirstOrDefault(h => h.Id == hintId && h.ChallengeId == challengeId);

            if (hint == null)
                return new ActionResponse() { IsSuccess = false, Message = "Hint does not exist." };

            context.Hints.Remove(hint);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.HintRemoved, "Hint", hintId, $"challengeId={challengeId}");

            return new ActionResponse() { IsSuccess = true, Message = "Hint was removed from challenge successfully." };
        }

        protected async Task<ActionResponse> AddFileExecution(int challengeId, string fileName, Stream fileStream, int actorId)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "challenges", challengeId.ToString());
            Directory.CreateDirectory(uploadDir);

            var uniqueName = Guid.NewGuid() + Path.GetExtension(fileName);
            var storedPath = Path.Combine(uploadDir, uniqueName);

            using (var stream = new FileStream(storedPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream);
            }

            var challengeFile = new ChallengeFileData
            {
                ChallengeId = challengeId,
                FileName = fileName,
                StoredPath = storedPath
            };

            context.ChallengeFiles.Add(challengeFile);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.FileUploaded, "ChallengeFile", challengeFile.Id, $"challengeId={challengeId};name={fileName}");

            return new ActionResponse { IsSuccess = true, Message = "File added to challenge successfully." };
        }

        protected ChallengeFileData GetFileExecution(int challengeId, int fileId)
        {
            using var context = new AppDbContext();
            return context.ChallengeFiles.FirstOrDefault(f => f.Id == fileId && f.ChallengeId == challengeId);
        }

        protected ActionResponse RemoveFileExecution(int challengeId, int fileId, int actorId)
        {
            using var context = new AppDbContext();
            var file = context.ChallengeFiles.FirstOrDefault(f => f.Id == fileId && f.ChallengeId == challengeId);
            if (file == null)
                return new ActionResponse { IsSuccess = false, Message = "File not found." };

            if (File.Exists(file.StoredPath))
                File.Delete(file.StoredPath);

            context.ChallengeFiles.Remove(file);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.FileRemoved, "ChallengeFile", fileId, $"challengeId={challengeId};name={file.FileName}");

            return new ActionResponse { IsSuccess = true, Message = "File removed successfully." };
        }
    }
}
