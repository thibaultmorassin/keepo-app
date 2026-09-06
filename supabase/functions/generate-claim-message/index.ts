// Generates the three claim-message tones (Chaleureux / Neutre / Ferme) from a
// free-tier open-weight model on Groq. Zero guaranteed cost by design: the
// client always has a deterministic local fallback (see `utils/claims.ts`'s
// `buildAllFallbackMessages`) and treats ANY non-2xx response, network error,
// or malformed body from this function identically — fall back silently, no
// error surfaced to the user. This function only needs to succeed sometimes.

const GROQ_MODEL = "llama-3.1-8b-instant";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const TONES = ["Chaleureux", "Neutre", "Ferme"] as const;

type RequestBody = {
  itemTitle: string;
  store: string | null;
  purchaseDate: string;
  warrantyEndDate: string | null;
  issueGroup: string;
  issue: string;
  since: string;
  description: string;
  recipient: string;
};

const SYSTEM_PROMPT = `Tu rédiges des réclamations pour une app française de suivi de garanties (Keepo). Règles de style, à respecter strictement :
- Vouvoiement, français correct, ton naturel — jamais de robotisation ni d'emoji.
- Phrase en minuscule sauf début de phrase (pas de Title Case).
- Dates au format français ("4 septembre 2024"), jamais de format ISO.
- Chaque message DOIT mentionner : le nom du produit, la date d'achat, le magasin (si fourni), le symptôme décrit, la date de fin de garantie (si fournie), le fait qu'un ticket/reçu est joint, et se terminer par une signature (nom, puis téléphone si fourni).
- Le ton "Ferme" est le SEUL des trois à citer "les articles L.217-3 et suivants du code de la consommation" et à demander une réponse sous 8 jours. Les tons "Chaleureux" et "Neutre" ne citent jamais de texte de loi.
- "Chaleureux" : amical, chaleureux, quelques exclamations mesurées.
- "Neutre" : factuel, poli, sans emphase.
- "Ferme" : direct, cite le droit, fixe un délai.

Réponds UNIQUEMENT avec un objet JSON strict de la forme {"Chaleureux": "...", "Neutre": "...", "Ferme": "..."} — pas de texte avant ou après, pas de markdown.`;

function buildUserPrompt(body: RequestBody): string {
  const lines = [
    `Produit : ${body.itemTitle}`,
    `Magasin : ${body.store ?? "non renseigné"}`,
    `Date d'achat (ISO) : ${body.purchaseDate}`,
    `Fin de garantie (ISO) : ${body.warrantyEndDate ?? "non renseignée"}`,
    `Catégorie du problème : ${body.issueGroup}`,
    `Symptôme précis : ${body.issue}`,
    `Depuis quand : ${body.since || "non précisé"}`,
    `Description libre : ${body.description || "aucune"}`,
    `Destinataire : ${body.recipient}`,
  ];
  return lines.join("\n");
}

function isValidMessages(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  return TONES.every(
    (tone) => typeof (value as Record<string, unknown>)[tone] === "string",
  );
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
    });
  }

  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "not configured" }), {
      status: 500,
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid body" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(body) },
        ],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "upstream error" }), {
        status: 502,
      });
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return new Response(JSON.stringify({ error: "empty completion" }), {
        status: 502,
      });
    }

    const parsed = JSON.parse(content);
    if (!isValidMessages(parsed)) {
      return new Response(JSON.stringify({ error: "malformed completion" }), {
        status: 502,
      });
    }

    return new Response(JSON.stringify({ messages: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "generation failed" }), {
      status: 502,
    });
  }
});
