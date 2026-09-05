import type { LegalSection } from "./legal-document"

export const ACCESSIBILITY_UPDATED = "2 September 2026";

/**
 * The accessibility statement.
 *
 * Written as a legal-document section list so it reads, anchors and links like
 * the privacy policy - a statement people cite clause-by-clause when raising a
 * problem is only useful if each clause has its own URL.
 */
export const ACCESSIBILITY_SECTIONS: LegalSection[] = [
    {
        id: "our-commitment",
        title: "Our commitment",
        blocks: [
            {
                kind: "note",
                text: "We aim to meet WCAG 2.2 level AA across the whole marketplace, and we publish where we currently fall short.",
            },
            {
                kind: "p",
                text: "MingleMart should be usable with a keyboard alone, with a screen reader, at 200% zoom, and with motion switched off. Those are not enhancements bolted on at the end; a change that breaks one of them is treated as a bug, not as a trade-off.",
            },
            {
                kind: "p",
                text: "This statement describes what we currently meet, what we know we do not, and how to tell us when we are wrong about either.",
            },
        ],
    },
    {
        id: "what-we-support",
        title: "What is supported today",
        blocks: [
            {
                kind: "note",
                text: "Keyboard, screen reader, zoom, reduced motion and forced colours.",
            },
            { kind: "h3", text: "Keyboard" },
            {
                kind: "list",
                items: [
                    "Every control is reachable with Tab, in the order it appears on screen.",
                    "Focus is always visible, with a ring that clears 3:1 against its background in both themes.",
                    "A skip link jumps past the navigation to the main content.",
                    "Dialogs and drawers trap focus while open, restore it on close, and close on Escape.",
                ],
            },
            { kind: "h3", text: "Screen readers" },
            {
                kind: "list",
                items: [
                    "Tested with NVDA on Windows, VoiceOver on macOS and iOS, and TalkBack on Android.",
                    "Every icon-only control carries a text label; no meaning is conveyed by an icon alone.",
                    "Landmarks name themselves, so the navigation, main content and footer are announced distinctly.",
                    "Live regions announce form errors and status changes without stealing focus.",
                ],
            },
            { kind: "h3", text: "Vision and motion" },
            {
                kind: "list",
                items: [
                    "Body text meets 4.5:1 contrast, and larger text 3:1, in both the light and the dark theme.",
                    "Layouts reflow to 320px and to 200% zoom without horizontal scrolling or clipped text.",
                    "Colour is never the only carrier of meaning: errors, discounts and stock states all pair it with text or a glyph.",
                    "Setting reduced motion in your system removes the scroll reveals, parallax and count-ups.",
                ],
            },
        ],
    },
    {
        id: "known-gaps",
        title: "Where we currently fall short",
        blocks: [
            {
                kind: "note",
                text: "Three known failures, with the quarter each is scheduled for.",
            },
            {
                kind: "p",
                text: "We would rather publish these than let you discover them. Each is reproducible, logged, and assigned.",
            },
            {
                kind: "list",
                items: [
                    "Seller-uploaded product photographs have no alternative text unless the seller wrote one. We are adding a required field, and prompting sellers to backfill the existing catalogue.",
                    "The product image gallery cannot yet be operated with arrow keys; the thumbnails are reachable by Tab in the meantime.",
                    "Some longer data tables in the seller dashboard scroll horizontally below 320px rather than reflowing.",
                ],
            },
        ],
    },
    {
        id: "assistive-tech",
        title: "What we test with",
        blocks: [
            {
                kind: "note",
                text: "Automated checks on every change, and a manual pass each quarter.",
            },
            {
                kind: "p",
                text: "Automated contrast, landmark and label checks run against every pull request, and a build that regresses one does not merge. Automation catches perhaps a third of what matters, so a manual pass covers the rest each quarter: keyboard-only checkout, a screen-reader run through search and returns, and a 200% zoom sweep of every page.",
            },
        ],
    },
    {
        id: "telling-us",
        title: "Telling us something is wrong",
        blocks: [
            {
                kind: "note",
                text: "Write to accessibility@minglemart.example. We reply within two working days.",
            },
            {
                kind: "p",
                text: "Tell us the page, what you were trying to do, and what you use to browse - the browser, and any screen reader or magnifier. None of that is required, and a one-line report is still worth sending.",
            },
            {
                kind: "p",
                text: "We acknowledge every report within two working days and tell you either that it is fixed, or which quarter it is scheduled for. If a barrier stops you completing an order, support can complete it for you over the phone in the meantime.",
            },
        ],
    },
];
