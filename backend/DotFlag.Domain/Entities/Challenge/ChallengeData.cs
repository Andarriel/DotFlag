using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Challenge
{
    public class ChallengeData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public ChallengeCategory Category { get; set; }

        public int MinPoints { get; set; } = 50;

        public int MaxPoints { get; set; } = 500;

        public int DecayRate { get; set; } = 30;

        public int FirstBloodBonus { get; set; } = 10;

        [Required]
        public string FlagHash { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public ICollection<SubmissionData> Submissions { get; set; } = new List<SubmissionData>();

        // Just a math function, it's okay to store it here i think... Domnul Antohi o sa fie suparat ca am pus-o aici ? :D
        // Trebuieste pentru degradarea punctelor in functie de numarul de solve-uri
        public int CalculateCurrentPoints(int maxPoints, int minPoints, int decayRate, int solveCount)
        {
            double value = ((double)(minPoints - maxPoints) / (decayRate * decayRate)) * (solveCount * solveCount) + maxPoints;
            return Math.Max((int)Math.Ceiling(value), minPoints);
        }
    }
}
