export function ClaimScreen({ item, step, setStep, issue, setIssue, tone, setTone, draft, setDraft, onBack, onSend }) {
  const back = () => (step > 1 ? setStep(step - 1) : onBack());
  const next = () => {
    if (step === 1 && !issue) return;
    if (step < 3) return setStep(step + 1);
    onSend();
  };
  const cta = step === 1 ? 'Continuer' : step === 2 ? 'Générer le message' : 'Envoyer avec le reçu';

  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--bg-app)' }}>
      <div style={{ padding: '62px var(--gutter-screen) 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconButton label="Retour" onClick={back}><Icon name="chevron-left" /></IconButton>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)' }}>Réclamation · étape {step} sur 3</div>
            <div style={{ fontSize: 'var(--type-body-size)', fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
          </div>
        </div>
        <StepBar total={3} current={step} style={{ marginTop: 14 }} />
      </div>

      <div style={{ position: 'absolute', top: 132, bottom: 0, left: 0, right: 0, overflow: 'auto', padding: '10px var(--gutter-screen) 130px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {step === 1 && (
          <React.Fragment>
            <h3 style={{ fontSize: 'var(--type-title-size)', fontWeight: 700 }}>Qu'est-ce qui ne va pas ?</h3>
            {ISSUES.map((g) => (
              <Card key={g.title} tone="sunken" pad="var(--pad-card)">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--bg-card)', color: 'var(--brand-strong)', display: 'grid', placeItems: 'center' }}>
                    <Icon name={g.icon} size={16} strokeWidth={2.6} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-heading-size)', fontWeight: 600 }}>{g.title}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                  {g.options.map((o) => (
                    <OptionRow key={o} label={o} selected={issue === o} onSelect={() => setIssue(o)} />
                  ))}
                </div>
              </Card>
            ))}
          </React.Fragment>
        )}

        {step === 2 && (
          <React.Fragment>
            <h3 style={{ fontSize: 'var(--type-title-size)', fontWeight: 700 }}>Racontez-nous</h3>
            <Badge status="covered" icon={<Icon name="check" size={13} strokeWidth={3} />} style={{ alignSelf: 'flex-start', padding: '7px 14px', fontSize: 'var(--type-label-size)' }}>{issue}</Badge>
            <Card tone="plain" size="hero" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <Field label="Depuis quand ?" value={draft.since} onChange={(e) => setDraft({ ...draft, since: e.target.value })} />
              <Field label="Décrivez le problème" multiline value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} />
              <div>
                <div style={{ fontSize: 'var(--type-micro-size)', letterSpacing: 'var(--type-micro-ls)', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Interlocuteur</div>
                <SegmentedControl options={['Le vendeur', 'Le fabricant']} value={draft.to} onChange={(v) => setDraft({ ...draft, to: v })} />
              </div>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 115, height: 115, flex: 'none', boxSizing: 'border-box', borderRadius: 'var(--radius-card)', border: '1px dashed var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                <Icon name="plus" size={22} />
              </div>
              {['photo du code E24', "photo de l'appareil"].map((t) => (
                <div key={t} style={{ width: 115, height: 115, flex: 'none', boxSizing: 'border-box', overflow: 'hidden', borderRadius: 'var(--radius-card)', background: 'repeating-linear-gradient(135deg,var(--paper-2) 0 9px,var(--paper-3) 9px 18px)', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{t}</div>
              ))}
            </div>
          </React.Fragment>
        )}

        {step === 3 && (
          <React.Fragment>
            <h3 style={{ fontSize: 'var(--type-title-size)', fontWeight: 700 }}>C'est prêt à partir</h3>
            <SegmentedControl options={['Chaleureux', 'Neutre', 'Ferme']} value={tone} onChange={setTone} />
            <Card tone="plain" size="hero">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                <span>À : sav.beaugrenelle@darty.example</span><span>Garantie</span>
              </div>
              <div style={{ fontSize: 'var(--type-body-size)', lineHeight: 1.65, whiteSpace: 'pre-line', paddingTop: 14 }}>{MESSAGES[tone]}</div>
            </Card>
            <DocumentRow tone="tint" name="Recu_Bosch_Serie6.pdf" meta="joint automatiquement"
              action={<Icon name="paperclip" size={18} color="var(--brand-strong)" />} />
            <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 'var(--type-caption-size)', color: 'var(--text-secondary)', padding: '0 4px' }}>
              <Icon name="info" size={15} />
              <span>On garde une copie dans l'app et on vous relance dans 7 jours sans réponse.</span>
            </div>
          </React.Fragment>
        )}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 32px', background: 'linear-gradient(to top, var(--bg-app) 62%, transparent)', display: 'flex', gap: 10 }}>
        {step === 3 && <IconButton label="Copier" style={{ width: 52, height: 52 }}><Icon name="copy" size={20} /></IconButton>}
        <Button variant={step === 3 ? 'claim' : 'primary'} size="lg" full disabled={step === 1 && !issue} onClick={next}>{cta}</Button>
      </div>
    </div>
  );
}
