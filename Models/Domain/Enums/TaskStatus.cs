namespace Models.Domain.Enums;

/// <summary>
/// Task status/state enumeration
/// Tracks the lifecycle of a task
/// </summary>
public enum TaskStatus
{
    Active = 0,
    Completed = 1,
    Cancelled = 2,
    Overdue = 3
}
