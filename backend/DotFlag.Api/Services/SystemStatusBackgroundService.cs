using DotFlag.BusinessLayer;
using DotFlag.DataAccessLayer.Context;

namespace DotFlag.Api.Services
{
    public static class SystemStatusBackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromSeconds(30);

        public static void Start()
        {
            Task.Run(async () =>
            {
                await RefreshAsync();
                while (true)
                {
                    await Task.Delay(Interval);
                    await RefreshAsync();
                }
            });
        }

        private static async Task RefreshAsync()
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

            SystemStatusService.Update(new SystemHealthSnapshot
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
