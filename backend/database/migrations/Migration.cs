namespace Database.Migrations
{
    public interface IMigration
    {
        int Order { get; }
        string Name { get; }
        string Icon { get; }
        Task MigrateAsync();
    }
}