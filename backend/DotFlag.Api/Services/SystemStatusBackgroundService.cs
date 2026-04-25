using DotFlag.BusinessLayer;
using DotFlag.DataAccessLayer.Context;

namespace DotFlag.Api.Services
{
    public class SystemStatusBackgroundService : BackgroundService
    {
        private readonly SystemStatusService _status;
        private static readonly TimeSpan Interval = TimeSpan.FromSeconds(30);

        public SystemStatusBackgroundService(SystemStatusService status) => _status = status;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await RefreshAsync();
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(Interval, stoppingToken);
                await RefreshAsync();
            }
        }

        private async Task RefreshAsync()
        {
            bool dbOnline = false;
            int? dbLatencyMs = null;
            try
            {
                using var context = new AppDbContext();
                var sw = System.Diagnostics.Stopwatch.StartNew();
                dbOnline = await context.Database.CanConnectAsync();
                sw.Stop();
                dbLatencyMs = (int)sw.ElapsedMilliseconds;
            }
            catch { }

            var (dockerOnline, dockerLatencyMs) = await new BusinessLogic().GetDockerAdminActions().PingDocker();

            _status.Update(new SystemHealthSnapshot
            {
                DbOnline = dbOnline,
                DbLatencyMs = dbLatencyMs,
                DockerOnline = dockerOnline,
                DockerLatencyMs = dockerLatencyMs,
                CheckedAt = DateTime.UtcNow,
            });
        }
    }
}
