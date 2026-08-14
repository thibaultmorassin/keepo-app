The core list row. The icon tile and the remaining pill share one status colour so the row reads in a glance.

```jsx
<ItemRow name="Lave-vaisselle Bosch Serie 6" meta="Darty · sept. 2024"
         status="expiring" remaining="28 j" icon={<Dishwasher />} onClick={open} />
```

Rule of thumb: `expiring` under 45 days, `expired` past the end date, `covered` otherwise.
