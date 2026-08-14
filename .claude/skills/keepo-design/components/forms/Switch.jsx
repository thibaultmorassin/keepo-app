export function Switch({ checked = false, onChange, label, description, style }) {
  const toggle = (
    <span
      role="switch" aria-checked={checked} onClick={() => onChange && onChange(!checked)}
      style={{
        width: 48, height: 28, flex: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
        background: checked ? 'var(--brand)' : 'var(--paper-3)', position: 'relative',
        transition: 'background var(--dur-base) var(--ease-out)',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3, width: 22, height: 22,
        borderRadius: 'var(--radius-pill)', background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-base) var(--ease-spring)',
      }} />
    </span>
  );
  if (!label) return toggle;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', ...style }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--type-body-size)', fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-secondary)', marginTop: 2 }}>{description}</div>}
      </div>
      {toggle}
    </div>
  );
}
