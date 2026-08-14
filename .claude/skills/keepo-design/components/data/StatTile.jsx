export function StatTile({ value, label, tone = 'onBrand', style }) {
  const skins = {
    onBrand: { background: 'rgba(252,250,246,0.17)', color: 'var(--text-on-dark)' },
    plain: { background: 'var(--bg-sunken)', color: 'var(--text-primary)' },
    covered: { background: 'var(--status-covered-bg)', color: 'var(--status-covered-fg)' },
    expiring: { background: 'var(--status-expiring-bg)', color: 'var(--status-expiring-fg)' },
    expired: { background: 'var(--status-expired-bg)', color: 'var(--status-expired-fg)' },
  };
  return (
    <div style={{
      flex: 1, borderRadius: 'var(--radius-tile)', padding: '9px 12px',
      boxSizing: 'border-box', ...skins[tone], ...style,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
        letterSpacing: '-0.02em', lineHeight: 1.1,
      }}>{value}</div>
      <div style={{ fontSize: 'var(--type-caption-size)', opacity: 0.85, marginTop: 2 }}>{label}</div>
    </div>
  );
}
