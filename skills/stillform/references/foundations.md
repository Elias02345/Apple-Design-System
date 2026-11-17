# Foundation contracts

## Typography and space

On Apple platforms begin with semantic text styles, system fonts and Dynamic Type. Let text wrap or switch arrangement before truncating a task-critical noun, amount or error. Use native formatters for dates, currency and measurements. Pick tabular digits for live readouts; a changing digit should not move the unit. Keep units adjacent in the accessible name. [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)

The web starter defines a .25, .5, .75, 1, 1.5, 2, 3 and 4 rem spacing scale. Keep label and value closer than adjacent groups. Start text at 1 rem with 1.5 line height. Use a readable measure around 45–70 characters for sustained prose and allow narrow screens to go shorter. These are changeable web defaults. With 200% text, reflow toolbars and stack sidecars. Keep ordinary document scrolling available.

| Role | Web source | Native counterpart |
| --- | --- | --- |
| Primary reading | `--ink` on `--paper` | `.primary`, platform content background |
| Supporting context | `--muted` | `.secondary` |
| Action / on action | `--tint` / `--on-tint` | Semantic tint and system button styles |
| Grouping / boundary | `--panel`, `--soft`, `--line` | Form sections, list styles, separators |
| Keyboard focus | `--focus` plus visible outline | System focus engine and focus ring |
| Error | `--error` plus text | Labeled inline explanation and semantic role |

Tokens and component rules are separated so a product can change character without replacing input behavior. [Tokens](../assets/web/tokens.css) · [Base controls](../assets/web/base.css)

## Color, imagery and materials

Evaluate foreground/background pairs in each appearance, including selection, focus and hover. For WCAG AA on web aim for 4.5:1 for ordinary text and 3:1 for qualifying large text. Applicable control boundaries and meaningful non-text graphics need 3:1 against adjacent colors. Evaluate each actual pairing and applicable exception. Pair state color with a label, shape or icon. [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

Choose imagery that communicates the object, its material, scale, location or state. Repeat a crop across comparable objects. Reserve an image's intrinsic aspect ratio to avoid layout shifts. Give informative images concise alt text. Give a thumbnail next to an identical text label empty alt text. A generated specimen is suitable for an illustrative interface; scientific identification or product listings require verified source imagery.

Consider platform-provided materials for overlapping controls or navigation. Give reading and editing surfaces a stable contrast floor. Test over a photo, a blank surface and the highest-contrast transition. Honor Reduce Transparency through platform APIs where available and provide a solid fallback on web. [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)

## Layout and inputs

Use logical properties (`padding-inline`, leading, trailing) and native localization. Mirror directional navigation and reading flow in RTL. Preserve the orientation of physical objects and established media controls. Time axes and data visualizations need a domain decision and labeled direction. Mix RTL names and Latin identifiers in tests. [Right to left](https://developer.apple.com/design/human-interface-guidelines/right-to-left)

Use native target sizes for the platform and input. The web examples choose a 44 CSS-pixel minimum control height at default text size. CSS pixels, Apple points and visual icon sizes describe different things. For tiny glyphs, enlarge the actionable area without overlapping other targets. Test the effective target at the edge. [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
