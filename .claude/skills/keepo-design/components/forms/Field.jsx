export function Field({ label, value, onChange, placeholder, hint, multiline = false, suffix, style }) {
  const box = {
    width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-subtle)',
    background: 'var(--bg-card)', borderRadius: 'var(--radius-input)',
    padding: '12px 14px', fontFamily: 'var(--font-sans)', fontSize: 'var(--type-body-size)',
    color: 'var(--text-primary)', outline: 'none', resize: 'vertical',
  };
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', ...style }}>
      <span style={{
        fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)',
        textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)',
      }}>{label}</span>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {multiline
          ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={{ ...box, borderRadius: 'var(--radius-tile)' }} />
          : <input value={value} onChange={onChange} placeholder={placeholder} style={{ ...box, paddingRight: suffix ? 48 : undefined }} />}
        {suffix && <span style={{
          position: 'absolute', right: 14, fontFamily: 'var(--font-mono)',
          fontSize: 'var(--type-mono-size)', color: 'var(--text-muted)',
        }}>{suffix}</span>}
      </div>
      {hint && <span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}
