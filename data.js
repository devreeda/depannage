const LEVELS = [
  {
    id:'vitrine', num:'01', title:'Le poisson du jeudi',
    place:'Poissonnerie Lopez — Palavas-les-Flots',
    gear:'Vitrine négative 2,5 m · R448A · groupe en toiture',
    gearShort:'Vitrine négative · R448A',
    ref:'R448A', start:'07:12', ambient:28,
    gauges:{bpMax:8,hpMax:30},
    call:`« Allô ? Ça fait trois jours que la vitrine affiche -8 au lieu de -18. J'ai jeté 40 kg de poisson ce matin. Vous pouvez venir aujourd'hui ? »`,
    client:'Mme Lopez, poissonnière',
    symptoms:[
      `La vitrine affiche -8 °C au lieu de -18 °C`,
      `Le groupe tourne en continu, il ne s'arrête plus`,
      `Ambiance de la poissonnerie : 28 °C`
    ],
    actions:[
      {id:'hp',cat:'Manifold',label:'Brancher le manifold — HP',cost:4,
       num:{label:'HP',val:22.8,unit:'bar',range:'17,5 – 20,5 bar',note:`La condensation est à ~50 °C. Le condenseur n'évacue plus.`}},
      {id:'bp',cat:'Manifold',label:'Brancher le manifold — BP',cost:4,
       num:{label:'BP',val:1.6,unit:'bar',range:'0,9 – 1,7 bar',note:`Évaporation vers -18 °C. Dans les clous.`}},
      {id:'tref',cat:'Sondes',label:'Poser une sonde sur le refoulement',cost:3,
       num:{label:'T° refoulement',val:102,unit:'°C',range:'70 – 90 °C',note:`Au-dessus de 90 °C, l'huile et les joints trinquent.`}},
      {id:'sh',cat:'Sondes',label:'Calculer la surchauffe',cost:5,tag:'Surchauffe',
       num:{label:'Surchauffe',val:9,unit:'K',range:'5 – 8 K',note:`Un peu haute, mais rien d'alarmant.`}},
      {id:'sc',cat:'Sondes',label:'Calculer le sous-refroidissement',cost:5,
       num:{label:'Sous-refroidissement',val:2,unit:'K',range:'4 – 6 K',note:`Faible. Le liquide part trop chaud vers le détendeur.`}},
      {id:'amp',cat:'Électro',label:'Pince ampèremétrique sur le compresseur',cost:3,
       num:{label:'Intensité',val:8.6,unit:'A',range:'6,8 A (plaque)',note:`26 % au-dessus de la plaque. Il force.`}},
      {id:'cond',cat:'Visuel',label:'Inspecter le condenseur',cost:4,tag:'Condenseur',
       txt:`Ailettes colmatées : une couche de graisse de friture et de poussière. Le ventilo tourne, mais l'air passe mal.`},
      {id:'client',cat:'Client',label:'Parler au patron de la poissonnerie',cost:2,tag:'Client',
       txt:`« La sortie de la friteuse donne juste à côté. Et personne n'a jamais nettoyé le condenseur, il est en toiture. »`}
    ],
    options:[
      {id:'charge',label:`Manque de charge`},
      {id:'condenseur',label:`Condenseur colmaté — échange thermique dégradé`},
      {id:'detendeur',label:`Détendeur bloqué ouvert`},
      {id:'compresseur',label:`Compresseur en fin de vie`}
    ],
    correct:'condenseur',
    part:{label:'Nettoyage condenseur',price:0},
    lesson:[
      `HP à 22,8 bar pour 28 °C d'ambiance : la condensation est à 50 °C au lieu de 43. Le condenseur n'évacue plus la chaleur.`,
      `Un manque de charge aurait fait chuter la HP et grimper la surchauffe. Ici la surchauffe est quasi normale : le circuit est plein, c'est l'échange qui est bouché.`,
      `Nettoyage et dégraissage du condenseur. Et un mot au client sur l'extraction de la friteuse.`
    ]
  },
  {
    id:'chambre', num:'02', title:'La chambre qui fait des glaçons',
    place:'Restaurant Le Mazet — Montpellier',
    gear:'Chambre froide positive 8 m³ · R448A · évaporateur plafonnier',
    gearShort:'Chambre positive · R448A',
    ref:'R448A', start:'08:35', ambient:21,
    gauges:{bpMax:8,hpMax:30},
    call:`« La chambre affiche 9 °C au lieu de 4. Y'a de la glace partout sur le ventilo du plafond. Et ça sent le fromage. »`,
    client:'Karim, chef de cuisine',
    symptoms:[
      `Chambre à +9 °C au lieu de +4 °C`,
      `Évaporateur couvert de givre`,
      `Aucun cycle de dégivrage entendu depuis des jours`
    ],
    actions:[
      {id:'hp',cat:'Manifold',label:'Brancher le manifold — HP',cost:4,
       num:{label:'HP',val:15.8,unit:'bar',range:'14,0 – 16,5 bar',note:`Condensation vers 35 °C pour 21 °C d'ambiance. Correct.`}},
      {id:'bp',cat:'Manifold',label:'Brancher le manifold — BP',cost:4,
       num:{label:'BP',val:1.9,unit:'bar',range:'2,8 – 3,6 bar',note:`Évaporation -16 °C. Trop bas pour une positive : on attend -8 à -10 °C.`}},
      {id:'sh',cat:'Sondes',label:'Calculer la surchauffe',cost:5,tag:'Surchauffe',
       num:{label:'Surchauffe',val:7,unit:'K',range:'5 – 8 K',note:`Dans la norme. Le détendeur régule.`}},
      {id:'sc',cat:'Sondes',label:'Calculer le sous-refroidissement',cost:5,
       num:{label:'Sous-refroidissement',val:5,unit:'K',range:'4 – 6 K',note:`Correct.`}},
      {id:'tasp',cat:'Sondes',label:`Prendre la température d'aspiration`,cost:3,
       num:{label:'T° aspiration',val:-9,unit:'°C',range:'-10 – -7 °C',note:`Cohérent avec la BP et la surchauffe.`}},
      {id:'res',cat:'Électro',label:`Contrôler la résistance de dégivrage à l'ohmmètre`,cost:5,tag:'Résistance',
       txt:`Continuité infinie. La résistance est coupée.`},
      {id:'cycle',cat:'Régulation',label:'Lire le dernier cycle de dégivrage',cost:4,tag:'Dégivrage',
       txt:`Dernier dégivrage : il y a 74 heures. Le cycle ne se déclenche plus.`},
      {id:'evap',cat:'Visuel',label:`Ouvrir la chambre et regarder l'évaporateur`,cost:3,tag:'Évaporateur',
       txt:`Bloc de glace. Givre uniforme et épais, ailettes noyées.`}
    ],
    options:[
      {id:'charge',label:`Manque de charge`},
      {id:'detendeur_bouche',label:`Détendeur bouché`},
      {id:'degivrage',label:`Résistance de dégivrage coupée — évaporateur pris en glace`},
      {id:'sonde',label:`Sonde de régulation HS`}
    ],
    correct:'degivrage',
    part:{label:'Résistance de dégivrage',price:38},
    lesson:[
      `Les pressions étaient presque bonnes : c'est le piège. Un évaporateur noyé dans la glace n'échange plus, la BP chute et la chambre décroche.`,
      `Surchauffe à 7 K et sous-refroidissement à 5 K : circuit plein, détendeur OK. Le problème est côté dégivrage.`,
      `Résistance en circuit ouvert, aucun cycle depuis 74 h. Remplacement, puis dégivrage complet et contrôle du drain.`
    ]
  },
  {
    id:'split', num:'03', title:'Le split du beau-frère',
    place:'Villa — Saint-Clément-de-Rivière',
    gear:'Split mural 3,5 kW · R32 · posé « par un ami »',
    gearShort:'Split mural · R32',
    ref:null, start:'14:10', ambient:31,
    gauges:{bpMax:12,hpMax:40},
    call:`« Mon beau-frère l'a installé en septembre. Ça souffle, mais ça ne refroidit pas. Il dit que c'est la carte électronique. »`,
    client:'M. Vidal, propriétaire',
    symptoms:[
      `Ça souffle à peine frais`,
      `Le compresseur du groupe extérieur tourne`,
      `Aucune condensation sur les raccords`
    ],
    actions:[
      {id:'bp',cat:'Manifold',label:'Brancher le manifold — BP',cost:4,
       num:{label:'BP',val:0,unit:'bar',range:'4,5 – 6,5 bar',note:`Zéro. Le circuit est vide.`}},
      {id:'hp',cat:'Manifold',label:'Brancher le manifold — HP',cost:4,
       num:{label:'HP',val:0,unit:'bar',range:'15 – 25',note:`Zéro aussi. Pas une molécule de fluide.`}},
      {id:'amp',cat:'Électro',label:'Pince ampèremétrique sur le compresseur',cost:3,
       num:{label:'Intensité',val:1.9,unit:'A',range:'7,2 A (plaque)',note:`Le compresseur tourne à vide.`}},
      {id:'sh',cat:'Sondes',label:'Calculer la surchauffe',cost:5,tag:'Surchauffe',
       txt:`Impossible : sans pression, il n'y a pas de surchauffe à calculer.`},
      {id:'soufflage',cat:'Sondes',label:'Prendre la température de soufflage',cost:3,
       num:{label:'T° soufflage',val:26,unit:'°C',range:'8 – 12 °C',note:`Ambiance. Aucun froid produit.`}},
      {id:'raccords',cat:'Visuel',label:'Inspecter les liaisons et les vannes',cost:4,tag:'Vannes',
       txt:`Vannes de service encore fermées, capuchons jamais déposés. Isolant éventré — un nid de paille dedans. Raccords oxydés.`},
      {id:'fuite',cat:'Sondes',label:'Chercher une trace de fuite',cost:5,tag:'Étanchéité',
       txt:`Aucune trace d'huile, aucun sifflement. Le circuit n'a jamais été chargé.`},
      {id:'client',cat:'Client',label:'Parler au propriétaire',cost:2,tag:'Client',
       txt:`« Mon beau-frère a tiré les lignes, branché, et il a dit : ça se fait tout seul. »`}
    ],
    options:[
      {id:'carte',label:`Carte électronique HS`},
      {id:'compresseur',label:`Compresseur HS`},
      {id:'miseenservice',label:`Vannes fermées — installation jamais mise en service`},
      {id:'fuite',label:`Fuite de fluide sur les raccords`}
    ],
    correct:'miseenservice',
    part:{label:'Mise en service + charge R32',price:0},
    lesson:[
      `Zéro bar des deux côtés, compresseur qui tourne à vide : le circuit n'a jamais vu une molécule de R32.`,
      `Les vannes sont restées fermées, les capuchons n'ont jamais été retirés. Ce n'est pas une panne, c'est une mise en service qui n'a pas eu lieu.`,
      `Tirage au vide, charge selon la longueur de ligne, contrôle d'étanchéité. Et on refait l'isolant — sans le nid.`
    ]
  },
  {
    id:'meuble', num:'04', title:'Le meuble qui claque',
    place:'Supérette — Castelnau-le-Lez',
    gear:'Meuble négatif 2 portes · R448A · compresseur hermétique',
    gearShort:'Meuble négatif · R448A',
    ref:'R448A', start:'09:05', ambient:24,
    gauges:{bpMax:8,hpMax:30},
    call:`« Le meuble remonte à -8, et le compresseur fait un bruit de casserole puis s'arrête. Il redémarre dix minutes après. »`,
    client:'Sofia, gérante',
    symptoms:[
      `Meuble à -8 °C au lieu de -18 °C`,
      `Compresseur bruyant, cycles très courts`,
      `Ligne d'aspiration couverte de givre`
    ],
    actions:[
      {id:'hp',cat:'Manifold',label:'Brancher le manifold — HP',cost:4,
       num:{label:'HP',val:16.5,unit:'bar',range:'15,0 – 17,5 bar',note:`Condensation 37 °C pour 24 °C d'ambiance. Normal.`}},
      {id:'bp',cat:'Manifold',label:'Brancher le manifold — BP',cost:4,
       num:{label:'BP',val:3.4,unit:'bar',range:'1,2 – 1,8 bar',note:`Évaporation -4 °C. Beaucoup trop haut pour du négatif.`}},
      {id:'sh',cat:'Sondes',label:'Calculer la surchauffe',cost:5,tag:'Surchauffe',
       num:{label:'Surchauffe',val:0.5,unit:'K',range:'5 – 8 K',note:`Quasi nulle. Le détendeur laisse passer du liquide.`}},
      {id:'sc',cat:'Sondes',label:'Calculer le sous-refroidissement',cost:5,
       num:{label:'Sous-refroidissement',val:6,unit:'K',range:'4 – 6 K',note:`Correct. Ce n'est pas une surcharge.`}},
      {id:'tasp',cat:'Sondes',label:`Prendre la température d'aspiration`,cost:3,
       num:{label:'T° aspiration',val:-3.5,unit:'°C',range:'-6 – -3 °C',note:`L'aspiration est à la température d'évaporation : du liquide remonte.`}},
      {id:'amp',cat:'Électro',label:'Pince ampèremétrique sur le compresseur',cost:3,
       num:{label:'Intensité',val:7.9,unit:'A',range:'7,1 A (plaque)',note:`Au-dessus de la plaque : le compresseur avale du liquide.`}},
      {id:'ligne',cat:'Visuel',label:`Suivre la ligne d'aspiration`,cost:3,tag:'Aspiration',
       txt:`Givre épais sur l'aspiration, jusqu'au compresseur. Le corps du compresseur est froid et mouillé.`},
      {id:'det',cat:'Visuel',label:'Écouter le détendeur',cost:2,tag:'Détendeur',
       txt:`Le détendeur siffle en continu. Plus aucune régulation.`}
    ],
    options:[
      {id:'surcharge',label:`Surcharge de fluide`},
      {id:'detendeur_ouvert',label:`Détendeur bloqué ouvert — retour de liquide`},
      {id:'condenseur',label:`Condenseur encrassé`},
      {id:'compresseur_use',label:`Compresseur usé`}
    ],
    correct:'detendeur_ouvert',
    part:{label:'Détendeur thermostatique',price:92},
    lesson:[
      `Surchauffe 0,5 K et aspiration givrée jusqu'au compresseur : le détendeur est bloqué ouvert. Le liquide remonte, l'huile se dilue, le compresseur claque.`,
      `Ce n'est pas une surcharge : le sous-refroidissement est normal (6 K). Une surcharge aurait donné plus de 10 K.`,
      `Détendeur à remplacer, puis contrôle de l'huile et de l'isolement du compresseur. Deux jours de plus et il serrait.`
    ]
  },
  {
    id:'co2', num:'05', title:'Le CO2 en colère',
    place:'Supermarché — Odysseum, Montpellier',
    gear:'Central CO2 transcritique · R744 · gas cooler en toiture',
    gearShort:'Central CO2 · R744',
    ref:'R744', start:'12:40', ambient:40,
    gauges:{bpMax:60,hpMax:140},
    call:`« Toutes les vitrines négatives décrochent depuis midi. La HP est à 118 bar et le groupe gueule. Il fait 40 dehors. »`,
    client:'Service technique du magasin',
    symptoms:[
      `Meubles négatifs à -6 °C au lieu de -18 °C`,
      `HP à 118 bar, groupe en sécurité par moments`,
      `Extérieur : 40 °C, plein soleil sur la toiture`
    ],
    actions:[
      {id:'hp',cat:'Manifold',label:'Lire la HP sur la régulation',cost:4,
       num:{label:'HP',val:118,unit:'bar',range:'95 – 105 bar',note:`Très haute. À 40 °C, l'optimum tourne autour de 100 bar.`}},
      {id:'bp',cat:'Manifold',label:'Lire la BP sur la régulation',cost:4,
       num:{label:'BP',val:25,unit:'bar',range:'15 – 18 bar',note:`Évaporation -11 °C. Le flash gas étouffe les évaporateurs.`}},
      {id:'tgc',cat:'Sondes',label:'Température de sortie du gas cooler',cost:4,
       num:{label:'Sortie gas cooler',val:58,unit:'°C',range:'42 – 45 °C',note:`Le gaz part à 58 °C au lieu de 43. Il arrive brûlant au détendeur.`}},
      {id:'text',cat:'Sondes',label:'Température extérieure',cost:2,
       num:{label:'T° extérieure',val:40,unit:'°C',range:'—',note:`Canicule. Le système est en transcritique, c'est normal à cette température.`}},
      {id:'ventilos',cat:'Visuel',label:'Monter voir le gas cooler',cost:3,tag:'Gas cooler',
       txt:`Deux ventilateurs sur trois à l'arrêt. Ailettes brûlantes, aucun débit d'air.`},
      {id:'amp',cat:'Électro',label:'Pince sur le compresseur HP',cost:3,
       num:{label:'Intensité HP',val:38,unit:'A',range:'—',note:`Dans les valeurs. Il compense comme il peut.`}},
      {id:'cop',cat:'Régulation',label:'Lire le COP calculé',cost:4,
       num:{label:'COP',val:1.3,unit:'',range:'2,0 – 2,3',note:`Tu brûles de l'électricité pour évacuer de la chaleur.`}},
      {id:'client',cat:'Client',label:'Appeler le responsable technique',cost:2,tag:'Client',
       txt:`« Les filtres ont été nettoyés hier. Les ventilos, c'est le contrat de maintenance. »`}
    ],
    options:[
      {id:'charge',label:`Charge excessive en CO2`},
      {id:'ventilos',label:`Ventilateurs du gas cooler HS — HP flottante trop haute`},
      {id:'detendeur_hp',label:`Détendeur HP (flash gas) HS`},
      {id:'compresseur',label:`Compresseur HP en fin de vie`}
    ],
    correct:'ventilos',
    part:{label:'Ventilateur gas cooler',price:148},
    lesson:[
      `À 40 °C, le CO2 est transcritique : la HP n'est plus imposée par la condensation, elle se pilote. Encore faut-il évacuer la chaleur.`,
      `Deux ventilos sur trois à l'arrêt → sortie gas cooler à 58 °C → HP flottante à 118 bar → COP à 1,3 au lieu de 2,2.`,
      `Réparation des ventilos, nettoyage, vérification de la loi de HP flottante. La charge n'y est pour rien.`
    ]
  },
  {
    id:'four', num:'06', title:'Le four qui fait sauter le jus',
    place:'Cuisine centrale — Lunel',
    gear:'Four mixte 20.20 · 3N~400 V · 67,3 kW · disjoncteur 4P 125 A',
    gearShort:'Four mixte · 3N~400 V',
    ref:null, start:'06:55', ambient:24,
    gauges:null,
    amps:{nominal:97.3},
    call:`« Le four tourne 30 à 40 minutes et le disjoncteur saute. Pas le différentiel : le gros. Et ça le fait de plus en plus vite. »`,
    client:'Le chef, déjà énervé',
    symptoms:[
      `Déclenchement après 20 à 40 min de chauffe`,
      `Le disjoncteur est tiède, pas brûlant`,
      `Aucun défaut affiché sur le four`
    ],
    actions:[
      {id:'l1',cat:'Électro',label:'Pince ampèremétrique — L1',cost:3,
       num:{label:'Courant L1',val:91,unit:'A',range:'97,3 A (plaque)',note:`Un peu sous le nominal.`,amp:'L1'}},
      {id:'l2',cat:'Électro',label:'Pince ampèremétrique — L2',cost:2,
       num:{label:'Courant L2',val:89,unit:'A',range:'97,3 A (plaque)',note:`Écart max 4 A entre phases : rien d'alarmant.`,amp:'L2'}},
      {id:'l3',cat:'Électro',label:'Pince ampèremétrique — L3',cost:2,
       num:{label:'Courant L3',val:93,unit:'A',range:'97,3 A (plaque)',note:`Équilibrage correct pour un four.`,amp:'L3'}},
      {id:'tcoffret',cat:'Sondes',label:'Température dans le coffret',cost:3,
       num:{label:'T° coffret',val:51,unit:'°C',range:'≤ 40 °C',note:`Chaud. Au-dessus de 40 °C, un disjoncteur se déclassifie.`}},
      {id:'ir',cat:'Visuel',label:'Lire le réglage Ir du disjoncteur',cost:3,tag:'Réglage Ir',
       txt:`Molette Ir sur 0,8 × In = 100 A. Plaque du four : 97,3 A.`},
      {id:'iso',cat:'Électro',label:'Mégohmmètre sur les résistances, à chaud',cost:6,
       num:{label:'Isolement',val:1.2,unit:'MΩ',range:'> 1 MΩ',note:`Au-dessus du seuil, mais à surveiller.`}},
      {id:'serrage',cat:'Visuel',label:'Contrôler les serrages',cost:3,tag:'Serrages',
       txt:`Bornes correctement serrées, aucune trace de chauffe.`},
      {id:'thermo',cat:'Visuel',label:'Thermographie du coffret',cost:4,tag:'Thermographie',
       txt:`Bornes à 76 °C, boîtier à 51 °C. Pas de point chaud franc.`}
    ],
    options:[
      {id:'terre',label:`Fuite à la terre d'une résistance`},
      {id:'ir',label:`Ir du disjoncteur sous-calibré + déclassement thermique`},
      {id:'desequilibre',label:`Déséquilibre de phases`},
      {id:'disjoncteur',label:`Disjoncteur défectueux`}
    ],
    correct:'ir',
    part:{label:'Réglage + ventilation coffret',price:0},
    lesson:[
      `97,3 A nominaux, disjoncteur 125 A : le calibre est bon (ratio 1,29). Mais l'Ir est sur 0,8 → 100 A, soit 2,8 % de marge.`,
      `Ajoute 51 °C dans le coffret : le thermique se déclasse et déclenche après 30 à 40 min, exactement le temps que la chaleur s'installe.`,
      `Ir sur 1,0 (125 A), ventilation du coffret, contrôle des serrages. La résistance n'y est pour rien.`
    ]
  }
];
