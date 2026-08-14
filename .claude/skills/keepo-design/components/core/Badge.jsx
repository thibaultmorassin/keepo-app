export function Badge({ children, status = 'covered', icon, style }) {
  const skins = {
    covered: { background: 'var(--status-covered-bg)', color: 'var(--status-covered-fg)' },
    expiring: { background: 'var(--status-expiring-bg)', color: 'var(--status-expiring-fg)' },
    expired: { background: 'var(--status-expired-bg)', color: 'var(--status-expired-fg)' },
    claim: { background: 'var(--action-claim-bg)', color: 'var(--action-claim-fg)' },
    pro: { background: 'var(--accent-pro-bg)', color: 'var(--accent-pro-fg)' },
    inverse: { background: 'rgba(252,250,246,0.18)', color: 'var(--text-on-dark)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      padding: '4px 10px', borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--type-caption-size)', fontWeight: 600, lineHeight: 1.3,
      whiteSpace: 'nowrap', ...skins[status], ...style,
    }}>
      {icon}{children}
    </span>
  );
}
