// ── Partenaires mockés (carte) ─────────────────────────────────
export const MOCK_PARTENAIRES = [
  { id: 'p1', prenom: 'Diane',    nom: 'Mbaye',    ville: 'Longueuil',      lat: 45.5243, lng: -73.4934, note: 4.9, specialites: ['Tresses', 'Knotless'], disponible: true,  photo: null, code: 'KADIO-DIANE-001' },
  { id: 'p2', prenom: 'Fatou',    nom: 'Konaté',   ville: 'Saint-Hubert',   lat: 45.5005, lng: -73.4189, note: 4.7, specialites: ['Locs', 'Knotless'],   disponible: true,  photo: null, code: 'KADIO-FATOU-002' },
  { id: 'p3', prenom: 'Sandra',   nom: 'Pierre',   ville: 'Montréal-Nord',  lat: 45.5991, lng: -73.6199, note: 4.8, specialites: ['Tresses', 'Coupes'],   disponible: false, photo: null, code: 'KADIO-SANDRA-003' },
  { id: 'p4', prenom: 'Aminata',  nom: 'Coulibaly',ville: 'Laval',          lat: 45.6066, lng: -73.7124, note: 4.6, specialites: ['Barbier', 'Coupes'],   disponible: true,  photo: null, code: 'KADIO-AMINA-004' },
  { id: 'p5', prenom: 'Rachel',   nom: 'Ndoye',    ville: 'Brossard',       lat: 45.4579, lng: -73.4584, note: 5.0, specialites: ['Knotless', 'Tresses'], disponible: true,  photo: null, code: 'KADIO-RACHEL-005' },
  { id: 'p6', prenom: 'Marcus',   nom: 'Durand',   ville: 'Longueuil',      lat: 45.5405, lng: -73.4960, note: 4.5, specialites: ['Barbier', 'Locs'],     disponible: true,  photo: null, code: 'KADIO-MARCUS-006' },
]

// ── Articles blog ──────────────────────────────────────────────
export const MOCK_ARTICLES = [
  {
    slug: 'tresses-knotless-tendance-2026',
    titre: 'Pourquoi les tresses knotless dominent en 2026',
    categorie: 'Tutoriels',
    date: '2026-03-15',
    extrait: `Les knotless braids s'imposent comme la technique la plus demandée chez nos partenaires. On vous explique pourquoi et comment choisir la bonne coiffeuse.`,
    contenu: `Les knotless braids représentent une évolution majeure dans le monde de la coiffure afro. Contrairement aux tresses classiques, elles commencent par vos propres cheveux avant d'incorporer les extensions, ce qui réduit considérablement la tension sur le cuir chevelu.\n\nNos partenaires certifiés maîtrisent cette technique et peuvent vous conseiller sur la longueur, l'épaisseur et le style qui vous convient. Réservez directement via l'app Kadio.\n\nLes knotless permettent aussi une durée de port plus longue — jusqu'à 8 semaines avec un entretien minimal — et causent moins de casse à la dépose. Un investissement beauté qui vaut vraiment le détour.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['tresses', 'knotless', 'tendances'],
    statut: 'publie',
    vues: 742,
    partages: 38,
  },
  {
    slug: 'devenir-partenaire-kadio-2026',
    titre: `Rejoindre Kadio : témoignage d'une partenaire certifiée`,
    categorie: 'Partenaires',
    date: '2026-03-10',
    extrait: `Diane Mbaye, coiffeuse certifiée à Longueuil depuis 8 mois, nous raconte comment Kadio a transformé son activité indépendante.`,
    contenu: `"Avant Kadio, je gérais mes rendez-vous par WhatsApp et j'oubliais des clients. Maintenant tout est centralisé." Diane, 32 ans, est coiffeuse à domicile depuis 5 ans.\n\nDepuis qu'elle a rejoint le réseau Kadio il y a 8 mois, elle a augmenté son chiffre d'affaires de 40% et n'a plus à gérer les paiements ou les rappels. "Le système s'occupe de tout. Moi je me concentre sur mes clientes."\n\nDiane propose aujourd'hui des knotless, des cornrows et des tresses classiques. Elle accepte uniquement les réservations via Kadio pour garder un agenda propre.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['partenaire', 'témoignage', 'succès'],
    statut: 'publie',
    vues: 521,
    partages: 24,
  },
  {
    slug: 'soins-locs-guide-complet',
    titre: 'Guide complet : entretien des locs en 2026',
    categorie: 'Conseils',
    date: '2026-03-05',
    extrait: `Resserrage, rétraction, hydratation — tout ce qu'il faut savoir pour des locs saines et bien entretenues avec nos partenaires spécialisés.`,
    contenu: `Les locs demandent un entretien régulier pour rester belles et saines. Le resserrage tous les 4 à 6 semaines est recommandé, surtout en phase de démarrage.\n\nNos partenaires spécialisés en locs proposent des forfaits d'entretien adaptés à tous les budgets. Consultez leurs profils sur la carte Kadio pour trouver le bon match selon votre ville et disponibilités.\n\nL'hydratation est souvent négligée : un spray eau/aloe vera quotidien et une huile légère appliquée hebdomadairement font toute la différence sur la brillance et la santé du cheveu.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['locs', 'entretien', 'conseils'],
    statut: 'publie',
    vues: 890,
    partages: 57,
  },
  {
    slug: 'evenement-kadio-expo-montreal-2026',
    titre: `Kadio présent à l'Expo Beauté Afro Montréal`,
    categorie: 'Événements',
    date: '2026-02-28',
    extrait: `Retrouvez-nous le 12 avril à l'Expo Beauté Afro de Montréal. Démonstrations live, rencontres partenaires et offres spéciales sur place.`,
    contenu: `Nous sommes fiers d'être partenaires officiels de l'Expo Beauté Afro Montréal 2026. Venez nous rencontrer le 12 avril au Palais des Congrès, Hall C.\n\nAu programme : démonstrations de techniques de tressage knotless, rencontres avec nos partenaires certifiés, et offres exclusives pour les nouvelles inscriptions. L'entrée est gratuite.\n\nUn concours de coiffure afro sera organisé sur place avec des prix offerts par Kadio. Inscrivez-vous en ligne avant le 5 avril pour participer.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['événement', 'montreal', 'expo'],
    statut: 'publie',
    vues: 415,
    partages: 19,
  },
  {
    slug: 'communaute-afro-coiffure-longueuil',
    titre: `La communauté afro de Longueuil mérite mieux`,
    categorie: 'Communauté',
    date: '2026-02-20',
    extrait: `Pourquoi Kadio a choisi Longueuil comme ville de lancement et comment nous construisons un réseau ancré dans la communauté.`,
    contenu: `Longueuil compte une communauté afro et caribéenne dynamique et sous-desservie en termes de coiffure professionnelle de qualité. C'est ce constat qui a motivé la création de Kadio.\n\nAujourd'hui, 6 partenaires couvrent Longueuil et ses environs. Notre objectif pour 2026 : 20 partenaires certifiés dans la grande région de Montréal.\n\nChaque partenaire est formé, certifié et évalué par la communauté. Pas de compromis sur la qualité — c'est notre engagement fondateur.`,
    image: null,
    auteur: 'Othi Kadio',
    tags: ['communauté', 'longueuil', 'vision'],
    statut: 'publie',
    vues: 683,
    partages: 44,
  },
  {
    slug: 'barbier-afro-montreal-top-5',
    titre: 'Top 5 des coupes tendance pour hommes afros en 2026',
    categorie: 'Tutoriels',
    date: '2026-02-14',
    extrait: `Du fade au texturizer, les coupes qui font fureur chez nos partenaires barbiers certifiés à Montréal et Longueuil.`,
    contenu: `2026 voit le retour en force du taper fade et des coupes à base de texturizer chez les hommes afros. Nos partenaires barbiers certifiés maîtrisent ces techniques et proposent des consultations gratuites avant chaque coupe.\n\nRetrouvez-les sur la carte Kadio et filtrez par spécialité "Barbier" pour trouver le bon professionnel près de chez vous.\n\nLes 5 coupes les plus demandées cette saison : taper fade, drop fade, temp fade, coupe afro texturisée et dreadlock taper. Chaque barbier Kadio peut vous conseiller en fonction de la texture de vos cheveux.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['barbier', 'coupes', 'hommes'],
    statut: 'publie',
    vues: 358,
    partages: 21,
  },
  {
    slug: 'coloration-naturelle-cheveux-afros-2026',
    titre: 'Coloration naturelle sur cheveux afros : tout savoir avant de se lancer',
    categorie: 'Conseils',
    date: '2026-03-22',
    extrait: `Henné, indigo, écorces de noix — les alternatives naturelles à la coloration chimique font un retour fort. Nos partenaires vous guident.`,
    contenu: `La coloration naturelle connaît un renouveau majeur dans la communauté afro. Le henné, combiné à l'indigo, permet d'obtenir des nuances allant du roux au brun profond sans endommager la fibre capillaire.\n\nNos partenaires formés en colorimétrie naturelle peuvent réaliser un test de mèche avant toute intervention. C'est une étape indispensable pour prévoir le résultat final sur votre type de cheveux.\n\nAttention : la coloration naturelle demande plus de temps de pose et plusieurs applications pour obtenir la teinte souhaitée. Comptez 2 à 3 séances espacées de 2 semaines.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['coloration', 'naturel', 'conseils', 'cheveux'],
    statut: 'brouillon',
    vues: 0,
    partages: 0,
  },
  {
    slug: 'lancer-activite-kadio-30-jours',
    titre: `Comment j'ai lancé mon activité avec Kadio en 30 jours`,
    categorie: 'Partenaires',
    date: '2026-03-20',
    extrait: `Rachel Ndoye, nouvelle partenaire à Brossard, détaille pas à pas son onboarding Kadio : de la certification à son premier client.`,
    contenu: `"J'avais peur que ce soit compliqué. En réalité, l'onboarding Kadio m'a pris exactement 3 heures." Rachel, 27 ans, vient de finir sa formation et a reçu son premier client Kadio après seulement 12 jours.\n\nLe processus : candidature en ligne → appel de validation → formation certifiante (présentielle, 1 journée) → activation du profil → premiers clients via la plateforme.\n\nRachel précise : "Ce que j'apprécie le plus, c'est que Kadio gère les paiements. Je n'ai plus à parler d'argent avec mes clientes. C'est beaucoup plus confortable."`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['partenaire', 'onboarding', 'témoignage'],
    statut: 'brouillon',
    vues: 0,
    partages: 0,
  },
  {
    slug: '5-erreurs-installation-locs',
    titre: '5 erreurs à éviter lors de l\'installation de locs',
    categorie: 'Tutoriels',
    date: '2026-03-18',
    extrait: `Sections trop petites, manque d'hydratation, mauvais produits de démarrage — les pièges classiques que nos experts vous aident à éviter.`,
    contenu: `L'installation de locs est une décision à long terme qui demande une préparation sérieuse. Voici les 5 erreurs les plus fréquentes que nos partenaires observent chez les nouveaux clients.\n\n1. Des sections trop petites : cela crée des locs trop fines qui cassent facilement. Votre partenaire Kadio vous conseillera la taille idéale selon vos objectifs.\n\n2. Négliger l'hydratation du cuir chevelu pendant le démarrage : un spray aloe vera quotidien est indispensable les 3 premiers mois.\n\n3. Utiliser des produits avec trop de cire : la cire s'accumule et étouffe le cheveu. Préférez des produits spécialement formulés pour locs.\n\n4. Relancer trop tôt : respectez le délai de 4 à 6 semaines entre chaque resserrage pour laisser les locs se former naturellement.\n\n5. Ignorer la phase de rétraction : les locs raccourcissent avant de s'allonger. C'est normal et temporaire — ne paniquez pas.`,
    image: null,
    auteur: 'Équipe Kadio',
    tags: ['locs', 'installation', 'erreurs', 'débutant'],
    statut: 'brouillon',
    vues: 0,
    partages: 0,
  },
]

// ── Commentaires blog ───────────────────────────────────────────
export const MOCK_COMMENTS = {
  'tresses-knotless-tendance-2026': [
    { id: 'c1', prenom: 'Mariama', date: '2026-03-16', message: `Super article ! J'avais justement des questions sur les knotless vs les classiques. Le point sur la tension au cuir chevelu est très important.` },
    { id: 'c2', prenom: 'Sandra', date: '2026-03-17', message: `Ma coiffeuse Kadio m'a fait des knotless la semaine dernière. Vraiment aucune douleur comparé à d'habitude. Je recommande !` },
    { id: 'c3', prenom: 'Inès', date: '2026-03-19', message: `Combien de temps tiennent les knotless en moyenne ? Je prévois un voyage et je veux être tranquille.` },
  ],
  'devenir-partenaire-kadio-2026': [
    { id: 'c4', prenom: 'Fatou', date: '2026-03-11', message: `Diane est une excellente coiffeuse ! Je suis une de ses clientes. Vraiment ravie de la voir se développer avec Kadio.` },
    { id: 'c5', prenom: 'Marcus', date: '2026-03-12', message: `Merci pour ce témoignage. Je suis coiffeur et je cherche justement une plateforme comme ça. Comment postuler ?` },
  ],
  'soins-locs-guide-complet': [
    { id: 'c6', prenom: 'Rachel', date: '2026-03-06', message: `Le spray aloe vera, j'en entends parler partout mais je ne savais pas comment l'utiliser. Merci pour les précisions sur la fréquence !` },
    { id: 'c7', prenom: 'Jean-Baptiste', date: '2026-03-07', message: `Mes locs ont 2 ans et je n'hydratais pas assez. Depuis que j'ai commencé l'huile hebdomadaire, la différence est visible. Bonne info.` },
    { id: 'c8', prenom: 'Christelle', date: '2026-03-09', message: `Article très complet. J'aurais aimé avoir ça quand j'ai commencé mes locs il y a 3 ans. Je partage à toutes mes amies !` },
  ],
  'evenement-kadio-expo-montreal-2026': [
    { id: 'c9', prenom: 'Aminata', date: '2026-03-01', message: `Je serai là ! Est-ce qu'il y aura des offres spéciales pour s'abonner sur place ?` },
    { id: 'c10', prenom: 'Léa', date: '2026-03-03', message: `Super nouvelle ! Le Palais des Congrès est accessible en métro. Je viens avec mes amies.` },
  ],
  'communaute-afro-coiffure-longueuil': [
    { id: 'c11', prenom: 'Mariama', date: '2026-02-21', message: `En tant que résidente de Longueuil depuis 10 ans, je confirme qu'il y avait un vrai manque. Kadio répond exactement à ce besoin.` },
    { id: 'c12', prenom: 'Patrick', date: '2026-02-23', message: `Beau projet. Vous prévoyez quand d'étendre à Laval ? Ma femme cherche désespérément une bonne coiffeuse afro là-bas.` },
    { id: 'c13', prenom: 'Sophie', date: '2026-02-25', message: `Merci Othi pour cet article sincère. On sent que c'est un projet de cœur autant que de business.` },
  ],
  'barbier-afro-montreal-top-5': [
    { id: 'c14', prenom: 'Kevin', date: '2026-02-15', message: `Le temp fade c'est ma coupe depuis 2 ans. Mon barbier Kadio la maîtrise parfaitement. Abonnement mensuel fortement recommandé.` },
    { id: 'c15', prenom: 'David', date: '2026-02-17', message: `Vous pouvez faire un article sur les soins barbe ? J'ai du mal à trouver des barbiers qui maîtrisent les barbes épaisses.` },
  ],
}

// ── Témoignages ────────────────────────────────────────────────
export const TEMOIGNAGES = [
  { nom: 'Mariama S.',    ville: 'Longueuil', note: 5, texte: `Enfin une app qui comprend nos cheveux ! J'ai trouvé ma coiffeuse knotless en 2 minutes. Elle est venue chez moi un dimanche. Parfait.` },
  { nom: 'Jean-Baptiste K.', ville: 'Montréal', note: 5, texte: `Mon barbier Kadio me connaît maintenant. Plus besoin de tout réexpliquer à chaque fois. Les rappels SMS c'est top aussi.` },
  { nom: 'Christelle M.', ville: 'Brossard',   note: 5, texte: `L'abonnement Kadio m'a sauvé. Je fais mes tresses tous les mois pour un prix fixe. Ma coiffeuse Rachel est incroyable.` },
]

// ── Stats ──────────────────────────────────────────────────────
export const STATS = [
  { valeur: '33+',  label: 'Clients actifs' },
  { valeur: '10',   label: 'Partenaires certifiés' },
  { valeur: '6',    label: 'Villes couvertes' },
  { valeur: '2 ans', label: `D'expérience` },
]

// ── Villes bannière ────────────────────────────────────────────
export const VILLES = ['Longueuil', 'Montréal', 'Laval', 'Brossard', 'Québec', 'Gatineau', 'Sherbrooke']

// ── Services (16) ─────────────────────────────────────────────
export const SERVICES_PUBLIC = [
  { nom: 'Tresses classiques',   cat: 'Tresses',  salon: 80,  domicile: 95,  deplacement: 110 },
  { nom: 'Knotless braids',      cat: 'Tresses',  salon: 120, domicile: 140, deplacement: 160 },
  { nom: 'Tresses cornrows',     cat: 'Tresses',  salon: 60,  domicile: 75,  deplacement: 90  },
  { nom: 'Feed-in braids',       cat: 'Tresses',  salon: 70,  domicile: 85,  deplacement: 100 },
  { nom: 'Locs installation',    cat: 'Locs',     salon: 150, domicile: 175, deplacement: 200 },
  { nom: 'Locs resserrage',      cat: 'Locs',     salon: 80,  domicile: 95,  deplacement: 110 },
  { nom: 'Locs entretien',       cat: 'Locs',     salon: 60,  domicile: 75,  deplacement: 90  },
  { nom: 'Coupe homme fade',     cat: 'Barbier',  salon: 35,  domicile: 50,  deplacement: 60  },
  { nom: 'Coupe dégradé',        cat: 'Barbier',  salon: 40,  domicile: 55,  deplacement: 65  },
  { nom: 'Barbe complète',       cat: 'Barbier',  salon: 25,  domicile: 35,  deplacement: 45  },
  { nom: 'Coupes enfant (−12)',  cat: 'Enfants',  salon: 25,  domicile: 35,  deplacement: 45  },
  { nom: 'Tresses petite fille', cat: 'Enfants',  salon: 50,  domicile: 65,  deplacement: 80  },
  { nom: 'Tissage simple',       cat: 'Tissage',  salon: 90,  domicile: 110, deplacement: 130 },
  { nom: 'Tresses signature',    cat: 'Tresses',  salon: 200, domicile: 230, deplacement: 260 },
  { nom: 'Crochet braids',       cat: 'Tresses',  salon: 85,  domicile: 100, deplacement: 115 },
  { nom: 'Soin cuir chevelu',    cat: 'Soins',    salon: 45,  domicile: 60,  deplacement: 75  },
]

// ── Forfaits abonnement (9) ────────────────────────────────────
export const FORFAITS = [
  { id: 'f1', nom: 'Barbier Essentiel',    cat: 'Barbier',  prix: 29,  desc: `2 coupes/mois`,   populaire: false, inclus: ['2 coupes fade ou dégradé', 'Rappels SMS', 'Booking prioritaire'] },
  { id: 'f2', nom: 'Barbier Premium',      cat: 'Barbier',  prix: 45,  desc: `4 coupes/mois`,   populaire: false, inclus: ['4 coupes + barbe', 'Rappels SMS', 'Booking prioritaire', 'Réduction 10% extras'] },
  { id: 'f3', nom: 'Tresses Essentiel',    cat: 'Tresses',  prix: 75,  desc: `1 session/mois`,  populaire: false, inclus: ['1 session tresses classiques', 'Rappels SMS', 'Booking prioritaire'] },
  { id: 'f4', nom: 'Knotless Signature',   cat: 'Tresses',  prix: 110, desc: `1 knotless/mois`, populaire: true,  inclus: ['1 session knotless', 'Consultation style', 'SMS rappels', 'Priorité booking', 'Réduction 15% extras'] },
  { id: 'f5', nom: 'Tresses Signature',    cat: 'Tresses',  prix: 175, desc: `1 signature/mois`,populaire: true,  inclus: ['1 tresses signature', 'Consultation couleur', 'SMS rappels', 'Priorité VIP', 'Réduction 20% extras', 'Partenaire dédié'] },
  { id: 'f6', nom: 'Locs Mensuel',         cat: 'Locs',     prix: 60,  desc: `1 entretien/mois`,populaire: false, inclus: ['1 resserrage mensuel', 'Rappels SMS', 'Booking prioritaire'] },
  { id: 'f7', nom: 'Famille Enfants',      cat: 'Enfants',  prix: 55,  desc: `2 enfants/mois`,  populaire: false, inclus: ['2 coupes enfant', 'Rappels SMS', 'Booking flexible'] },
  { id: 'f8', nom: 'Locs Premium',         cat: 'Locs',     prix: 90,  desc: `Entretien + soin`,populaire: false, inclus: ['1 resserrage + soin', 'Consultation', 'SMS rappels', 'Priorité booking', 'Réduction 10% extras'] },
  { id: 'f9', nom: 'Tout Compris',         cat: 'Tous',     prix: 149, desc: `Services illimités`,populaire: false,inclus: ['Services au choix illimités*', 'Priorité absolue', 'Partenaire dédié', 'Rappels SMS', 'Réduction 25% extras', '*fair use: 1/semaine max'] },
]
