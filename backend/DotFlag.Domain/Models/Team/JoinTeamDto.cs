using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.Team
{
    public class JoinTeamDto
    {
        [Required]
        [StringLength(12, MinimumLength = 12, ErrorMessage = "Invite code must be 12 characters long")]
        public string InviteCode { get; set; }
    }
}
