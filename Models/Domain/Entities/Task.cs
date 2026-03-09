using Models.Domain.Enums;

namespace Models.Domain.Entities;

public abstract class Task
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public TypePriority Priority { get; set; }
    public TaskStatus Status { get; set; }
    public List<Reminder> Reminders { get; set; } = new();

    public virtual void Complete()
    {
        IsCompleted = true;
        Status = TaskStatus.Completed;
    }
    
}