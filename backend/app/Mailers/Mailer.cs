using RazorEngineCore;

namespace App.Mailers
{
    public class MailEnvelope
    {
        public required string To { get; set; }
        public required string Subject { get; set; }
        public string? From { get; set; }
        public string? FromName { get; set; }
    }

    public class MailContent
    {
        public required string View { get; set; }
    }

    public abstract class Mailer
    {
        protected readonly IRazorEngine _razorEngine;
        protected readonly IWebHostEnvironment _environment;

        private string? _renderedBody;

        public abstract MailContent Content();
        public abstract MailEnvelope Envelope();
        public Dictionary<string, object> Data { get; } = new();

        public Mailer(IRazorEngine razorEngine, IWebHostEnvironment environment)
        {
            _razorEngine = razorEngine;
            _environment = environment;
        }

        public async Task<string> BuildAsync()
        {
            if(_renderedBody is not null)
                return _renderedBody;

            var content = Content();

            var templatePath = Path.Combine(
                _environment.ContentRootPath, 
                "resources", 
                "Templates", 
                $"{content.View}.cshtml"
            );

            if(!File.Exists(templatePath))
                throw new FileNotFoundException($"Email template file not found: {templatePath}");

            var templateContent = await File.ReadAllTextAsync(templatePath);
            var razorTemplate = _razorEngine.Compile(templateContent);

            _renderedBody = await razorTemplate.RunAsync(Data);
            return _renderedBody;
        }

        protected void With(string key, object value)
        {
            Data[key] = value;
        }

        protected void With(Dictionary<string, object> data)
        {
            foreach (var kvp in data)
            {
                Data[kvp.Key] = kvp.Value;
            }
        }

        public async Task<string> RenderAsync()
        {
            return await BuildAsync();
        }
    }
}