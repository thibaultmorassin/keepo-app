export function OptionRow({ label, description, selected = false, onSelect, style }) {
  return (
    <button
      type="button" role="radio" aria-checked={selected} onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)', width: '100%',
        textAlign: 'left', border: 'none', cursor: 'pointer', minHeight: 'var(--tap-min)',
        padding: '11px 14px', borderRadius: 'var(--radius-pill)', boxSizing: 'border-box', flexShrink: 0,
        background: selected ? 'var(--brand-tint)' : 'var(--bg-card)',
        color: selected ? 'var(--brand-strong)' : 'var(--text-primary)',
        transition: 'background var(--dur-fast) var(--ease-out)', ...style,
      }}
    >
      <span style={{
        width: 18, height: 18, flex: 'none', borderRadius: 'var(--radius-pill)',
        border: '2px solid ' + (selected ? 'var(--brand)' : 'var(--border-strong)'),
        background: selected ? 'var(--brand)' : 'transparent',
        boxShadow: selected ? 'inset 0 0 0 3px var(--bg-card)' : 'none',
      }} />
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 'var(--type-body-size)', fontWeight: 500 }}>{label}</span>
        {description && <span style={{ display: 'block', fontSize: 'var(--type-caption-size)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</span>}
      </span>
    </button>
  );
}
