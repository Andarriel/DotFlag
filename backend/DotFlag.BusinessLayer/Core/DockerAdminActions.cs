using DotFlag.BusinessLayer.Services;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Docker;
using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class DockerAdminActions
    {
        protected List<DockerContainerDto> GetAllInstancesExecution()
        {
            using var context = new AppDbContext();

            return context.ChallengeInstances
                .Include(i => i.Challenge)
                .Include(i => i.User)
                .ToList()
                .Select(i => new DockerContainerDto
                {
                    InstanceId = i.Id,
                    ContainerId = i.ContainerId,
                    ChallengeId = i.ChallengeId,
                    ChallengeName = i.Challenge?.Name ?? "Unknown",
                    UserId = i.UserId,
                    Username = i.User?.Username ?? "Unknown",
                    HostPort = i.HostPort,
                    Status = i.Status,
                    CreatedAt = i.CreatedAt,
                    ExpiresAt = i.ExpiresAt
                })
                .ToList();
        }

        protected async Task<ActionResponse> KillInstanceExecution(int instanceId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances.FirstOrDefault(i => i.Id == instanceId);
            if (instance == null)
                return new ActionResponse { IsSuccess = false, Message = "Instance not found." };

            try
            {
                var docker = await DockerService.FromSettings();
                await docker.StopContainer(instance.ContainerId);
            }
            catch { /* still remove from DB */ }

            context.ChallengeInstances.Remove(instance);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Instance removed." };
        }

        protected async Task<ActionResponse> RestartInstanceExecution(int instanceId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances.FirstOrDefault(i => i.Id == instanceId);
            if (instance == null)
                return new ActionResponse { IsSuccess = false, Message = "Instance not found." };

            try
            {
                var docker = await DockerService.FromSettings();
                await docker.RestartContainer(instance.ContainerId);
                return new ActionResponse { IsSuccess = true, Message = "Instance restarted." };
            }
            catch (Exception ex)
            {
                return new ActionResponse { IsSuccess = false, Message = $"Failed to restart: {ex.Message}" };
            }
        }

        protected async Task<(ActionResponse, string)> GetLogsExecution(int instanceId)
        {
            using var context = new AppDbContext();

            var instance = context.ChallengeInstances.FirstOrDefault(i => i.Id == instanceId);
            if (instance == null)
                return (new ActionResponse { IsSuccess = false, Message = "Instance not found." }, string.Empty);

            try
            {
                var docker = await DockerService.FromSettings();
                var logs = await docker.GetLogs(instance.ContainerId);
                return (new ActionResponse { IsSuccess = true, Message = "OK" }, logs);
            }
            catch (Exception ex)
            {
                return (new ActionResponse { IsSuccess = false, Message = $"Failed to get logs: {ex.Message}" }, string.Empty);
            }
        }

        protected DockerSettingsDto GetSettingsExecution()
        {
            using var context = new AppDbContext();
            var settings = context.DockerSettings.FirstOrDefault(s => s.Id == 1) ?? new DockerSettingsData();
            return new DockerSettingsDto
            {
                Id = settings.Id,
                Host = settings.Host,
                MaxGlobalInstances = settings.MaxGlobalInstances,
                InstanceTimeoutMinutes = settings.InstanceTimeoutMinutes
            };
        }

        protected ActionResponse UpdateSettingsExecution(UpdateDockerSettingsDto dto)
        {
            using var context = new AppDbContext();

            var settings = context.DockerSettings.FirstOrDefault(s => s.Id == 1);
            if (settings == null)
            {
                settings = new DockerSettingsData { Id = 1 };
                context.DockerSettings.Add(settings);
            }

            settings.Host = dto.Host;
            settings.MaxGlobalInstances = dto.MaxGlobalInstances;
            settings.InstanceTimeoutMinutes = dto.InstanceTimeoutMinutes;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Settings updated." };
        }

        protected async Task<List<string>> GetAvailableImagesExecution()
        {
            try
            {
                var docker = await DockerService.FromSettings();
                return await docker.GetAvailableImages();
            }
            catch
            {
                return new List<string>();
            }
        }

        protected async Task<(bool reachable, int? latencyMs)> PingDockerExecution()
        {
            try
            {
                var docker = await DockerService.FromSettings();
                var ms = await docker.Ping();
                return (true, ms);
            }
            catch
            {
                return (false, null);
            }
        }
    }
}
