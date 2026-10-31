# Hostamble color-only palette and contrast

This change **does not move sections, alter spacing, adjust typography, replace illustrations, or change animations**. It replaces color values in the existing CSS and recolors the existing logo/favicons without modifying their paths.

| Swatch | Hex | Purpose |
|---|---|---|
| Ivory | `#F7F5F0` | Main canvas and light text on charcoal |
| Charcoal | `#20211F` | Dark sections and primary type |
| Clay | `#A84223` | Accessible branded links and primary accents |
| Limestone | `#EDE9E1` | Soft surfaces / panels |
| White | `#FFFFFF` | Cards and text on clay |
| Secondary text | `#565952` | Readable neutral copy on ivory / limestone |

## Contrast calculations (WCAG relative luminance)

- Charcoal on ivory: **14.84:1**
- Charcoal on limestone: **13.35:1**
- Clay on ivory: **5.56:1**
- Clay on white: **6.05:1**
- Clay on limestone: **5.00:1**
- White on clay: **6.05:1**
- Muted secondary text on ivory: **6.54:1**

**Do not place charcoal text on clay**: only **2.67:1**, below normal-text AA. Clay call-to-action buttons and the original favicon use white foreground. Because clay also lacks sufficient contrast against charcoal, critical text accents on dark sections use ivory.

The GitHub browser-smoke script audits rendered visible text colors at **375px and 1440px** on all main routes and fails on text below WCAG AA's **4.5:1** normal / **3:1** large threshold. The test also exercises widths 320, 375, 768, 1024, 1440 and the existing billing selector, domain search, navigation, FAQ and reduced-motion logic. Full visual accessibility certification and any third-party embed content require a manual audit.
