using RazorEngineCore;

namespace App.Mailers
{
    public class ESubsMailer : Mailer
    {
        private readonly string _toEmail;

        public ESubsMailer(
            string toEmail,
            IRazorEngine razorEngine, 
            IWebHostEnvironment environment
        ) : base(razorEngine, environment)
        {
            _toEmail = toEmail;
        }

        public override MailContent Content()
        {
            return new MailContent {
                View = "ESubsTemplate"
            };
        }

        public override MailEnvelope Envelope()
        {
            return new MailEnvelope {
                To = _toEmail,
                Subject = "Subscription Successful"
            };
        }
    }
}