export function AddScreen({
  step,
  setStep,
  scan,
  setScan,
  form,
  setForm,
  onClose,
  onSave,
}) {
  if (step === "choice") {
    return (
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          overflow: "auto",
          background: "var(--bg-app)",
          padding: "62px var(--gutter-screen) 40px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-section)",
        }}
      >
        <IconButton label="Fermer" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
        <div>
          <h2
            style={{
              fontSize: "var(--type-display-size)",
              letterSpacing: "var(--type-display-ls)",
              fontWeight: 700,
            }}
          >
            Nouvel objet
          </h2>
          <p
            style={{
              fontSize: "var(--type-body-lg-size)",
              color: "var(--text-secondary)",
              margin: "8px 0 0",
              maxWidth: 280,
            }}
          >
            Le mieux, c'est de le faire dans le magasin, ticket encore en main.
          </p>
        </div>

        <Card
          tone="brand"
          size="hero"
          onClick={() => setStep("scan")}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <span
            style={{
              position: "absolute",
              right: -40,
              bottom: -50,
              width: 150,
              height: 150,
              borderRadius: 999,
              background: "rgba(252,250,246,0.13)",
            }}
          />
          <div style={{ position: "relative", display: "flex", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                flex: "none",
                borderRadius: 999,
                background: "rgba(252,250,246,0.2)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="scan-line" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Scanner le reçu
                </span>
                <Badge
                  status="inverse"
                  icon={<Icon name="lock" size={10} strokeWidth={3} />}
                >
                  Pro
                </Badge>
              </div>
              <div
                style={{
                  fontSize: "var(--type-body-size)",
                  opacity: 0.9,
                  marginTop: 5,
                }}
              >
                On lit le magasin, la date, le prix et la durée — vous n'avez
                plus qu'à vérifier.
              </div>
            </div>
          </div>
        </Card>

        <Card
          tone="plain"
          size="hero"
          onClick={() => setStep("form")}
          style={{ display: "flex", gap: 14 }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              flex: "none",
              borderRadius: 999,
              background: "var(--brand-tint)",
              color: "var(--brand-strong)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="pencil" size={23} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              Saisir à la main
            </div>
            <div
              style={{
                fontSize: "var(--type-body-size)",
                color: "var(--text-secondary)",
                marginTop: 5,
              }}
            >
              Six champs, une minute. Vous pourrez ajouter le reçu plus tard.
            </div>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "14px 16px",
            borderRadius: "var(--radius-card)",
            border: "1px dashed var(--border-strong)",
            flexShrink: 0,
          }}
        >
          <Icon name="mail" size={19} color="var(--brand)" />
          <span
            style={{
              fontSize: "var(--type-body-size)",
              color: "var(--text-secondary)",
            }}
          >
            Ou transférez le mail de confirmation à{" "}
            <b style={{ color: "var(--brand-strong)" }}>recu@Keepo.app</b>
          </span>
        </div>
      </div>
    );
  }

  if (step === "scan") {
    const cta =
      scan === "idle"
        ? "Prendre la photo"
        : scan === "busy"
          ? "Analyse en cours…"
          : "Utiliser ces informations";
    const act = () => {
      if (scan === "idle") {
        setScan("busy");
        setTimeout(() => setScan("done"), 1400);
      } else if (scan === "done") {
        setForm({
          name: "Lave-vaisselle Bosch Serie 6",
          price: "649,00",
          date: "04/09/2024",
          store: "Darty Beaugrenelle",
          cat: "Électroménager",
          dur: "2 ans",
          prefilled: true,
        });
        setScan("idle");
        setStep("form");
      }
    };
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "#17150F",
          color: "var(--paper-0)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(115deg,#26221A 0 14px,#211D16 14px 28px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 52,
            right: 52,
            top: 150,
            bottom: 250,
            background: "var(--paper-0)",
            borderRadius: 6,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
            transform: "rotate(-1.2deg)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--ink-900)",
            }}
          >
            DARTY
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-500)",
            }}
          >
            BEAUGRENELLE — 04/09/2024 15:42
          </div>
          <div
            style={{ height: 1, background: "var(--paper-3)", margin: "4px 0" }}
          />
          {[88, 64, 78, 40].map((w) => (
            <div
              key={w}
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--paper-3)",
                width: w + "%",
              }}
            />
          ))}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--ink-900)",
            }}
          >
            <span>TOTAL</span>
            <span>649,00 €</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            top: 132,
            bottom: 232,
            borderRadius: 22,
            border: "2.5px solid var(--green-500)",
          }}
        />
        {scan === "busy" && (
          <div
            style={{
              position: "absolute",
              left: 34,
              right: 34,
              top: 132,
              height: 3,
              background: "var(--green-500)",
              boxShadow: "0 0 24px 6px rgba(20,153,107,0.6)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 62,
            left: 18,
            right: 18,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            label="Fermer"
            variant="inverse"
            onClick={() => setStep("choice")}
          >
            <Icon name="x" />
          </IconButton>
          <Badge
            status="pro"
            icon={<Icon name="lock" size={11} strokeWidth={3} />}
            style={{
              background: "var(--ultra-600)",
              color: "var(--paper-0)",
              padding: "7px 13px",
            }}
          >
            Lecture auto · Pro
          </Badge>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "20px 20px 40px",
            background: "linear-gradient(to top,#17150F 62%,transparent)",
          }}
        >
          {scan === "done" && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                justifyContent: "center",
                paddingBottom: 16,
              }}
            >
              {[
                "Darty Beaugrenelle",
                "04/09/2024",
                "649,00 €",
                "Garantie 2 ans",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 999,
                    background: "rgba(20,153,107,0.28)",
                    color: "var(--green-200)",
                    fontSize: 12.5,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <Button size="lg" full onClick={act}>
            {cta}
          </Button>
        </div>
      </div>
    );
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        background: "var(--bg-app)",
      }}
    >
      <div
        style={{
          height: "100%",
          boxSizing: "border-box",
          overflow: "auto",
          padding: "62px var(--gutter-screen) 120px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <IconButton label="Retour" onClick={() => setStep("choice")}>
            <Icon name="chevron-left" />
          </IconButton>
          <h4 style={{ fontSize: "var(--type-heading-size)", fontWeight: 600 }}>
            Vérifier et enregistrer
          </h4>
        </div>

        {form.prefilled && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: "var(--radius-card)",
              background: "var(--brand-tint)",
              color: "var(--brand-strong)",
              fontSize: "var(--type-body-size)",
            }}
          >
            <Icon name="check" size={17} strokeWidth={3} /> Rempli depuis le
            reçu. Corrigez ce qui cloche.
          </div>
        )}

        <Card
          tone="plain"
          size="hero"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          <Field
            label="Nom de l'objet"
            value={form.name}
            onChange={set("name")}
            placeholder="Lave-vaisselle Bosch Serie 6"
          />
          <div>
            <div
              style={{
                fontSize: "var(--type-micro-size)",
                letterSpacing: "var(--type-micro-ls)",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              Catégorie
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                "Électroménager",
                "Électronique",
                "Informatique",
                "Jardin",
                "Mobilité",
              ].map((c) => (
                <Chip
                  key={c}
                  selected={form.cat === c}
                  onClick={() => setForm({ ...form, cat: c })}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Field
              label="Prix"
              value={form.price}
              onChange={set("price")}
              suffix="€"
              style={{ flex: 1 }}
            />
            <Field
              label="Date d'achat"
              value={form.date}
              onChange={set("date")}
              style={{ flex: 1 }}
            />
          </div>
          <Field
            label="Magasin"
            value={form.store}
            onChange={set("store")}
            placeholder="Darty Beaugrenelle"
          />
          <div>
            <div
              style={{
                fontSize: "var(--type-micro-size)",
                letterSpacing: "var(--type-micro-ls)",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              Durée de garantie
            </div>
            <SegmentedControl
              options={["1 an", "2 ans", "3 ans", "5 ans"]}
              value={form.dur}
              onChange={(d) => setForm({ ...form, dur: d })}
            />
          </div>
        </Card>

        <DocumentRow
          name="recu-darty-0409.jpg"
          meta="JPEG · 1,2 Mo"
          action={
            <span
              style={{
                fontSize: "var(--type-label-size)",
                color: "var(--brand)",
                fontWeight: 600,
              }}
            >
              Remplacer
            </span>
          }
        />

        <Card tone="tint" style={{ background: "var(--brand-tint)" }}>
          <Switch
            label="Me prévenir avant la fin"
            description="30 jours avant l'expiration"
            checked={form.remind !== false}
            onChange={(v) => setForm({ ...form, remind: v })}
          />
        </Card>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "14px 20px 32px",
          background: "linear-gradient(to top, var(--bg-app) 62%, transparent)",
        }}
      >
        <Button size="lg" full onClick={onSave}>
          Enregistrer l'objet
        </Button>
      </div>
    </div>
  );
}
