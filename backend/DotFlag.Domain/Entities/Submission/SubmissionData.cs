using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.User;
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

    [ForeignKey("UserId")]
    public UserData User { get; set; }

    [Required]
    public int ChallengeId { get; set; }

    [ForeignKey("ChallengeId")]
    public ChallengeData Challenge { get; set; }

    [Required]
    public string Flag { get; set; } = string.Empty;
    
    public bool IsCorrect { get; set; }

    public int BonusPoints { get; set; }

    /// <summary>
    /// Compensation points granted when the challenge was deactivated/deleted.
    /// Counted in the user's score even when the challenge is inactive.
    /// </summary>
    public int CompensationPoints { get; set; } = 0;

    public DateTime CreatedOn { get; set; }
}