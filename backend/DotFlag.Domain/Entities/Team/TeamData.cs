using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DotFlag.Domain.Entities.User;

namespace DotFlag.Domain.Entities.Team;

public class TeamData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    [Required]
    [StringLength(25,MinimumLength = 3, ErrorMessage = "The Team Name is too short..")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(12,MinimumLength = 12, ErrorMessage = "Invite code must be 12 characters long")]
    public string InviteCode { get; set; } = string.Empty;

    [DataType(DataType.DateTime)]
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation prop
    public ICollection<UserData> Members { get; set; } = new List<UserData>();
}