export function StepBar({ total = 3, current = 1, style }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexShrink: 0, ...style }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          flex: 1, height: 5, borderRadius: 'var(--radius-pill)',
          background: i < current ? 'var(--brand)' : 'var(--paper-3)',
          transition: 'background var(--dur-base) var(--ease-out)',
        }} />
      ))}
    </div>
  );
}
