# TASKS

## P0 Critical fixes

### A. Remove top artifacts
- Audit all layout wrappers, nav/header remnants, and global containers.
- Find the exact source of:
  - top white strip
  - stray `/>` artifact at top-left
- Remove root cause, not just hide it.
- Check:
  - App shell
  - layout wrappers
  - old header remnants
  - fragment leftovers
  - accidental text nodes
  - malformed JSX
  - pseudo-elements
  - margin/padding causing exposed strip

### B. Fix landing hero readability in light mode
- Only solve visibility problem for:
  - "Know the exact payback period before you pay the fee. Calculated for your city and current salary."
  - the "or a " part in hero composition
- Preserve overall hero concept.
- Improve contrast through layering, local overlays, image treatment, fog reduction, gradient control, or text treatment.
- Do not redesign the whole hero unnecessarily.

### C. Restore landing-page footer
- Add footer back to landing page.
- Ensure it matches site-wide footer system.

## P1 High-priority UI/system fixes

### D. Fix mode selector clarity
- Student / Switcher / Professional should not clip or truncate.
- Replace current broken oversized text layout with a balanced premium composition.
- Keep it clear, readable, and aligned with landing-page design language.
- Ensure desktop and mobile behavior are both resolved.

### E. Rebuild tools-page structure
- Reorganize tool selection area with proper shape, spacing, grouping, and flow.
- Center the composition.
- Improve scan order and hierarchy.
- Take inspiration from landing-page centered editorial rhythm.
- Reuse vertical text motif if it genuinely improves brand consistency.
- Add subtle morph transition between selected tools if feasible and tasteful.
- Avoid gimmicky animation.

### F. Replace low-quality buttons and surfaces
- Across internal pages, replace cheap glowing / neon / blinking boxes.
- Replace with premium capsule-inspired buttons and surfaces based on landing page.
- Ensure hover/focus/active states are restrained and polished.

## P2 Consistency upgrades

### G. Center major headings on key pages
- How It Works
- Features
- Pricing
- About
- FAQ
- Blog
- Tools

Requirements:
- Center headline composition in the spirit of landing page.
- Keep hierarchy and spacing consistent.
- Do not make every page identical; preserve page-specific content.

### H. Improve footer across site
- Create or complete pages for:
  - Terms and Conditions
  - Cookies
  - Data Privacy
- Link them from footer only.
- Add real written content, not placeholder text.
- Ensure footer is consistent across key pages.

### I. Theme and polish audit
- Ensure all pages use the same refined button language.
- Preserve meaningful green highlights where they indicate positive or important value.
- Remove AI-slop styling patterns everywhere.
- Remove cheap visual leftovers from previous iterations.
- Bring entire site to one premium system.

## File audit requirements
Before editing, identify likely responsible files for:
- top artifacts
- hero overlay/text contrast
- missing footer
- mode selector truncation
- tools page composition
- site-wide capsule button system
- footer legal pages/routes

## Output format for audit
Before making changes, report:
1. What is already correct
2. What is broken
3. Root-cause file suspects
4. P0 plan
5. P1 plan

## Done criteria
- No top white strip
- No stray `/>`
- Hero text readable in light mode
- Landing-page footer restored
- Mode selector no longer clips
- Tools page has strong centered flow
- Neon/glow boxes removed
- Internal page buttons match premium capsule system
- Main page headings centered consistently
- Footer includes real legal/info pages with content
- Site feels like one coherent product