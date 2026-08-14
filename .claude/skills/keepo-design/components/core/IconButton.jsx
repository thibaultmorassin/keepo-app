export function IconButton({ children, label, variant = 'surface', size = 'md', onClick, style }) {
  const skins = {
    surface: { background: 'var(--bg-sunken)', color: 'var(--text-primary)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
    brand: { background: 'var(--brand-tint)', color: 'var(--brand-strong)' },
    inverse: { background: 'rgba(252,250,246,0.16)', color: 'var(--text-on-dark)' },
  };
  const px = size === 'sm' ? 34 : 42;
  return (
    <button
      type="button" aria-label={label} onClick={onClick}
      style={{
        width: px, height: px, flex: 'none', display: 'grid', placeItems: 'center',
        border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease-spring)',
        ...skins[variant], ...style,
      }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(var(--press-scale))'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      {children}
    </button>
  );
}
