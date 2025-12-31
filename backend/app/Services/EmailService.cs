using MimeKit;
using MailKit;
using App.Mailers;
using RazorEngineCore;
using MailKit.Net.Smtp;
using MailKit.Security;


namespace App.Services
{
    public class MailSettings
    {
        public required string Server { get; set; }
        public required int Port { get; set; }
        public required string SenderName { get; set; }
        public required string SenderEmail { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
    }

    public interface IEmailService
    {
        Task SendAsync (Mailer mailer);
    }

    public class EmailService : IEmailService
    {
        private readonly MailSettings _mailSettings;

        public EmailService(IConfiguration configuration)
        {
            var mailSettings = configuration.GetSection("MailSettings").Get<MailSettings>();
            if (mailSettings is null)
                throw new ArgumentNullException(nameof(mailSettings), "MailSettings configuration section is missing or invalid.");
            
            _mailSettings = mailSettings;
        }

        public async Task SendAsync(Mailer mailer)
        {
            var htmlBody = await mailer.BuildAsync();
            var envelope = mailer.Envelope();

            await SendSmtpAsync(envelope, htmlBody);
        }

        private async Task SendSmtpAsync(MailEnvelope envelope, string htmlBody)
        {
            var message = new MimeMessage();

            var SenderEmail = envelope.From ?? _mailSettings.SenderEmail;
            var SenderName = envelope.FromName ?? _mailSettings.SenderName;

            message.From.Add(new MailboxAddress(SenderName, SenderEmail));
            message.To.Add(MailboxAddress.Parse(envelope.To));
            message.Subject = envelope.Subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            using var smtpClient = new SmtpClient();

            try{
                await smtpClient.ConnectAsync(
                    _mailSettings.Server, 
                    _mailSettings.Port, 
                    SecureSocketOptions.StartTls
                );

                await smtpClient.AuthenticateAsync(
                    _mailSettings.UserName, 
                    _mailSettings.Password
                );

                await smtpClient.SendAsync(message);
            } finally {
                await smtpClient.DisconnectAsync(true);
            }
        }
    }
}

