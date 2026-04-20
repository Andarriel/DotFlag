using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.Challenge
{
    public class UpdateChallengeDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        public ChallengeCategory Category { get; set; }

        public ChallengeDifficulty Difficulty { get; set; }

        public int MinPoints { get; set; }

        public int MaxPoints { get; set; }

        public int DecayRate { get; set; }

        public int FirstBloodBonus { get; set; }

        public string Flag { get; set; }

        public bool IsActive { get; set; }

        public bool IsTimeLimited { get; set; }
    }
}
