export function Toast({ message, tone = 'success', icon, style }) {
  const skins = {
    success: { background: 'var(--brand)', color: 'var(--text-on-dark)' },
    neutral: { background: 'var(--bg-inverse)', color: 'var(--text-on-dark)' },
    warning: { background: 'var(--amber-600)', color: 'var(--text-on-dark)' },
    error: { background: 'var(--action-claim-solid)', color: 'var(--text-on-dark)' },
  };
  return (
    <div role="status" style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      padding: '13px 18px', borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--type-body-size)', fontWeight: 600,
      boxShadow: 'var(--shadow-lift)', ...skins[tone], ...style,
    }}>
      {icon}{message}
    </div>
  );
}
