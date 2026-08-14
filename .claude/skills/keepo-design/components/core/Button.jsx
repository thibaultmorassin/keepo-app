export function Button({
  children, variant = 'primary', size = 'md', icon, iconAfter,
  full = false, disabled = false, onClick, style,
}) {
  const skins = {
    primary: { background: 'var(--brand)', color: 'var(--text-on-dark)', boxShadow: 'var(--shadow-card)' },
    secondary: { background: 'var(--bg-sunken)', color: 'var(--text-primary)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
    claim: { background: 'var(--action-claim-solid)', color: 'var(--text-on-dark)', boxShadow: 'var(--shadow-card)' },
    inverse: { background: 'var(--bg-inverse)', color: 'var(--text-on-dark)' },
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 'var(--type-label-size)' },
    md: { padding: '12px 20px', fontSize: 'var(--type-body-size)' },
    lg: { padding: '15px 24px', fontSize: 'var(--type-body-lg-size)' },
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)',
        minHeight: 'var(--tap-min)', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-display)',
        fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1,
        transition: 'transform var(--dur-fast) var(--ease-spring), filter var(--dur-fast) var(--ease-out)',
        opacity: disabled ? 0.42 : 1, boxSizing: 'border-box',
        ...skins[variant], ...sizes[size], ...style,
      }}
      onPointerDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(var(--press-scale))'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      {icon}{children}{iconAfter}
    </button>
  );
}
