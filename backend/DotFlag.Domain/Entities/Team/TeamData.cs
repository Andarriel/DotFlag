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
    [StringLength(25)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(32)]
    public string InviteCode { get; set; } = string.Empty;

    [DataType(DataType.DateTime)]
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

    // Navigation prop
    public ICollection<UserData> Users { get; set; } = new List<UserData>();
}