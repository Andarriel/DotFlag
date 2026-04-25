using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Docker;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure
{
    public class DockerAdminExecution : DockerAdminActions, IDockerAdminActions
    {
        public List<DockerContainerDto> GetAllInstances() => GetAllInstancesExecution();

        public Task<ActionResponse> KillInstance(int instanceId) => KillInstanceExecution(instanceId);

        public Task<ActionResponse> RestartInstance(int instanceId) => RestartInstanceExecution(instanceId);

        public Task<(ActionResponse, string)> GetLogs(int instanceId) => GetLogsExecution(instanceId);

        public DockerSettingsDto GetSettings() => GetSettingsExecution();

        public ActionResponse UpdateSettings(UpdateDockerSettingsDto dto) => UpdateSettingsExecution(dto);
    }
}
