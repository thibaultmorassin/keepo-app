export function HomeScreen({ items, filter, setFilter, onOpen, onAdd, toast }) {
  const FILTERS = [['Tous', null], ['Couverts', 'covered'], ['Bientôt', 'expiring'], ['Expirés', 'expired']];
  const shown = filter ? items.filter((i) => statusOf(i) === filter) : items;
  const soon = items.find((i) => statusOf(i) === 'expiring');

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--bg-app)' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '62px var(--gutter-screen) 132px', display: 'flex', flexDirection: 'column', gap: 'var(--gap-section)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)' }}>Vendredi 7 août</div>
            <h2 style={{ fontSize: 'var(--type-display-size)', letterSpacing: 'var(--type-display-ls)', fontWeight: 700, marginTop: 3 }}>Vos garanties</h2>
          </div>
          <div style={{ width: 42, height: 42, flex: 'none', borderRadius: 'var(--radius-pill)', background: 'var(--brand-tint)', color: 'var(--brand-strong)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>CF</div>
        </div>

        <Card tone="brand" size="hero" style={{ position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', right: -46, top: -46, width: 170, height: 170, borderRadius: 999, background: 'rgba(252,250,246,0.12)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)', textTransform: 'uppercase', fontWeight: 700, opacity: 0.82 }}>Valeur encore couverte</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-hero-size)', letterSpacing: 'var(--type-hero-ls)', lineHeight: 1, fontWeight: 700, marginTop: 6 }}>5 294 €</div>
            <div style={{ fontSize: 'var(--type-body-size)', opacity: 0.88, marginTop: 4 }}>sur 7 objets suivis · 1 réclamation ouverte</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <StatTile value="5" label="couverts" />
              <StatTile value="1" label="bientôt" />
              <StatTile value="1" label="expirée" />
            </div>
          </div>
        </Card>

        {soon && (
          <Card tone="plain" onClick={() => onOpen(soon.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--status-expiring-bg)', boxShadow: 'none', padding: '13px 16px 13px 13px' }}>
            <div style={{ width: 36, height: 36, flex: 'none', borderRadius: 999, background: 'var(--amber-200)', color: 'var(--status-expiring-fg)', display: 'grid', placeItems: 'center' }}>
              <Icon name="bell-ring" size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--type-body-size)', fontWeight: 600, color: 'var(--status-expiring-fg)' }}>Bosch Serie 6 — plus que {soon.days} jours</div>
              <div style={{ fontSize: 'var(--type-caption-size)', color: 'var(--amber-700)', opacity: 0.82 }}>Dernier moment pour déclarer un souci</div>
            </div>
            <Icon name="chevron-right" size={17} color="var(--status-expiring-fg)" />
          </Card>
        )}

        <div style={{ display: 'flex', gap: 7, overflow: 'auto', flexShrink: 0, margin: '0 calc(-1 * var(--gutter-screen))', padding: '0 var(--gutter-screen)' }}>
          {FILTERS.map(([label, key]) => (
            <Chip key={label} tone="neutral" selected={filter === key} onClick={() => setFilter(key)} style={{ flex: 'none' }}>{label}</Chip>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-list)', flexShrink: 0 }}>
          {shown.map((it) => (
            <ItemRow key={it.id} name={it.name} meta={it.store + ' · ' + it.bought}
              status={statusOf(it)} remaining={remainingOf(it)}
              icon={<Icon name={it.icon} size={24} />} onClick={() => onOpen(it.id)} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 20px 30px', pointerEvents: 'none', background: 'linear-gradient(to top, var(--bg-app) 58%, transparent)' }}>
        {toast && <div style={{ pointerEvents: 'auto', marginBottom: 12 }}><Toast message={toast} icon={<Icon name="check" size={17} strokeWidth={3} />} /></div>}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 7px 7px 20px', borderRadius: 'var(--radius-pill)', background: 'var(--bg-inverse)', boxShadow: 'var(--shadow-lift)' }}>
          <div style={{ flex: 1, display: 'flex', gap: 22, color: 'var(--text-on-dark)' }}>
            <Icon name="layout-grid" size={21} />
            <Icon name="shield-check" size={21} color="rgba(252,250,246,0.45)" />
            <Icon name="settings" size={21} color="rgba(252,250,246,0.45)" />
          </div>
          <Button size="sm" onClick={onAdd} icon={<Icon name="plus" size={17} strokeWidth={3} />} style={{ minHeight: 40 }}>Ajouter</Button>
        </div>
      </div>
    </div>
  );
}
