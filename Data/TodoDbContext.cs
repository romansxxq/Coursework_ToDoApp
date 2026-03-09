using Microsoft.EntityFrameworkCore;
using ToDo_Project.Models.Domain.Entities;

namespace ToDo_Project.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
    {
    }
    
    // DbSets for entities
    public DbSet<Task> Tasks { get; set; } = null!;
    public DbSet<OneTimeTask> OneTimeTasks { get; set; } = null!;
    public DbSet<RepeatingTask> RepeatingTasks { get; set; } = null!;
    public DbSet<Reminder> Reminders { get; set; } = null!;
    public DbSet<TaskHistory> TaskHistories { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Task entity configuration
        modelBuilder.Entity<Task>()
            .HasKey(t => t.Id);
            
        modelBuilder.Entity<Task>()
            .Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);
        
        modelBuilder.Entity<Task>()
            .HasDiscriminator<string>("TaskType")
            .HasValue<OneTimeTask>("OneTimeTask")
            .HasValue<RepeatingTask>("RepeatingTask");
        
        // OneTimeTask configuration
        modelBuilder.Entity<OneTimeTask>()
            .ToTable("OneTimeTasks");
        
        // RepeatingTask configuration
        modelBuilder.Entity<RepeatingTask>()
            .ToTable("RepeatingTasks");
        
        // Reminder entity configuration
        modelBuilder.Entity<Reminder>()
            .HasKey(r => r.Id);
        
        modelBuilder.Entity<Reminder>()
            .HasOne(r => r.Task)
            .WithMany()
            .HasForeignKey(r => r.TaskId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // TaskHistory entity configuration
        modelBuilder.Entity<TaskHistory>()
            .HasKey(th => th.Id);
        
        modelBuilder.Entity<TaskHistory>()
            .HasOne(th => th.Task)
            .WithMany()
            .HasForeignKey(th => th.TaskId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}