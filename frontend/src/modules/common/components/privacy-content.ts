import type { LegalSection } from "./legal-document"

export const PRIVACY_UPDATED = "30 August 2026";


export const PRIVACY_SECTIONS: LegalSection[] = [
    {
        id: "what-this-covers",
        title: "What this covers",
        blocks: [
            {
                kind: "note",
                text: "This explains what we record about you, why, and how to make us stop.",
            },
            {
                kind: "p",
                text: "This policy applies to everything at MingleMart: the shop, your account, our emails, and the support conversations in between. It does not cover what an individual seller does with information you send them directly — their own policy governs that, and it is linked from every seller profile.",
            },
            {
                kind: "p",
                text: "We are the data controller for the information described here. Where the law gives you a right over that information, section 7 says how to use it.",
            },
        ],
    },
    {
        id: "what-we-collect",
        title: "What we collect",
        blocks: [
            {
                kind: "note",
                text: "What you type in, what you buy, and roughly how you use the site. Not your card number.",
            },
            { kind: "h3", text: "Information you give us" },
            {
                kind: "list",
                items: [
                    "Your name, email address and, if you add one, a phone number.",
                    "Delivery and billing addresses, kept so you do not retype them every order.",
                    "Order history, returns, and the messages you exchange with sellers or with support.",
                    "Your account password, stored only as a salted hash that cannot be reversed.",
                ],
            },
            { kind: "h3", text: "Information we record automatically" },
            {
                kind: "list",
                items: [
                    "Device, browser and operating-system details, used to render the site correctly and to spot fraud.",
                    "Approximate location from your IP address — city level, not street level.",
                    "Pages viewed and searches run, aggregated to work out which parts of the shop are failing people.",
                ],
            },
            { kind: "h3", text: "What we never hold" },
            {
                kind: "p",
                text: "Card numbers never touch our servers. Payment details go straight to our PCI-compliant processor, and what comes back to us is the last four digits, the card brand, and whether the charge succeeded.",
            },
        ],
    },
    {
        id: "why-we-use-it",
        title: "Why we use it",
        blocks: [
            {
                kind: "note",
                text: "To take the order, deliver it, keep the account secure, and improve the shop. Nothing else.",
            },
            {
                kind: "list",
                items: [
                    "Processing orders, payments, refunds and returns — we cannot ship a parcel without an address.",
                    "Keeping your account secure and detecting fraudulent orders and account takeovers.",
                    "Answering support requests, which needs the order history in front of the person replying.",
                    "Sending service messages: order confirmations, dispatch notices, and refund receipts. These are not marketing and cannot be switched off while an order is live.",
                    "Improving the shop, using aggregated behaviour rather than anything tied to your name.",
                    "Sending marketing email, but only if you asked for it, and only until you tell us to stop.",
                ],
            },
        ],
    },
    {
        id: "who-sees-it",
        title: "Who sees it",
        blocks: [
            {
                kind: "note",
                text: "The seller you bought from, the courier, and our payment processor. We do not sell your data.",
            },
            {
                kind: "p",
                text: "We do not sell personal information, and we do not rent mailing lists. Information leaves us in four situations only:",
            },
            {
                kind: "list",
                items: [
                    "The seller you ordered from receives your name, delivery address, and the order itself, so they can send it.",
                    "The courier receives the delivery address and, if you gave one, a phone number for the delivery notification.",
                    "Our payment processor and fraud provider receive what they need to take the payment and check it.",
                    "A law-enforcement or regulatory body with a valid order. We will tell you when one arrives unless we are legally barred from doing so.",
                ],
            },
            {
                kind: "p",
                text: "Every processor we use is bound by contract to handle your information only on our instructions, and to delete it when the contract ends.",
            },
        ],
    },
    {
        id: "cookies",
        title: "Cookies and similar technologies",
        blocks: [
            {
                kind: "note",
                text: "Some cookies keep you logged in and hold your basket. The rest are optional, and off until you say otherwise.",
            },
            {
                kind: "list",
                items: [
                    "Essential cookies keep your session alive, hold your basket, and protect forms against cross-site request forgery. The site does not work without them.",
                    "Preference cookies remember your theme and any filters you have set, so the shop looks the same when you come back.",
                    "Analytics cookies count visits in aggregate. They are only set if you accept them, and refusing costs you nothing.",
                ],
            },
            {
                kind: "p",
                text: "You can clear or block cookies in your browser at any time. Blocking the essential ones will log you out and empty your basket.",
            },
        ],
    },
    {
        id: "how-long",
        title: "How long we keep it",
        blocks: [
            {
                kind: "note",
                text: "Order records for seven years because tax law says so. Everything else goes when you close the account.",
            },
            {
                kind: "list",
                items: [
                    "Order and payment records: seven years, as tax and accounting law requires.",
                    "Account details: for as long as the account is open, then deleted within thirty days of closure.",
                    "Support conversations: two years, so a repeat problem has context.",
                    "Analytics data: twenty-six months, and de-identified before then.",
                ],
            },
        ],
    },
    {
        id: "your-rights",
        title: "Your rights over your information",
        blocks: [
            {
                kind: "note",
                text: "You can see it, correct it, take it elsewhere, or have it deleted. Ask, and we act within thirty days.",
            },
            {
                kind: "list",
                items: [
                    "Access: ask for a copy of everything we hold about you.",
                    "Correction: fix anything inaccurate, most of it directly from your profile page.",
                    "Deletion: have your account and its data removed, except records we are legally required to keep.",
                    "Portability: receive your data in a machine-readable file you can take to another service.",
                    "Objection: tell us to stop processing for marketing, which we will do immediately.",
                ],
            },
            {
                kind: "p",
                text: "Write to privacy@minglemart.com from the address on your account. We respond within thirty days, and we do not charge for any of it. If you are not satisfied with the outcome, you can complain to your national data-protection authority.",
            },
        ],
    },
    {
        id: "security",
        title: "How we protect it",
        blocks: [
            {
                kind: "note",
                text: "Encrypted in transit and at rest, with access limited to the people who need it.",
            },
            {
                kind: "list",
                items: [
                    "Everything travels over TLS, and stored personal data is encrypted at rest.",
                    "Staff access is role-based, granted only where a job requires it, and logged.",
                    "Passwords are hashed with a modern, slow algorithm and are never recoverable, by us or anyone else.",
                    "We run third-party penetration tests annually and patch what they find.",
                ],
            },
            {
                kind: "p",
                text: "No system is perfect. If a breach affects you, we will tell you and the relevant regulator within seventy-two hours of finding it, along with what we know and what to do about it.",
            },
        ],
    },
    {
        id: "children",
        title: "Children",
        blocks: [
            {
                kind: "note",
                text: "The shop is not for under-16s, and we delete their accounts when we find them.",
            },
            {
                kind: "p",
                text: "MingleMart is not directed at children under sixteen and we do not knowingly collect their information. If you believe a child has created an account, write to privacy@minglemart.com and we will remove it and its data.",
            },
        ],
    },
    {
        id: "changes",
        title: "Changes to this policy",
        blocks: [
            {
                kind: "note",
                text: "If we change something that matters, you get an email before it takes effect.",
            },
            {
                kind: "p",
                text: "We update this policy when what we do changes. The date at the top of the page always reflects the current version, and any change that materially affects your rights is emailed to account holders at least thirty days before it takes effect.",
            },
        ],
    },
]
