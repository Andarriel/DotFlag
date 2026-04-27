namespace DotFlag.Domain.Models.Submission;

public class SubmissionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ChallengeId {get; set;}
    public bool IsCorrect {get; set;}
    public int BonusPoints { get; set; }
    public string Username { get; set; } = string.Empty;
    public string ChallengeName { get; set; } = string.Empty;
    public DateTime Timestamp {get; set;}
    public int ChallengeCurrentPoints { get; set; }
    public bool IsChallengeActive { get; set; }
}