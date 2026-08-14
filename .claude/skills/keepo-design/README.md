# Keepo — drop this in your repo

Everything Claude Code needs to build the Keepo warranty app. No build step, no
dependencies — it is all static files.

## Where to put it

```
your-repo/
└── .claude/
    └── skills/
        └── Keepo-design/     ← the contents of this folder
            ├── SKILL.md
            ├── readme.md
            ├── Keepo.mdx
            ├── styles.css
            ├── tokens/
            ├── components/
            ├── guidelines/
            ├── ui_kits/
            └── wireframes/
```

`SKILL.md` is the entry point — Claude Code discovers it automatically and reads the
rest from there. You can then say _"use the Keepo-design skill"_ in any session.

If you'd rather not use the skills directory, put the folder anywhere (`design/Keepo/`
is fine) and point Claude at `Keepo.mdx` — it stands alone.

## What each piece is for

| Path                     | Read it for                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Keepo.mdx`              | **Start here.** Data model, the `statusOf` rule that drives every visual decision, all tokens, 17 component contracts, screen-by-screen build notes, French copy rules, engineering constraints, open questions |
| `readme.md`              | Why the system is the way it is — content fundamentals, visual foundations, iconography                                                                                                                         |
| `SKILL.md`               | Skill manifest for Claude Code                                                                                                                                                                                  |
| `styles.css` + `tokens/` | The token layer. Link the one file; it imports the seven                                                                                                                                                        |
| `components/`            | 17 components: `.jsx` reference implementation, `.d.ts` contract, `.prompt.md` usage notes, plus `*.card.html` live demos                                                                                       |
| `guidelines/`            | 15 specimen cards — colour, type, spacing, shape, motion, brand                                                                                                                                                 |
| `ui_kits/app/`           | The five screens as a working click-through. Open `index.html`                                                                                                                                                  |
| `wireframes/`            | The eight screen states as PNGs, 804×1640 @2x, referenced by filename from `Keepo.mdx` §4                                                                                                                       |
| `ds-card-runtime.js`     | Only needed to make the `.html` demos render standalone. Not part of the design system                                                                                                                          |

## Two things to settle before your agent guesses

1. **No logo, no brand fonts.** Nothing was drawn — the wordmark is a typographic
   placeholder and Bricolage Grotesque / Instrument Sans / DM Mono are Google Fonts
   stand-ins. Real assets are a one-file change in `tokens/fonts.css`.
2. **Icons are Lucide, loaded from CDN.** A substitution, not a decision.

The rest of the open questions are in `Keepo.mdx` §7.
