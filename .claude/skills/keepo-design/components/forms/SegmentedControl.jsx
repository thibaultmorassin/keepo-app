export function SegmentedControl({ options, value, onChange, style }) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-2)',
      background: 'var(--bg-sunken)', borderRadius: 'var(--radius-pill)', flexShrink: 0, ...style,
    }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o} type="button" onClick={() => onChange && onChange(o)}
            style={{
              flex: 1, border: 'none', cursor: 'pointer', padding: '9px 10px',
              borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-label-size)',
              fontWeight: on ? 600 : 500, lineHeight: 1.2,
              background: on ? 'var(--bg-card)' : 'transparent',
              color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: on ? 'var(--shadow-sm)' : 'none',
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
