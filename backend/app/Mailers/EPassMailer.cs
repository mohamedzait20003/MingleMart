using RazorEngineCore;

namespace App.Mailers
{
    public class EPassMailer : Mailer
    {
        private readonly string _toEmail;

        public EPassMailer(
            string toEmail,
            string firstName,
            string lastName,
            string resetUrl,
            IRazorEngine razorEngine,
            IWebHostEnvironment environment
        ) : base(razorEngine, environment)
        {
            _toEmail = toEmail;

            With("FirstName", firstName);
            With("LastName", lastName);
            With("ResetUrl", resetUrl);
        }

        public override MailContent Content()
        {
            return new MailContent {
                View = "EPassTemplate"
            };
        }

        public override MailEnvelope Envelope()
        {
            return new MailEnvelope {
                To = _toEmail,
                Subject = "Reset Your Password - ZCommerce"
            };
        }
    }
}