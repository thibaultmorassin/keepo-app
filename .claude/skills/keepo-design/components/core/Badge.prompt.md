Status pill. Never pick the colour by hand — pick the `status` and let the token decide.

```jsx
<Badge status="expiring">28 j</Badge>
<Badge status="pro" icon={<Lock />}>Pro</Badge>
```

`pro` (violet) is reserved for paid/OCR affordances and must not appear anywhere else.
