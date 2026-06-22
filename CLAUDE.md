# Presence – Project Memory

## What this is
A simple static website for NYC presence/public-speaking workshops. Single page, mobile-first, no framework or build step.

Live URL (once GitHub Pages is enabled): https://4amiracle.github.io/presence

## Tech stack
- Pure HTML/CSS/JS — no framework, no build toolchain
- Google Fonts: Playfair Display (headings) + Inter (body)
- Form backend: Google Apps Script → Google Sheets
- Hosting: GitHub Pages (main branch, root folder)

## Files
- `index.html` — single-page site (hero, pillars, two workshop cards, two sign-up forms, about, footer)
- `style.css` — CSS custom properties, mobile-first, breathing animation, form states
- `main.js` — form submission handler (fetch with `mode: 'no-cors'`)

## Workshops
1. **Finding Your Voice** — Online via Zoom, Saturday July 12, 10 AM EDT, 12 spots
2. **Ground & Voice** — In Person, Prospect Park Brooklyn, Saturday July 19, 10 AM, 15 spots

## Form backend
Both forms POST to the same Google Apps Script endpoint:
