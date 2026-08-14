export function DocumentRow({ name, meta, tone = 'plain', action, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
        padding: '12px 16px 12px 12px', borderRadius: 'var(--radius-card)',
        background: tone === 'tint' ? 'var(--brand-tint)' : 'var(--bg-card)',
        boxShadow: tone === 'tint' ? 'none' : 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : undefined, boxSizing: 'border-box', flexShrink: 0, ...style,
      }}
    >
      <div style={{
        width: 44, height: 56, flex: 'none', borderRadius: 10, padding: '7px 6px',
        background: 'var(--paper-0)', border: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 3, boxSizing: 'border-box',
      }}>
        <span style={{ height: 3, borderRadius: 2, background: 'var(--ink-300)', width: '70%' }} />
        <span style={{ height: 2, borderRadius: 2, background: 'var(--ink-100)' }} />
        <span style={{ height: 2, borderRadius: 2, background: 'var(--ink-100)', width: '85%' }} />
        <span style={{ height: 2, borderRadius: 2, background: 'var(--ink-100)', width: '60%' }} />
        <span style={{ marginTop: 'auto', height: 3, borderRadius: 2, background: 'var(--green-200)', width: '50%' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--type-body-size)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)', marginTop: 2 }}>{meta}</div>
      </div>
      {action}
    </div>
  );
}
