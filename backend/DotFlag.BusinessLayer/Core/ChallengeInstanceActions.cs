using DotFlag.BusinessLayer.Services;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Docker;
using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeInstanceActions
    {
        protected async Task<(ActionResponse, ChallengeInstanceDto?)> StartInstanceExecution(int challengeId, int userId)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges
                .FirstOrDefault(c => c.Id == challengeId && c.IsActive);

            if (challenge == null)
                return (new ActionResponse { IsSuccess = false, Message = "Challenge not found." }, null);

            if (!challenge.HasInstance || string.IsNullOrEmpty(challenge.DockerImage) || !challenge.ContainerPort.HasValue)
                return (new ActionResponse { IsSuccess = false, Message = "This challenge does not support Docker instances." }, null);

            var hasSolved = context.Submissions
                .Any(s => s.UserId == userId && s.ChallengeId == challengeId && s.IsCorrect);
            if (hasSolved)
                return (new ActionResponse { IsSuccess = false, Message = "You have already solved this challenge." }, null);

            var existing = context.ChallengeInstances
                .FirstOrDefault(i => i.UserId == userId && i.Status == "running");
            if (existing != null)
                return (new ActionResponse { IsSuccess = false, Message = "You already have an active instance. Stop it before starting a new one." }, null);

            var settings = context.DockerSettings.FirstOrDefault(s => s.Id == 1);
            var maxGlobal = settings?.MaxGlobalInstances ?? 20;
            var activeCount = context.ChallengeInstances.Count(i => i.Status == "running");
            if (activeCount >= maxGlobal)
                return (new ActionResponse { IsSuccess = false, Message = "Global instance limit reached. Try again later." }, null);

            var timeoutMinutes = challenge.ContainerTimeoutMinutes
                ?? settings?.InstanceTimeoutMinutes
                ?? 0;
            DateTime? expiresAt = timeoutMinutes > 0 ? DateTime.UtcNow.AddMinutes(timeoutMinutes) : null;

            var host = DockerService.ExtractHost(settings?.Host ?? "localhost");

            try
            {
                var docker = await DockerService.FromSettings();
                var (containerId, hostPort) = await docker.StartContainer(
                    challenge.DockerImage!, challenge.ContainerPort!.Value, userId, challengeId);

                var instance = new ChallengeInstanceData
                {
                    ChallengeId = challengeId,
                    UserId = userId,
                    ContainerId = containerId,
                    HostPort = hostPort,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = expiresAt,
                    Status = "running"
                };

                context.ChallengeInstances.Add(instance);
                context.SaveChanges();

                var dto = new ChallengeInstanceDto
                {
                    Id = instance.Id,
                    ChallengeId = challengeId,
                    Host = host,
                    Port = hostPort,
                    CreatedAt = instance.CreatedAt,
                    ExpiresAt = expiresAt,
                    Status = "running"
                };

                return (new ActionResponse { IsSuccess = true, Message = "Instance started." }, dto);
            }
            catch (Exception ex)
            {
                return (new ActionResponse { IsSuccess = false, Message = $"Failed to start instance: {ex.Message}" }, null);
            }
        }

        protected async Task<ActionResponse> StopInstanceExecution(int challengeId, int userId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances
                .FirstOrDefault(i => i.ChallengeId == challengeId && i.UserId == userId && i.Status == "running");

            if (instance == null)
                return new ActionResponse { IsSuccess = false, Message = "No active instance found." };

            try
            {
                var docker = await DockerService.FromSettings();
                await docker.StopContainer(instance.ContainerId);
            }
            catch { /* still clean up DB record */ }

            context.ChallengeInstances.Remove(instance);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Instance stopped." };
        }

        protected async Task<ActionResponse> RestartInstanceExecution(int challengeId, int userId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances
                .FirstOrDefault(i => i.ChallengeId == challengeId && i.UserId == userId && i.Status == "running");

            if (instance == null)
                return new ActionResponse { IsSuccess = false, Message = "No active instance found." };

            try
            {
                var docker = await DockerService.FromSettings();
                await docker.RestartContainer(instance.ContainerId);
                return new ActionResponse { IsSuccess = true, Message = "Instance restarted." };
            }
            catch (Exception ex)
            {
                return new ActionResponse { IsSuccess = false, Message = $"Failed to restart instance: {ex.Message}" };
            }
        }

        protected ChallengeInstanceDto? GetInstanceExecution(int challengeId, int userId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances
                .FirstOrDefault(i => i.ChallengeId == challengeId && i.UserId == userId && i.Status == "running");

            if (instance == null)
                return null;

            var settings = context.DockerSettings.FirstOrDefault(s => s.Id == 1);
            var host = DockerService.ExtractHost(settings?.Host ?? "localhost");

            return new ChallengeInstanceDto
            {
                Id = instance.Id,
                ChallengeId = challengeId,
                Host = host,
                Port = instance.HostPort,
                CreatedAt = instance.CreatedAt,
                ExpiresAt = instance.ExpiresAt,
                Status = instance.Status
            };
        }

        protected ChallengeInstanceDto? GetMyInstanceExecution(int userId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances
                .FirstOrDefault(i => i.UserId == userId && i.Status == "running");

            if (instance == null)
                return null;

            var settings = context.DockerSettings.FirstOrDefault(s => s.Id == 1);
            var host = DockerService.ExtractHost(settings?.Host ?? "localhost");

            return new ChallengeInstanceDto
            {
                Id = instance.Id,
                ChallengeId = instance.ChallengeId,
                Host = host,
                Port = instance.HostPort,
                CreatedAt = instance.CreatedAt,
                ExpiresAt = instance.ExpiresAt,
                Status = instance.Status
            };
        }
    }
}
