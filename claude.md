# CLAUDE.md

## Project rules
- Read PRD.md, REVIEW.md, and TASKS.md before making changes.
- Treat PRD.md as product truth.
- Use the landing page as the visual reference for internal pages.
- Do not invent new features without stating them first.
- Do not rewrite large sections unnecessarily.
- Prefer targeted fixes over broad redesigns.

## Design rules
- Premium, editorial, clean.
- Avoid AI-slop.
- Avoid emoji-heavy or generic SaaS styling.
- Keep typography, spacing, buttons, and section rhythm cohesive across pages.
- Maintain strong readability in both light and dark mode.

## Implementation rules
- Audit broken routes/components before editing.
- Fix P0 first, then P1, then P2.
- Preserve valid content; only fix broken, blank, inconsistent, or nonsensical content.
- Reuse existing components if they are correct.
- Before major edits, identify which files are responsible.

## Review output format
1. What is already correct
2. What is broken
3. Which files need changes
4. What will be fixed now