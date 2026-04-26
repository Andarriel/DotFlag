namespace DotFlag.Api.Services
{
    public class SystemHealthSnapshot
    {
        public bool DbOnline { get; init; }
        public int? DbLatencyMs { get; init; }
        public bool DockerOnline { get; init; }
        public int? DockerLatencyMs { get; init; }
        public DateTime CheckedAt { get; init; }
    }

    public static class SystemStatusService
    {
        private static volatile SystemHealthSnapshot? _latest;
        public static SystemHealthSnapshot? Latest => _latest;
        public static void Update(SystemHealthSnapshot snapshot) => _latest = snapshot;
    }
}
