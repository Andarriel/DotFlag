using System.Collections.Concurrent;

namespace DotFlag.BusinessLayer.Core
{
    public static class SubmissionRateLimiter
    {
        private const int MaxAttempts = 5;
        private static readonly TimeSpan Window = TimeSpan.FromSeconds(30);

        private static readonly ConcurrentDictionary<(int UserId, int ChallengeId), Queue<DateTime>> _attempts = new();

        public static (bool Allowed, int RetryAfterSeconds) TryRegister(int userId, int challengeId)
        {
            var key = (userId, challengeId);
            var now = DateTime.UtcNow;

            var queue = _attempts.GetOrAdd(key, _ => new Queue<DateTime>());

            lock (queue)
            {
                while (queue.Count > 0 && now - queue.Peek() > Window)
                    queue.Dequeue();

                if (queue.Count >= MaxAttempts)
                {
                    var retry = (int)Math.Ceiling((Window - (now - queue.Peek())).TotalSeconds);
                    return (false, Math.Max(1, retry));
                }

                queue.Enqueue(now);
                return (true, 0);
            }
        }

        public static void Clear(int userId, int challengeId)
        {
            _attempts.TryRemove((userId, challengeId), out _);
        }
    }
}
