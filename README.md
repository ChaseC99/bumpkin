# Bump-kin Set Latte

A mobile-first Halloween grass volleyball tournament site, built with Astro, React, and TypeScript. Uses system fonts, local artwork, and a fixed bottom tab bar. This first version uses fictional teams and sample results; no database, credentials, or live score editing is required.

## Develop

Requires Node.js 22.23.4+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the localhost URL printed by Astro. Routes:

- `/` — tournament details, pairing format, and packing list
- `/schedule/` — match cards, player/team search, team filtering, and stage filters
- `/standings/` — pool filters, calculated standings, and expandable rosters

```sh
npm test       # Standings, filtering, and fixture consistency
npm run build # Astro/TypeScript checks and static build
npm run preview
```

The static output is written to `dist/`.

## Add to a phone's home screen

The shared layout links `public/manifest.webmanifest` on all three pages. It sets the app name, launch URL, standalone display mode, and colors. `public/icons/` includes 192px and 512px app icons, a padded maskable Android icon, and a 180px Apple touch icon. The source SVGs are included alongside the PNG exports.

Once the site is hosted over HTTPS, open it on your phone:

- iPhone: Safari → Share → Add to Home Screen (enable Open as Web App if shown).
- Android: Chrome → menu → Add to Home screen / Install app.

The installed app opens without the browser toolbar, with all three pages in its scope. Safe-area spacing keeps content and the bottom tabs clear of the notch and home indicator. Installation is browser-dependent; confirm it on physical iOS and Android devices after hosting. This local version has not been deployed. A phone cannot use the Mac's `127.0.0.1` address; phone installation testing needs an HTTPS preview or deployment.

This setup does not cache pages for offline use. A service worker is not required for installation in modern browsers. See [MDN's installability guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) and [web.dev's manifest guide](https://web.dev/learn/pwa/web-app-manifest).

## Update the event

`src/data/tournament.ts` contains event constants, typed teams, and sample matches. `getTournamentData()` is the data boundary for the site. The illustrative configuration has three pools of three teams and three courts; these are not confirmed event logistics. The playoff bracket, match scoring rules, and official tiebreakers remain undecided.

Standings derive only from completed pool matches, ordered by wins and then point difference. Equal records share a rank. Upcoming games and playoff results do not change the pool table. Demo results are labeled on both interactive pages.

Schedule filters are reflected in the URL so filtered links can be shared and reloaded. Search matches team names and player names. Every roster in this build is fictional.

## Future Supabase integration

Replace the sample data adapter with Supabase reads using the same `Team`, `Match`, and `TournamentData` contracts (and change the demo mode contract when real data is added). For updates during the event, load/refresh data on the client or add an Astro server adapter rather than relying on build-time snapshots. An organizer score-entry screen should use authenticated, authorized writes with database row-level security. Keep service-role keys on the server. No Supabase dependency or pretend login is included in this version.

## Design and assets

The site uses native system fonts, a warm Halloween palette, and a fixed bottom tab bar with safe-area spacing. Page headers pair a title with a small illustration; copy stays focused on tournament information.

UI icons are inline SVG in [`src/components/Icon.tsx`](src/components/Icon.tsx). The Schedule tab uses our own three-panel volleyball drawing, defined under `ball`. It has no external icon library dependency or third-party icon attribution. Home screen PNGs are exported from the original SVG sources in [`public/icons/`](public/icons/).
