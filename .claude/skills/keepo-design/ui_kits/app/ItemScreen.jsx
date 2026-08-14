export function ItemScreen({ item, onBack, onClaim }) {
  const status = statusOf(item);
  const headline = status === 'expired' ? 'Garantie terminée'
    : status === 'expiring' ? 'Plus que ' + item.days + ' jours'
    : 'Sous garantie · ' + Math.round(item.days / 30) + ' mois';
  const tile = {
    covered: { background: 'var(--status-covered-bg)', color: 'var(--status-covered-fg)' },
    expiring: { background: 'var(--status-expiring-bg)', color: 'var(--status-expiring-fg)' },
    expired: { background: 'var(--status-expired-bg)', color: 'var(--status-expired-fg)' },
  }[status];
  const rows = [
    ['Catégorie', item.cat], ['Prix payé', item.price], ['Magasin', item.store],
    ['N° de série', item.serial], ['Garantie', item.duration + ' · ' + item.by],
  ];

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--bg-app)' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '62px var(--gutter-screen) 120px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <IconButton label="Retour" onClick={onBack}><Icon name="chevron-left" /></IconButton>
          <IconButton label="Options"><Icon name="ellipsis" /></IconButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexShrink: 0 }}>
          <div style={{ width: 78, height: 78, flex: 'none', borderRadius: 'var(--radius-pill)', display: 'grid', placeItems: 'center', ...tile }}>
            <Icon name={item.icon} size={34} strokeWidth={2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 'var(--type-title-size)', fontWeight: 700 }}>{item.name}</h3>
            <div style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-secondary)', marginTop: 5 }}>{item.store} · {item.bought}</div>
          </div>
        </div>

        <Card tone="plain" pad="var(--pad-card-lg)">
          <CoverageBar pct={item.pct} status={status} headline={headline} note={item.duration}
            from={'Achat · ' + item.bought} to={'Fin · ' + item.expires} />
        </Card>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {[['receipt', 'Reçu', 'plain'], ['book-open', 'Notice', 'plain'], ['triangle-alert', 'Déclarer', 'claim']].map(([ic, label, kind]) => (
            <Card key={label} tone="plain" onClick={kind === 'claim' ? onClaim : undefined}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '15px 6px',
                background: kind === 'claim' ? 'var(--action-claim-bg)' : 'var(--bg-card)', boxShadow: kind === 'claim' ? 'none' : 'var(--shadow-sm)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 999, display: 'grid', placeItems: 'center',
                background: kind === 'claim' ? 'var(--action-claim-solid)' : 'var(--bg-sunken)',
                color: kind === 'claim' ? 'var(--text-on-dark)' : 'var(--brand-strong)' }}>
                <Icon name={ic} size={20} />
              </div>
              <span style={{ fontSize: 'var(--type-caption-size)', fontWeight: 600, color: kind === 'claim' ? 'var(--action-claim-fg)' : 'var(--text-primary)' }}>{label}</span>
            </Card>
          ))}
        </div>

        <Card tone="plain" pad="6px var(--pad-card-lg)">
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '13px 0',
              borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)', fontSize: 'var(--type-body-size)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
              <span style={{ fontWeight: 600, textAlign: 'right', fontFamily: k === 'N° de série' ? 'var(--font-mono)' : undefined }}>{v}</span>
            </div>
          ))}
        </Card>

        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 9 }}>Documents</div>
          <DocumentRow name={'Recu_' + item.id + '.pdf'} meta={'PDF · 214 Ko · ajouté le ' + item.bought}
            action={<Icon name="download" size={19} color="var(--brand)" />} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 32px', background: 'linear-gradient(to top, var(--bg-app) 62%, transparent)' }}>
        <Button variant="claim" size="lg" full onClick={onClaim}>Déclarer un problème</Button>
      </div>
    </div>
  );
}
