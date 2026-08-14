Exclusive picker for 2–4 short options (warranty length, message tone).

```jsx
<SegmentedControl options={['1 an', '2 ans', '3 ans', '5 ans']} value={dur} onChange={setDur} />
```

Five or more options: use a wrapping row of `Chip` instead.
