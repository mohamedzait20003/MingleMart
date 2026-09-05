import type { LegalSection } from "./legal-document"

export const TERMS_UPDATED = "30 August 2026"

/**
 * Terms of service, as data. Same structure as the privacy policy so both
 * documents render through one component and number themselves identically.
 *
 * Not legal advice, and not reviewed by a lawyer. Have counsel read this before
 * it goes anywhere near production.
 */
export const TERMS_SECTIONS: LegalSection[] = [
    {
        id: "the-agreement",
        title: "The agreement",
        blocks: [
            {
                kind: "note",
                text: "Using MingleMart means accepting these terms. If you do not, do not use the site.",
            },
            {
                kind: "p",
                text: "These terms are the agreement between you and MingleMart. They apply whenever you browse the shop, hold an account, or place an order, and they sit alongside the privacy policy rather than replacing it.",
            },
            {
                kind: "p",
                text: "Nothing here removes a right you hold under consumer law. Where a clause conflicts with a right you cannot waive, the law wins and the rest of the agreement stands.",
            },
        ],
    },
    {
        id: "what-we-are",
        title: "What MingleMart is",
        blocks: [
            {
                kind: "note",
                text: "We are the marketplace, not the shop. Independent sellers sell to you; we handle the money and stand behind the order.",
            },
            {
                kind: "p",
                text: "Every product here is listed and dispatched by an independent seller. Your contract for the goods is with them. Ours is for the platform, the payment, and the protection described in section 6 — and we do stand behind that last one.",
            },
            {
                kind: "p",
                text: "Sellers are verified before their first listing goes live, but we do not inspect every item. Product descriptions and photographs are the seller's, and it is the seller who is responsible for their accuracy.",
            },
        ],
    },
    {
        id: "your-account",
        title: "Your account",
        blocks: [
            {
                kind: "note",
                text: "One account per person, sixteen or over, and the password is yours to keep safe.",
            },
            {
                kind: "list",
                items: [
                    "You must be at least sixteen and able to enter a binding contract where you live.",
                    "Give accurate details, and keep the email address current — it is where order and refund notices go.",
                    "Keep your password to yourself. Activity under your account is treated as yours unless you have told us it was not.",
                    "Tell us at once if you think someone else has access, and we will lock the account while it is sorted out.",
                ],
            },
            {
                kind: "p",
                text: "You can close your account whenever you like, from your profile. We may suspend an account for fraud, abuse of a seller or of our staff, or a serious breach of these terms — and we will say which, in writing.",
            },
        ],
    },
    {
        id: "orders-and-prices",
        title: "Orders and prices",
        blocks: [
            {
                kind: "note",
                text: "The price shown includes tax and shows shipping before you pay. If we get a price badly wrong, we will tell you rather than quietly charge it.",
            },
            {
                kind: "list",
                items: [
                    "Prices include applicable tax, and shipping is shown before the payment step. There are no fees added after that screen.",
                    "An order is an offer to buy. The contract forms when the seller confirms dispatch, not when you click pay.",
                    "If an item is mispriced by an obvious error, we may cancel and refund in full rather than fulfil it. We will contact you first, and you keep the option to reorder at the correct price.",
                    "Discounts and sale prices are struck against what the item actually sold for in the preceding thirty days.",
                    "Stock is not reserved by adding to a basket, only by completing checkout.",
                ],
            },
        ],
    },
    {
        id: "payment",
        title: "Payment",
        blocks: [
            {
                kind: "note",
                text: "We hold your money until the parcel arrives, then pass it to the seller.",
            },
            {
                kind: "p",
                text: "Payments are taken by our PCI-compliant processor; card details never reach our servers. Funds are held by us and released to the seller once delivery is confirmed, which is what makes the protection in section 6 possible.",
            },
            {
                kind: "p",
                text: "If a payment is reversed after dispatch, we may recover the amount from you or suspend the account until it is settled.",
            },
        ],
    },
    {
        id: "delivery-and-returns",
        title: "Delivery, returns and refunds",
        blocks: [
            {
                kind: "note",
                text: "Thirty days to return anything, postage paid by us, sale items included.",
            },
            {
                kind: "list",
                items: [
                    "Delivery estimates are estimates. If a parcel is more than ten days late, tell us and we will refund it in full and chase the courier ourselves.",
                    "You may return any item within thirty days of delivery, in a condition that allows resale. Return postage is on us.",
                    "Refunds are issued to the original payment method as soon as the carrier scans the return, not when the seller receives it.",
                    "Perishable, personalised, and hygiene-sealed goods are excluded once opened, and every such listing says so before you buy.",
                    "If an item arrives damaged, faulty or not as described, you are entitled to a full refund including the original shipping.",
                ],
            },
        ],
    },
    {
        id: "acceptable-use",
        title: "Acceptable use",
        blocks: [
            {
                kind: "note",
                text: "Do not scrape it, break it, or use it to defraud people.",
            },
            {
                kind: "list",
                items: [
                    "No scraping, bulk downloading, or automated access outside a documented API.",
                    "No attempt to probe, disrupt or circumvent the security of the site or another user's account.",
                    "No fraudulent orders, fake reviews, or manipulation of seller ratings.",
                    "No abuse, harassment or threats directed at sellers, other shoppers, or our staff.",
                    "No resale of the platform itself, and no framing or white-labelling it as your own.",
                ],
            },
        ],
    },
    {
        id: "content-and-reviews",
        title: "Reviews and anything else you post",
        blocks: [
            {
                kind: "note",
                text: "Your review stays yours; we get permission to display it. Honest criticism is never removed.",
            },
            {
                kind: "p",
                text: "You keep ownership of reviews, photographs and messages you post. By posting them you give us a non-exclusive licence to display and distribute them in connection with the shop.",
            },
            {
                kind: "p",
                text: "We remove content that is unlawful, abusive, or plainly fake. We do not remove a review because a seller dislikes it, and we do not let sellers pay to have one taken down.",
            },
        ],
    },
    {
        id: "our-liability",
        title: "Our liability",
        blocks: [
            {
                kind: "note",
                text: "We are responsible for the order and the money. We are not responsible for consequential losses.",
            },
            {
                kind: "p",
                text: "We do not limit liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot be limited by law.",
            },
            {
                kind: "p",
                text: "Beyond that, our liability for any order is limited to the amount you paid for it. We are not liable for indirect or consequential loss, including lost profit or lost opportunity.",
            },
        ],
    },
    {
        id: "changes-and-law",
        title: "Changes, and the law that applies",
        blocks: [
            {
                kind: "note",
                text: "We give thirty days' notice of material changes, and disputes are settled under English law.",
            },
            {
                kind: "p",
                text: "We may update these terms. The date at the top of the page is always the current version, and any change that materially affects your rights is emailed to account holders at least thirty days before it takes effect. Orders already placed are governed by the terms in force when you placed them.",
            },
            {
                kind: "p",
                text: "These terms are governed by the laws of England and Wales, and the courts there have jurisdiction — which does not remove your right to bring a claim where you live if consumer law gives you one.",
            },
            {
                kind: "p",
                text: "Questions about any of this go to legal@minglemart.com, and a person will answer.",
            },
        ],
    },
]
