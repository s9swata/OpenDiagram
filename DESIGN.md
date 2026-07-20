---
version: "beta"
name: OpenDiagram — Vibe Diagram
description: "A playful, direct visual workspace for turning an idea into an editable Vibe Diagram."
colors:
  canvas: "#D9D9D9"
  surface: "#FFFFFF"
  ink: "#1A1A1A"
  ink-muted: "rgba(0,0,0,0.68)"
  ink-faint: "rgba(0,0,0,0.46)"
  dark-surface: "#18181B"
  on-dark: "#FFFFFF"
  accent: "#FF4A2C"
---

# Design System: OpenDiagram — Vibe Diagram

## Brand idea

OpenDiagram is the home of the Vibe Diagram: a fast, visual way to turn a rough product or system idea into an editable map. Marketing must lead with creative momentum, conversation, iteration, and the feeling of seeing an idea take shape. It should not position the product primarily as an open-source project, an AI architecture generator, a repository-analysis tool, or formal engineering documentation software.

The phrase **Vibe Diagram** is the primary category and should appear prominently in headlines, navigation, calls to action, examples, metadata, and product education. OpenDiagram is the product name; Vibe Diagram is the thing people make.

Preferred promise: describe the idea, see the map, shape it together.

Avoid institutional language such as “architecture infrastructure,” “AI-powered diagram generation,” “enterprise architecture,” and “open-source architecture workspace” unless a technical page genuinely requires it.

## Visual atmosphere

The brand should feel like a sharp creative tool: tactile, spacious, playful, and immediately understandable. Think design studio wall, whiteboard session, and polished product demo rather than developer documentation or an admin dashboard.

- Density: 4/10 — airy, with room for product media and short statements.
- Variance: 8/10 — asymmetric compositions, offset columns, deliberate empty space.
- Motion: 5/10 — quiet product loops and restrained transitions.
- Tone: confident and conversational, never corporate or breathless.

Marketing layouts should make the product itself the visual proof. Prefer real Vibe Diagram canvases, recorded editing flows, and before/after transformations over abstract AI illustrations.

## Color system

Use a restrained neutral palette. Large color washes are not part of the OpenDiagram identity.

- **Warm Gray Canvas (#D9D9D9):** default marketing atmosphere and page framing.
- **Paper White (#FFFFFF):** content surfaces, media backgrounds, and light pages.
- **Charcoal Ink (#1A1A1A):** primary text, primary buttons, footer, and high-confidence controls.
- **Muted Ink (rgba(0,0,0,0.68)):** body copy and supporting explanations.
- **Faint Ink (rgba(0,0,0,0.46)):** labels, metadata, dividers, and inactive navigation.
- **Vibe Coral Footer (#FF4A2C):** global footer background and the strongest brand field. Keep the rest of the page neutral so the footer remains the single saturated moment.
- **Vibe Coral (#FF4A2C):** the only brand accent, taken from the animated connectors in “How Vibe Diagramming Works.” Use it for Vibe Diagram highlights, active creative cues, connector-like rules, and selected calls to action.

Do not introduce blue or purple AI gradients, neon glows, multiple competing accents, or unrelated saturated backgrounds. The footer is the intentional exception: it may use the Vibe Coral field. Local diagram nodes may use varied colors when those colors explain the diagram; they do not become global brand colors.

## Typography

Use **Instrument Sans** for marketing pages and product-facing brand communication. It is direct, modern, and less generic than the old Inter-plus-cursive treatment. Use the configured monospace font for compact labels and technical metadata.

- Display: Instrument Sans, weight 500, tight tracking, sentence case.
- Section heading: Instrument Sans, weight 500–600, sentence case.
- Body: Instrument Sans, minimum 16px, line-height 1.6–1.75, maximum 65 characters per line.
- Labels: monospace, 11–12px, uppercase, restrained tracking.
- Buttons: Instrument Sans, 14–16px, weight 600.

Do not pair an italic cursive or editorial serif with ordinary sans text as a recurring motif. Do not use giant type merely to fill space; large headlines must remain readable and should carry a specific Vibe Diagram promise.

## Marketing copy

Lead with outcomes that are visible in the product:

- “Create your Vibe Diagram.”
- “Describe the idea. Shape the map.”
- “From a rough thought to an editable visual.”
- “A diagram that keeps up with the conversation.”

Use short, concrete sentences. Describe actions: prompt, map, move, connect, edit, share, refine. Avoid generic AI language such as “unlock,” “revolutionize,” “seamless,” “next-generation,” “supercharge,” and “AI-powered.”

Open source, GitHub import, repository context, and engineering documentation are supporting capabilities. They must not dominate the homepage identity or define the overall visual language.

## Layout

- Use asymmetric 30/70, 40/60, or offset 12-column compositions.
- Keep hero copy left aligned. Centered hero layouts are not the default.
- Use large, rounded product media as evidence, placed beside or below concise copy.
- Prefer sticky navigation rails, editorial dividers, and staggered content over repeated equal cards.
- Keep a maximum content width of 1200–1400px with 120px desktop gutters and 24px mobile gutters.
- Collapse to a single column below 768px with no horizontal page overflow.
- Every interactive target must be at least 44px high on touch screens.

## Components

### Buttons

Buttons are flat, solid, and quiet:

- Primary: Charcoal Ink background, white text, pill or 8–12px radius depending on context.
- Inverse: white background, Charcoal Ink text.
- Secondary: transparent or white with a 1px neutral border.
- Hover: subtle opacity or background-color change.
- Active: translate down by 1px.
- Focus: visible high-contrast outline.

Never place animated noise, grain, shader textures, moving pixels, gradients, glows, or decorative canvases inside buttons. A button should remain legible before JavaScript loads and should not require GPU work.

### Feature presentations

Do not use generic equal card grids. Present features as an anchored editorial rail with large product media, an asymmetric sequence, or a before/after flow. Non-interactive containers do not lift, scale, or glow on hover.

### Media

Product videos autoplay muted, loop, play inline, omit browser controls, and use a rounded crop. Where a clean loop matters, edit the media asset rather than seeking with JavaScript. Images must be real OpenDiagram output whenever possible.

### Footer

The footer is a full-width Charcoal field with an oversized low-contrast OpenDiagram wordmark, a centered logo tile, concise Vibe Diagram positioning, and only verified navigation destinations. Do not add placeholder links or routes that do not exist.

## Motion

Motion should clarify product behavior. Use product video, opacity, and transform-based transitions. Keep durations between 180ms and 500ms for interaction feedback. Avoid perpetual decorative motion, shader noise, parallax for its own sake, and animations that delay reading or clicking.

Respect `prefers-reduced-motion`. Never animate layout dimensions when transform or opacity can communicate the same change.

## Accessibility and responsive behavior

- Maintain WCAG AA contrast for text and controls.
- Preserve visible focus states.
- Use semantic headings and navigation landmarks.
- Never rely on color alone to communicate state.
- Avoid horizontal overflow on mobile.
- Keep body text at least 16px on marketing pages.
- Provide descriptive alt text for product screenshots and labels for silent video.

## Banned patterns

- No blue footer or large blue brand wash; use Vibe Coral for the footer instead.
- No purple/blue AI gradients or neon glow.
- No noisy, grainy, shader-based, or animated-texture buttons.
- No numbered card grids or three equal feature cards.
- No decorative hover lift on static containers.
- No recurring italic-serif plus generic-sans pairing.
- No default centered, perfectly symmetric page composition.
- No placeholder navigation links.
- No generic AI illustrations when product media exists.
- No open-source-first or AI-architecture-generator-first marketing position.
- No emojis, fake metrics, or AI copywriting clichés.

## Decision rule

When choosing between two directions, choose the one that makes a visitor understand and want to create a **Vibe Diagram** sooner. If an element communicates implementation credentials but weakens the Vibe Diagram story, move it to a supporting page or remove it.
