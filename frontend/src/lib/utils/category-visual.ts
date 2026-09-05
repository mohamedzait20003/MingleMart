/**
 * How a department is coloured, keyed by its slug.
 *
 * The catalogue supplies names, counts and product images; it has no opinion
 * about palette, and it should not - that is a decision about this design, not
 * about the data. The matching glyph lives in `category-icon.tsx`, kept apart
 * so this file exports no components and stays a plain data module.
 */

export type Tone = 1 | 2 | 3 | 4 | 5

const TONES: Record<string, Tone> = {
    electronics: 2,
    fashion: 1,
    "home-living": 5,
    beauty: 4,
    sports: 3,
    "toys-games": 2,
}

export const TONE_CLASS: Record<Tone, string> = {
    1: "from-chart-1/25 to-chart-1/5 text-chart-1",
    2: "from-chart-2/25 to-chart-2/5 text-chart-2",
    3: "from-chart-3/25 to-chart-3/5 text-chart-3",
    4: "from-chart-4/25 to-chart-4/5 text-chart-4",
    5: "from-chart-5/25 to-chart-5/5 text-chart-5",
}

/** The tile variant, which sits on a lighter wash and borders on hover. */
export const TONE_TILE_CLASS: Record<Tone, string> = {
    1: "from-chart-1/20 to-chart-1/5 text-chart-1 group-hover/cat:border-chart-1/40",
    2: "from-chart-2/20 to-chart-2/5 text-chart-2 group-hover/cat:border-chart-2/40",
    3: "from-chart-3/20 to-chart-3/5 text-chart-3 group-hover/cat:border-chart-3/40",
    4: "from-chart-4/20 to-chart-4/5 text-chart-4 group-hover/cat:border-chart-4/40",
    5: "from-chart-5/20 to-chart-5/5 text-chart-5 group-hover/cat:border-chart-5/40",
}

/**
 * A stable tone for a category the map has not been taught yet.
 *
 * Derived from the slug so the same department always draws the same colour -
 * on the server and in the browser, and across a reseeded catalogue. Anything
 * random would differ between those two renders and be thrown away on
 * hydration.
 */
export function toneFor(slug: string): Tone {
    const known = TONES[slug]
    if (known) return known

    let sum = 0
    for (const character of slug) sum += character.charCodeAt(0)
    return ((sum % 5) + 1) as Tone
}
