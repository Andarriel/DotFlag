using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.Team
{
    public class CreateTeamDto
    {
        [Required]
        [StringLength(25, MinimumLength = 3, ErrorMessage = "The Team Name is too short..")]
        public string Name { get; set; }
    }
}
