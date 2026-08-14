Pill-shaped action button; one `primary` per screen, `claim` only for starting a warranty claim.

```jsx
<Button variant="primary" size="lg" full onClick={save}>Enregistrer l'objet</Button>
```

Variants: `primary` (green, the default), `secondary` (sunken paper), `ghost` (text only), `claim` (coral — problems), `inverse` (ink). Sizes `sm | md | lg`; `lg` is the sticky bottom CTA. Always pass real French copy, never "Submit".
