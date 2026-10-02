# Konarc

A dark, precision-engineering product website for Konarc, an Indian startup developing knee support and connected technology.

## Run locally

Requires Node.js 20.11 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:3000. Set `PORT` to use another port.

```sh
npm run check
```

## Pages

- `dist/index.html`: full-screen dark product photograph, product introduction and ecosystem overview
- `dist/buy.html`: mechanical sleeve priced at ₹8,999, quantity controls and calculated subtotal
- `dist/technology.html`: sensor app concept, interactive roadmap and FAQs
- `dist/about.html`: company story
- `dist/styles.css`: shared dark theme, white logo treatment and responsive layout
- `dist/script.js`: navigation, keyboard-accessible tabs, quantity controls and checkout notice
- `dist/assets/`: original supplied images, edited studio photograph and favicon
- `scripts/serve.mjs`: local static preview server
- `docs/image-edit.md`: image editing tool, final prompt and saved asset path

The `dist` directory is the complete deployable website. Serve it with any static hosting provider. There is no build step. Asset paths are relative, so the website also works under a repository subpath.

## Product and checkout status

The first product is the mechanical knee sleeve, listed at the user-supplied price of ₹8,999. TENS integration is identified as future development. The companion app is an interactive concept using illustrative data; it does not connect to hardware or collect medical data.

The purchase page computes quantity × ₹8,999. The checkout button opens a clearly labelled ordering-status notice. No order is placed and no payment is taken. Payment processing, fulfilment, sizing, availability, tax and shipping details must be established before a real checkout is enabled.

The hero uses an edited still photograph. No demo video is included. A future video can use this photo as its poster and fallback. The original supplied product photograph remains unchanged.

No clinical outcomes, approvals, launch dates, contact details or delivery promises have been invented. Typography uses Google Fonts with system-font fallbacks. The site has no analytics or cookies.

## Verification

JavaScript syntax and local asset/link checks. Browser checks cover desktop and mobile layout, image loading, navigation between pages, the roadmap and sensor tabs, quantity totals, and the checkout notice.
