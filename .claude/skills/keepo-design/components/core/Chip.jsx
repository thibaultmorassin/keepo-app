export function Chip({ children, selected = false, tone = 'brand', onClick, style }) {
  const on = tone === 'neutral'
    ? { background: 'var(--bg-inverse)', color: 'var(--text-on-dark)' }
    : { background: 'var(--brand)', color: 'var(--text-on-dark)' };
  return (
    <button
      type="button" onClick={onClick} aria-pressed={selected}
      style={{
        padding: '9px 15px', borderRadius: 'var(--radius-chip)', cursor: 'pointer',
        fontSize: 'var(--type-label-size)', fontWeight: 500, lineHeight: 1.2,
        border: selected ? '1px solid transparent' : '1px solid var(--border-subtle)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        ...(selected ? on : { background: 'transparent', color: 'var(--text-secondary)' }),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
