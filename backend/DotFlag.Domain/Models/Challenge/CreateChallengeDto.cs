using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Challenge
{
    public class CreateChallengeDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ChallengeCategory Category { get; set; }
        public int MinPoints { get; set; }
        public int MaxPoints { get; set; }
        public int DecayRate { get; set; }
        public int FirstBloodBonus { get; set; }
        public string Flag { get; set; } 
    }

}
