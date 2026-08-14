export function ItemRow({ name, meta, status = 'covered', remaining, icon, onClick, style }) {
  const skins = {
    covered: { background: 'var(--status-covered-bg)', color: 'var(--status-covered-fg)' },
    expiring: { background: 'var(--status-expiring-bg)', color: 'var(--status-expiring-fg)' },
    expired: { background: 'var(--status-expired-bg)', color: 'var(--status-expired-fg)' },
  };
  const skin = skins[status];
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-5)',
        padding: '11px 14px 11px 11px', borderRadius: 'var(--radius-card)',
        background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : undefined, boxSizing: 'border-box', flexShrink: 0, ...style,
      }}
    >
      <div style={{
        width: 50, height: 50, flex: 'none', display: 'grid', placeItems: 'center',
        borderRadius: 'var(--radius-tile)', ...skin,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--type-heading-size)',
          fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{
          fontSize: 'var(--type-caption-size)', color: 'var(--text-secondary)', marginTop: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{meta}</div>
      </div>
      {remaining && (
        <span style={{
          flex: 'none', padding: '4px 11px', borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--type-caption-size)', fontWeight: 600, ...skin,
        }}>{remaining}</span>
      )}
    </div>
  );
}
