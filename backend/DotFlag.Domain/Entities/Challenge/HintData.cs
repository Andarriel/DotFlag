using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Challenge
{
    public class HintData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ChallengeId { get; set; }

        [ForeignKey("ChallengeId")]
        public ChallengeData Challenge { get; set; }

        [Required]
        [StringLength(maximumLength:500)]
        public string Content { get; set; }

        public int Order { get; set; }

    }
}
