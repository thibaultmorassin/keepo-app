export function EmptyState({ title, body, icon, action, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 'var(--space-5)', padding: 'var(--space-9) var(--space-7)',
      borderRadius: 'var(--radius-hero)', background: 'var(--bg-sunken)', ...style,
    }}>
      {icon && (
        <div style={{
          width: 62, height: 62, display: 'grid', placeItems: 'center',
          borderRadius: 'var(--radius-pill)', background: 'var(--bg-card)',
          color: 'var(--brand)', boxShadow: 'var(--shadow-sm)',
        }}>{icon}</div>
      )}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--type-title-size)',
          fontWeight: 700, letterSpacing: 'var(--type-title-ls)',
        }}>{title}</div>
        {body && <div style={{ fontSize: 'var(--type-body-size)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)', maxWidth: 280 }}>{body}</div>}
      </div>
      {action}
    </div>
  );
}
