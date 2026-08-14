export function Card({ children, tone = 'plain', size = 'card', pad, onClick, style }) {
  const skins = {
    plain: { background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' },
    sunken: { background: 'var(--bg-sunken)' },
    brand: { background: 'var(--brand)', color: 'var(--text-on-dark)', boxShadow: 'var(--shadow-card)' },
    tint: { background: 'var(--brand-tint)', color: 'var(--brand-strong)' },
    inverse: { background: 'var(--bg-inverse)', color: 'var(--text-on-dark)', boxShadow: 'var(--shadow-card)' },
    outline: { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' },
  };
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: size === 'hero' ? 'var(--radius-hero)' : 'var(--radius-card)',
        padding: pad ?? (size === 'hero' ? 'var(--pad-card-lg)' : 'var(--pad-card)'),
        cursor: onClick ? 'pointer' : undefined, boxSizing: 'border-box', flexShrink: 0,
        ...skins[tone], ...style,
      }}
    >
      {children}
    </div>
  );
}
