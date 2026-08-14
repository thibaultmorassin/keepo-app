---
name: Keepo-design
description: Use this skill to generate well-branded interfaces and assets for Keepo, the warranty-keeping mobile app, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read `readme.md` (design rationale, content and visual foundations) and `Keepo.mdx`
(the build spec: data model, tokens, component contracts, screen-by-screen notes,
copy rules) before writing any code. Then explore the other files.

- Tokens: `styles.css` → `tokens/*.css`. Never hardcode a hex, radius, or duration.
- Components: `components/{core,forms,data,feedback}/` — each has `.jsx` (reference
  implementation), `.d.ts` (contract), `.prompt.md` (usage notes).
- Reference app: `ui_kits/app/index.html` — the five screens, click-through.
- Screen PNGs: `wireframes/` — referenced by filename from `Keepo.mdx` §4.

The reference implementation is React with inline styles, deliberately: it maps 1:1 to
SwiftUI/Compose/React Native without a CSS build step in the way. Read the `.jsx` files
as layout specifications, not as code to ship verbatim.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
create static HTML files for the user to view. If working on production code, copy assets
and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.

Before inventing anything the system does not cover, check `Keepo.mdx` §7 — the open
questions are there because they need a human answer, not a guess.
