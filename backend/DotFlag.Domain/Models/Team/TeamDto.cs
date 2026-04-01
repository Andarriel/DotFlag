namespace DotFlag.Domain.Models.Team
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MemberCount { get; set; }
        public DateTime CreatedOn { get; set; }
        public ICollection<TeamMemberDto> Members { get; set; } = new List<TeamMemberDto>();
    }
}
