import "react"

declare module "react" {
    /**
     * The animation primitives in src/common/components/animation are configured
     * through CSS custom properties (`--reveal-delay`, `--marquee-duration`,
     * `--float-distance`, ...), which React's stock CSSProperties rejects.
     */
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined
    }
}
