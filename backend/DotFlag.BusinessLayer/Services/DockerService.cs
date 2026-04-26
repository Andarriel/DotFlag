using Docker.DotNet;
using Docker.DotNet.Models;
using DotFlag.DataAccessLayer.Context;

namespace DotFlag.BusinessLayer.Services
{
    public class DockerService
    {
        private readonly string _host;

        public DockerService(string host)
        {
            _host = host;
        }

        private DockerClient CreateClient() =>
            new DockerClientConfiguration(new Uri(_host)).CreateClient();

        public async Task<(string containerId, int hostPort)> StartContainer(
            string image, int containerPort, int userId, int challengeId)
        {
            using var client = CreateClient();

            var containerName = $"dotflag-u{userId}-c{challengeId}";

            // Remove any existing container with this name
            try
            {
                await client.Containers.RemoveContainerAsync(
                    containerName, new ContainerRemoveParameters { Force = true });
            }
            catch { /* container may not exist */ }

            var hostPort = await FindFreePort();

            var createParams = new CreateContainerParameters
            {
                Image = image,
                Name = containerName,
                User = "nobody",
                HostConfig = new HostConfig
                {
                    PortBindings = new Dictionary<string, IList<PortBinding>>
                    {
                        {
                            $"{containerPort}/tcp",
                            new List<PortBinding> { new PortBinding { HostPort = hostPort.ToString() } }
                        }
                    },
                    AutoRemove = false,
                    NetworkMode = "ctf_net",
                    SecurityOpt = new List<string> { "no-new-privileges:true" },
                    CapDrop = new List<string> { "ALL" },
                    CapAdd = new List<string> { "CHOWN", "SETGID", "SETUID" },
                    Memory = 512L * 1024 * 1024,
                    NanoCPUs = 500_000_000L,
                    RestartPolicy = new RestartPolicy { Name = RestartPolicyKind.UnlessStopped },
                },
                ExposedPorts = new Dictionary<string, EmptyStruct>
                {
                    { $"{containerPort}/tcp", default }
                }
            };

            var response = await client.Containers.CreateContainerAsync(createParams);
            await client.Containers.StartContainerAsync(response.ID, new ContainerStartParameters());

            return (response.ID, hostPort);
        }

        public async Task StopContainer(string containerId)
        {
            using var client = CreateClient();
            try
            {
                await client.Containers.StopContainerAsync(
                    containerId, new ContainerStopParameters { WaitBeforeKillSeconds = 5 });
                await client.Containers.RemoveContainerAsync(
                    containerId, new ContainerRemoveParameters { Force = true });
            }
            catch { /* ignore if already gone */ }
        }

        public async Task RestartContainer(string containerId)
        {
            using var client = CreateClient();
            await client.Containers.RestartContainerAsync(
                containerId, new ContainerRestartParameters { WaitBeforeKillSeconds = 5 });
        }

        public async Task<List<string>> GetAvailableImages()
        {
            using var client = CreateClient();
            var images = await client.Images.ListImagesAsync(new ImagesListParameters { All = false });
            return images
                .SelectMany(i => i.RepoTags ?? new List<string>())
                .Where(t => !t.StartsWith("<none>"))
                .OrderBy(t => t)
                .ToList();
        }

        public async Task<int> Ping()
        {
            var httpHost = _host.Replace("tcp://", "http://");
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var sw = System.Diagnostics.Stopwatch.StartNew();
            var response = await http.GetAsync($"{httpHost}/_ping");
            response.EnsureSuccessStatusCode();
            sw.Stop();
            return (int)sw.ElapsedMilliseconds;
        }

        public async Task<string> GetLogs(string containerId, int tailLines = 200)
        {
            using var client = CreateClient();
            var stream = await client.Containers.GetContainerLogsAsync(containerId, false,
                new ContainerLogsParameters
                {
                    ShowStdout = true,
                    ShowStderr = true,
                    Tail = tailLines.ToString(),
                    Timestamps = false,
                });
            var (stdout, stderr) = await stream.ReadOutputToEndAsync(CancellationToken.None);
            return stdout + stderr;
        }

        private async Task<int> FindFreePort()
        {
            using var context = new AppDbContext();
            var usedPorts = context.ChallengeInstances
                .Select(i => i.HostPort)
                .ToHashSet();

            for (int port = 30000; port <= 40000; port++)
            {
                if (!usedPorts.Contains(port))
                    return port;
            }

            throw new InvalidOperationException("No free ports available in range 30000-40000.");
        }

        public static string ExtractHost(string dockerHost)
        {
            try { return new Uri(dockerHost).Host; }
            catch { return dockerHost; }
        }

        public static async Task<DockerService> FromSettings()
        {
            using var context = new AppDbContext();
            var settings = await context.DockerSettings.FindAsync(1);
            return new DockerService(settings?.Host ?? "tcp://localhost:2375");
        }
    }
}
