namespace Database.Seeders
{
    public interface ISeeder
    {
        int Order { get; }
        string Name { get; }
        string Icon { get; }
        Task SeedAsync();
    }
}