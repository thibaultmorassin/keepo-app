export function App() {
  const [screen, setScreen] = React.useState('home');
  const [selId, setSelId] = React.useState('bosch');
  const [filter, setFilter] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const [addStep, setAddStep] = React.useState('choice');
  const [scan, setScan] = React.useState('idle');
  const [form, setForm] = React.useState({ name: '', price: '', date: '', store: '', cat: 'Électroménager', dur: '2 ans' });
  const [claimStep, setClaimStep] = React.useState(1);
  const [issue, setIssue] = React.useState(null);
  const [tone, setTone] = React.useState('Chaleureux');
  const [draft, setDraft] = React.useState({ since: 'Lundi 3 août', to: 'Le vendeur', desc: "Depuis lundi il s'arrête au bout de 20 minutes et affiche E24. J'ai déjà nettoyé le filtre." });

  const item = ITEMS.find((i) => i.id === selId);
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };

  if (screen === 'detail') return <ItemScreen item={item} onBack={() => setScreen('home')} onClaim={() => { setClaimStep(1); setScreen('claim'); }} />;
  if (screen === 'add') return <AddScreen step={addStep} setStep={setAddStep} scan={scan} setScan={setScan} form={form} setForm={setForm}
    onClose={() => setScreen('home')} onSave={() => { setScreen('home'); flash('Objet ajouté — rappel dans 700 jours'); }} />;
  if (screen === 'claim') return <ClaimScreen item={item} step={claimStep} setStep={setClaimStep} issue={issue} setIssue={setIssue}
    tone={tone} setTone={setTone} draft={draft} setDraft={setDraft}
    onBack={() => setScreen('detail')} onSend={() => { setScreen('home'); setClaimStep(1); flash('Message envoyé à Darty'); }} />;

  return <HomeScreen items={ITEMS} filter={filter} setFilter={setFilter} toast={toast}
    onOpen={(id) => { setSelId(id); setScreen('detail'); }}
    onAdd={() => { setAddStep('choice'); setScreen('add'); }} />;
}
