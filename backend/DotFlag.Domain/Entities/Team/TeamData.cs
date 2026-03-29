using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DotFlag.Domain.Models.User;

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
    
    public ICollection<UserDto> Users { get; set; } = new List<UserDto>();
}