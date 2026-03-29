using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.Submission;

public class SubmissionData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int ChallengeId { get; set; }
    [Required]
    public string Flag { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public DateTime CreatedOn { get; set; }
}