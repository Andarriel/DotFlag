using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Challenge
{
    public class ChallengeDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public ChallengeCategory Category { get; set; }

        public ChallengeDifficulty Difficulty { get; set; }

        public int MinPoints { get; set; }

        public int MaxPoints { get; set; }

        public int CurrentPoints { get; set; }

        public int DecayRate { get; set; }

        public int FirstBloodBonus { get; set; }

        public bool IsActive { get; set; }
        public bool IsSolved { get; set; }

        public int SolveCount { get; set; }

        public bool HasInstance { get; set; }

        public string? DockerImage { get; set; }

        public int? ContainerPort { get; set; }

        public int? ContainerTimeoutMinutes { get; set; }

        public List<HintDto> Hints { get; set; }

        public List<ChallengeFileDto> Files { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
