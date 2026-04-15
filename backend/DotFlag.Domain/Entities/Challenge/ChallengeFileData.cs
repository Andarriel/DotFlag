using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Challenge
{
    public class ChallengeFileData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ChallengeId { get; set; }

        [ForeignKey("ChallengeId")]
        public ChallengeData Challenge { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string StoredPath { get; set; }
    }
}
