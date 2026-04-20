using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Team
{
    public class TeamMemberDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int CurrentPoints { get; set; }
        public DateTime RegisteredOn { get; set; }
        public TeamRole? TeamRole { get; set; }
    }
}
