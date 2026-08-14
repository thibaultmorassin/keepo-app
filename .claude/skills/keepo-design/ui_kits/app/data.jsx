export const ITEMS = [
  { id: 'iphone', name: 'iPhone 15 Pro', icon: 'smartphone', cat: 'Électronique', store: 'Fnac Rivoli', price: '1 229 €', bought: '12 mars 2025', expires: '12 mars 2027', duration: '2 ans', days: 217, pct: 70, serial: 'F2LX9K8QPL', by: 'Constructeur' },
  { id: 'bosch', name: 'Lave-vaisselle Bosch Serie 6', icon: 'washing-machine', cat: 'Électroménager', store: 'Darty Beaugrenelle', price: '649 €', bought: '4 sept. 2024', expires: '4 sept. 2026', duration: '2 ans', days: 28, pct: 96, serial: 'SMV4HVX37E', by: 'Vendeur' },
  { id: 'mac', name: 'MacBook Air M3', icon: 'laptop', cat: 'Informatique', store: 'Apple Opéra', price: '1 499 €', bought: '18 janv. 2026', expires: '18 janv. 2027', duration: '1 an', days: 164, pct: 55, serial: 'C02ZR4TDLVDQ', by: 'Constructeur' },
  { id: 'stihl', name: 'Tondeuse Stihl RM 448', icon: 'trees', cat: 'Jardin', store: 'Leroy Merlin Ivry', price: '489 €', bought: '22 avr. 2024', expires: '22 avr. 2027', duration: '3 ans', days: 258, pct: 76, serial: 'RM448-772104', by: 'Constructeur' },
  { id: 'velo', name: 'Vélo électrique Elops 920', icon: 'bike', cat: 'Mobilité', store: 'Decathlon Madeleine', price: '1 099 €', bought: '2 juin 2025', expires: '2 juin 2027', duration: '2 ans', days: 299, pct: 59, serial: 'DEC-920-44817', by: 'Vendeur' },
  { id: 'cafe', name: "Cafetière De'Longhi Dedica", icon: 'coffee', cat: 'Électroménager', store: 'Amazon', price: '329 €', bought: '15 déc. 2025', expires: '15 déc. 2027', duration: '2 ans', days: 495, pct: 32, serial: 'EC685.M-2025', by: 'Vendeur' },
  { id: 'sony', name: 'Casque Sony WH-1000XM5', icon: 'headphones', cat: 'Audio', store: 'Boulanger Beaugrenelle', price: '379 €', bought: '11 nov. 2023', expires: '11 nov. 2025', duration: '2 ans', days: -269, pct: 100, serial: 'WH5-2023-8841', by: 'Vendeur' },
];

export function statusOf(item) {
  if (item.days < 0) return 'expired';
  return item.days <= 45 ? 'expiring' : 'covered';
}

export function remainingOf(item) {
  if (item.days < 0) return 'Expirée';
  return item.days <= 45 ? item.days + ' j' : Math.round(item.days / 30) + ' mois';
}

export const MESSAGES = {
  Chaleureux: "Bonjour,\n\nJ'ai acheté chez vous un lave-vaisselle Bosch Serie 6 le 4 septembre 2024 (ticket joint). Depuis lundi il s'arrête au bout de vingt minutes et affiche le code E24 — j'ai déjà nettoyé le filtre, sans succès.\n\nIl est encore sous garantie jusqu'au 4 septembre 2026. Comment se passe la prise en charge ? Je peux passer en magasin quand vous voulez cette semaine.\n\nMerci beaucoup, bonne journée !\nCamille Fournier — 06 12 34 56 78",
  Neutre: "Bonjour,\n\nJe vous contacte au sujet d'un lave-vaisselle Bosch Serie 6 acheté le 4 septembre 2024 dans votre magasin de Beaugrenelle (ticket en pièce jointe).\n\nL'appareil s'interrompt en cours de cycle et affiche le code d'erreur E24. Le filtre a été nettoyé, le problème persiste.\n\nLa garantie court jusqu'au 4 septembre 2026. Merci de m'indiquer la procédure de prise en charge.\n\nCordialement,\nCamille Fournier",
  Ferme: "Bonjour,\n\nLe lave-vaisselle Bosch Serie 6 acheté le 4 septembre 2024 dans votre magasin (ticket joint) présente une panne : arrêt en cours de cycle, code E24, malgré l'entretien courant.\n\nL'appareil est couvert jusqu'au 4 septembre 2026. Je vous demande une réparation ou un remplacement sans frais, conformément aux articles L.217-3 et suivants du code de la consommation.\n\nMerci de me confirmer la prise en charge sous 8 jours.\n\nCordialement,\nCamille Fournier",
};

export const ISSUES = [
  { title: 'Panne', icon: 'zap-off', options: ["S'arrête en cours de cycle", "Ne s'allume plus", 'Fuite ou infiltration', 'Bruit anormal'] },
  { title: 'Dommage accidentel', icon: 'triangle-alert', options: ['Chute ou choc', 'Dégât des eaux', 'Écran ou façade cassé'] },
  { title: 'Livraison ou pièce', icon: 'package', options: ['Pièce manquante', 'Accessoire défectueux', 'Autre'] },
];
