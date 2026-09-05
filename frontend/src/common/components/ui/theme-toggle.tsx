import type { ComponentProps } from "react"
import { Menu } from "@base-ui/react/menu"
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/utils/utils"
import { useTheme, type Theme } from "@/lib/hooks/useTheme"

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

function ThemeToggle({ className, ...props }: Readonly<ComponentProps<"button">>) {
  const { theme, setTheme } = useTheme()

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Change theme"
        className={cn(
          "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none",
          "hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 data-popup-open:bg-muted data-popup-open:text-foreground",
          className
        )}
        {...props}
      >
        {/* Driven by the `.dark` class rather than React state: the server cannot
            know the visitor's theme, so a state-driven icon would either mismatch
            on hydration or flash the wrong glyph. CSS has the answer at paint. */}
        <SunIcon className="size-5 dark:hidden" />
        <MoonIcon className="hidden size-5 dark:block" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup
            className={cn(
              "min-w-40 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none",
              "origin-(--transform-origin) transition-[opacity,transform] duration-200 ease-out",
              "data-starting-style:scale-95 data-starting-style:opacity-0",
              "data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150",
              "motion-reduce:transition-none"
            )}
          >
            <Menu.RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <Menu.RadioItem
                  key={value}
                  value={value}
                  className="flex h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm outline-none select-none data-highlighted:bg-muted data-highlighted:text-foreground"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">{label}</span>
                  {/* Reserved width, so the row does not shift when the tick moves. */}
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    <Menu.RadioItemIndicator>
                      <CheckIcon className="size-4 text-primary" />
                    </Menu.RadioItemIndicator>
                  </span>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export { ThemeToggle }
