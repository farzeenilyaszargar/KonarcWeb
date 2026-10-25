# Konarc Dynamics

A one-viewport product experience built with Three.js. The entire homepage is an interactive, procedurally modelled knee brace, with restrained branding, an About overlay, and a bottom preorder button. There are no scrolling marketing sections.

## Preview

Requires Node.js 20.11 or newer.

```sh
npm run dev
```

Open http://localhost:3000. Set `PORT` to choose another port.

The site is deployable directly from `dist/`; Three.js is vendored there so the browser does not depend on a JavaScript CDN. `npm install` is only needed for development dependencies. The Three.js MIT license is included in `dist/vendor/`.

## Files

- `dist/index.html`: scene layout, About and preorder dialogs
- `dist/styles.css`: viewport sizing, responsive overlay layout, typography
- `dist/script.js`: procedural brace geometry, materials, lighting, drag/keyboard controls, fallback and dialog behavior
- `dist/vendor/`: Three.js 0.180.0 browser modules
- `dist/assets/`: existing brand assets and static fallback image
- `scripts/serve.mjs`: local preview server

Old About, Papers, Technology and Buy URLs redirect into the new experience. The prior design remains recoverable in Git history.

## Interaction

Drag to rotate the brace, or focus the scene and use the arrow keys. Home or Reset view restores the starting orientation. Ambient motion respects reduced-motion settings. Animation pauses when the document is hidden. About and preorder dialogs support keyboard navigation and Escape dismissal.

The model is an illustrative industrial-design concept built in code, not a verified CAD model or exact manufacturing geometry. Product materials, fit and mechanical specifications must be confirmed against the real product.

The preorder button displays the user-specified ₹8,999 price and the current ordering status. No payment provider is configured, so it does not collect payment or create orders.

## Validation

```sh
npm run check
```

Browser verification includes WebGL rendering, desktop/mobile sizing without overflow, drag and keyboard input, modal open/close behavior, legacy routes, reduced motion, and the WebGL-unavailable fallback. Playwright is a development dependency only.
