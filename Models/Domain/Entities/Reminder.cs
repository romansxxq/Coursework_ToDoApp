public class Reminder
{
    public Guid Id { get; set; }
    public DateTime RemindAt { get; set; }
    public Guid TaskId { get; set; }
    public bool IsSent { get; set; }
    public int MinutesBefore { get; set; }
    public Task? Task { get; set; }
}