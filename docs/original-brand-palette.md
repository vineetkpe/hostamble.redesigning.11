# Original Hostamble palette — colors only

The existing layout, typography, spacing, SVG paths, content and animations are unchanged. Styles reuse shared CSS variables in `src/styles/global.css`.

| Role | Hex |
| --- | --- |
| Primary orange | `#D3751D` |
| Bright orange, limited emphasis | `#FF6027` |
| Dark charcoal | `#202133` |
| Secondary text | `#6F6B80` |
| Main background, cards | `#FFFFFF` |
| Alternate section/card background | `#F5F5F5` |

**Contrast-driven supporting colors:** `#A34D13` for body links on white (primary orange is only about 3.3:1 against white), `#A14A0F` for white-on-orange buttons, and `#FFC18C` for link emphasis on dark backgrounds. These preserve the requested primary orange for visual accents and limit bright orange to highlighted type and promotional details. `#257A4A` remains a distinct meaningful success color; `#B42318` is reserved for error status.

The browser smoke workflow checks visible text contrast against WCAG AA at 375px and 1440px, and layout/functionality across 320, 375, 768, 1024 and 1440px. Its rendered HTML checks protect page section counts, the pricing toggle, domain form and mobile interaction.
