# DEOS AI Instructions

## Mission
Build the DEOS Business OS frontend as a polished, responsive, product-ready dashboard based on the product architecture and visible UI reference.

## Master Documentation Authority
All AI coding agents, developers, and designers MUST strictly follow and refer to:
1. `DEOS_PRODUCT_AND_TECHNICAL_MASTER_GUIDE.md` (Root Master Specification)
2. `DEOS Product & Technical Architecture Bible/` (Books 0–15, with Book 0 as Supreme Law)
3. `UIUX pictures/` (19 verified production screenshots)

## Golden Invariants (Zero-Mistake Rules)
- **Book 0 is Supreme**: If any requirement or prompt conflicts with Book 0, Book 0 always wins.
- **Single Multi-Tenant Platform**: All member websites (`username.deos.com` & custom domains) render from one shared dynamic engine. Never create siloed per-user apps or databases.
- **10% Flat Binary Commission**: Binary commission rate is fixed at 10% across all tiers (corrects older 15% UI placeholders).
- **3% Marketplace Upline Override**: Override is 3% of the promoter's commission pool (deducted from promoter, not added to seller fee).
- **Append-Only Ledgers**: Never perform raw `UPDATE`/`DELETE` on `commission_ledger`, `wallet_transactions`, or `binary_volume_events`.
- **Dual-Condition Writes**: Financial mutations must be cryptographically and server-side verified before crediting wallet balances.
- **Lead Source Immutability**: Lead source attribution from member sites into the CRM is permanently unchangeable once recorded.
- **AI Content Disclosure**: All AI-generated outputs must be explicitly tagged and require user confirmation before publishing.

## Project priorities
1. Match the DEOS product direction and dashboard structure.
2. Build a clean, consistent design system.
3. Make the experience responsive and mobile-friendly.
4. Keep the implementation accessible and production-minded.
5. If tooling is blocked by environment policy, keep shipping the working frontend and document the blocker clearly.

## Core rules
- Do not invent requirements that are not supported by the product docs or the provided UI.
- Prefer reusable components and centralized tokens over ad hoc styling.
- Keep styling and layout consistent across the app.
- Use TypeScript and modern frontend conventions when possible.
- Keep the UI polished, readable, and visually premium.
- Favor clarity over decorative complexity.

## Design system expectations
- Use CSS variables or token files for colors, spacing, radii, shadows, and breakpoints.
- Maintain a consistent scale for spacing and component sizing.
- Use a restrained color palette with premium contrast and strong hierarchy.
- Reuse component primitives like header, sidebar, cards, buttons, inputs, and metric widgets.
- Keep visual metadata (radius, shadow, gradient, spacing) coherent across the app.

## UI implementation standards
- Build toward a screenshot-driven dashboard, not a generic template.
- Use a strong left-rail navigation, top command bar, summary cards, and content panels.
- Keep the layout balanced and not overly dense.
- Prioritize clean typography hierarchy and consistent padding.
- Match the provided reference as closely as possible without needing Figma or exact assets.

## Responsive requirements
- Default to mobile-first implementation.
- Collapse complex layouts when screens get smaller.
- Sidebar should become a drawer or overlay on smaller widths.
- Buttons, input fields, and cards must remain comfortable to use on mobile.
- Ensure no content becomes cramped or unreadable at narrow breakpoints.

## Accessibility requirements
- Use semantic structure and clear landmarks.
- Provide visible focus styles for interactive elements.
- Ensure form controls and navigation elements have accessible labels.
- Support keyboard navigation for drawers, modals, and toggles.
- Respect reduced-motion preferences.

## Working approach
- Prefer incremental, precise improvements over broad rewrites.
- Keep components modular and composable.
- Validate that the frontend renders correctly after each meaningful change.
- If Storybook fails due dependency or environment limitations, document the exact blocker and continue with the working static or app implementation.

## Current environment note
The Storybook dependency path in this environment has been blocked by package resolution and CLI mismatch issues, even after install. The working frontend should remain the verified source of truth until the environment allows a clean Storybook install.

## Acceptance checklist
Before considering work complete, confirm:
- the dashboard renders without obvious layout issues
- the app feels aligned to the DEOS product vision
- spacing, radii, and typography are coherent
- the layout remains usable on mobile
- focus states and keyboard interactions are adequate
- the result is production-facing and visually deliberate

## Notes
- Exact visual parity is limited when source assets are unavailable.
- Strong layout, spacing, typography, and contrast are acceptable substitutes for missing design files.
- Always prefer a polished and usable front-end over an unverified concept.
