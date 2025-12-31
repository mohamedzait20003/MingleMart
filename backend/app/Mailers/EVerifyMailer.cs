using RazorEngineCore;

namespace App.Mailers
{
    public class EVerifyMailer : Mailer
    {
        private readonly string _toEmail;


        public EVerifyMailer(
            string toEmail,
            string firstName,
            string lastName,
            string verificationToken,
            string verificationUrl,
            IRazorEngine razorEngine, 
            IWebHostEnvironment environment
        ) : base(razorEngine, environment)
        {
            _toEmail = toEmail;

            With("FirstName", firstName);
            With("LastName", lastName);
            With("VerificationToken", verificationToken);
            With("VerificationUrl", verificationUrl);
        }

        public override MailContent Content()
        {
            return new MailContent {
                View = "EVerifyTemplate"
            };
        }

        public override MailEnvelope Envelope()
        {
            return new MailEnvelope {
                To = _toEmail,
                Subject = "Verify your account"
            };
        }
    }
}