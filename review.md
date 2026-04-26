# REVIEW

## Current state
The site has been partially edited, but the implementation is still inconsistent and incomplete.

## Confirmed current issues from latest review

### 1. Top artifact problem
- A white strip is still visible at the top.
- There is also a stray `/>` artifact visible at the top-left.
- Likely cause: leftover markup, removed header residue, broken wrapper spacing, or invalid render fragment.

### 2. Landing hero readability
- In light mode, text over the mountain image is still not readable enough.
- Specifically:
  - "Know the exact payback period before you pay the fee. Calculated for your city and current salary."
  - the "or a " portion in the main hero composition
- Cause is likely inconsistent contrast caused by image variance, gradient, fog overlay, or poor layering of text over image.

### 3. Missing footer
- Landing-page footer is still missing.
- Footer system overall needs improvement across pages.

### 4. Mode selector readability
- Student / Switcher / Professional selection area is clipping and truncating.
- The labels are not fitting properly and feel visually broken.
- Current presentation looks oversized, low-information, and not properly resolved.

### 5. Tools page structure
- Tools section looks scattered, flat, and without compositional flow.
- It does not match the landing page’s visual order or narrative quality.
- It should be reorganized with stronger hierarchy and centered flow.
- Vertical text motif from landing page may be reused.
- Add subtle morph effect on tool switching if it improves coherence.

### 6. Component design inconsistency
- Internal pages still contain button/box styles that do not match the landing-page capsule system.
- Cheap neon / glowing / blinking boxes should be removed.
- Replace them with high-quality restrained capsule or premium surface treatments.

### 7. Heading alignment inconsistency
- Main headings on:
  - How It Works
  - Features
  - Pricing
  - About
  - FAQ
  - Blog
  - Tools
- should be centered and visually composed in the same spirit as the landing page.

### 8. Footer expansion
- Footer should include:
  - Terms and Conditions
  - Cookies
  - Data Privacy
- These pages should be accessible from the footer only.
- These pages need real content.

### 9. Site-wide upgrade
- Keep semantic color meaning where useful, especially green.
- Upgrade the overall site quality without changing the product’s core content structure.

## Design direction
- Landing page remains the visual anchor.
- Use restrained premium composition.
- Prefer clarity, hierarchy, rhythm, and spacing over decorative effects.
- Use motion only when subtle and purposeful.
- Remove AI-slop patterns and leftover component styles.
- Fix root causes, not just surface patches.

## Working approach
- Audit first.
- Find exact file/component responsible before editing.
- Fix P0 structural problems before polish.
- Prefer component/system-level fixes over one-off hacks.