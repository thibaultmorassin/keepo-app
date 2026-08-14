# Keepo app — UI kit

A click-through recreation of the warranty app, assembled **only** from
`components/` — no bespoke row, chip, bar or button markup anywhere in these files.

Open `index.html`.

## Screens

| File              | Screen             | Shows                                                                                      |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `HomeScreen.jsx`  | Coverage dashboard | Brand hero + StatTile, expiring alert, filter Chips, ItemRow list, floating tab bar, Toast |
| `ItemScreen.jsx`  | Item detail        | CoverageBar timeline, three quick actions, spec rows, DocumentRow, sticky claim CTA        |
| `AddScreen.jsx`   | Add an item        | Scan-or-type choice, camera + OCR read (Pro), pre-filled verify form                       |
| `ClaimScreen.jsx` | Claim, 3 steps     | Grouped OptionRow issue picker → description → generated message with tone switcher        |
| `App.jsx`         | Router             | Screen state, selection, toasts                                                            |
| `data.jsx`        | Fixture data       | Seven items, three message tones, issue taxonomy                                           |

## Flow to try

1. Tap the amber alert (or any row) → item detail
2. **Déclarer un problème** → pick an issue → describe → switch tone on the draft → send
3. Back on home: **Ajouter** → **Scanner le reçu** → watch the OCR read → verify → save

## Deliberately not built

Claims tracker, search, settings, onboarding and the paywall. The brief scoped five
screens; these are the five.
