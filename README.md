# Konarc

A responsive product website for Konarc, an Indian startup developing knee support and connected technology.

## Run locally

Requires Node.js 20.11 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://127.0.0.1:3000. Set `PORT` to use another port.

```sh
npm run check
```

## Structure

- `dist/index.html`: site content and accessible page structure
- `dist/styles.css`: responsive layout and visual styling
- `dist/script.js`: mobile navigation, keyboard-accessible product and app tabs
- `dist/assets/`: supplied Konarc logo, product image, and favicon
- `scripts/serve.mjs`: local static preview server

The `dist` directory is the complete deployable website. Serve it with any static hosting provider. There is no build step. Asset paths are relative so the website also works under a repository subpath.

## Content and feature status

The first product is the mechanical knee sleeve. TENS integration is identified as future development. The app is an interactive concept using illustrative content; it does not connect to hardware or collect medical data. No clinical outcomes, approvals, pricing, launch dates, or contact information have been invented.

The supplied image is used to introduce the product concept; final product specifications must be confirmed by Konarc before a commercial launch. Typography uses Google Fonts with system-font fallbacks. The site has no forms, analytics, or cookies.

## Verification

JavaScript syntax checks and local HTTP/asset checks. Browser checks cover responsive overflow, image loading, mobile navigation, product tabs, the sensor concept tab, and FAQ disclosure controls.
