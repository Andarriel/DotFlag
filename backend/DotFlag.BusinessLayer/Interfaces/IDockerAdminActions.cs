using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IDockerAdminActions
    {
        List<DockerContainerDto> GetAllInstances();
        Task<ActionResponse> KillInstance(int instanceId);
        Task<ActionResponse> RestartInstance(int instanceId);
        Task<(ActionResponse, string)> GetLogs(int instanceId);
        DockerSettingsDto GetSettings();
        ActionResponse UpdateSettings(UpdateDockerSettingsDto dto);
    }
}
