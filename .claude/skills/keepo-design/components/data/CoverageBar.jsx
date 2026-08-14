export function CoverageBar({ pct = 0, status = 'covered', headline, note, from, to, style }) {
  const bar = {
    covered: 'var(--status-covered-bar)',
    expiring: 'var(--status-expiring-bar)',
    expired: 'var(--status-expired-bar)',
  }[status];
  const fg = {
    covered: 'var(--status-covered-fg)',
    expiring: 'var(--status-expiring-fg)',
    expired: 'var(--status-expired-fg)',
  }[status];
  return (
    <div style={style}>
      {(headline || note) && (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--type-heading-size)',
            fontWeight: 700, letterSpacing: '-0.01em', color: fg,
          }}>{headline}</span>
          <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>{note}</span>
        </div>
      )}
      <div style={{
        height: 9, borderRadius: 'var(--radius-pill)', background: 'var(--bg-sunken)',
        marginTop: 'var(--space-5)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: Math.max(0, Math.min(100, pct)) + '%',
          background: bar, borderRadius: 'var(--radius-pill)',
          transition: 'width var(--dur-slow) var(--ease-out)',
        }} />
      </div>
      {(from || to) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)',
        }}>
          <span>{from}</span><span>{to}</span>
        </div>
      )}
    </div>
  );
}
