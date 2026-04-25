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

    public class SystemStatusService
    {
        private volatile SystemHealthSnapshot? _latest;
        public SystemHealthSnapshot? Latest => _latest;
        public void Update(SystemHealthSnapshot snapshot) => _latest = snapshot;
    }
}
