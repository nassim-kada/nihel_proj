'use client';

import { useEffect } from 'react';

const DOCTORS_DATABASE = [
  { 
    id: 1, 
    name: 'Dr. Ahmed Hassan', 
    specialty: 'Cardiologie',
    phone: '0550123456',
    email: 'ahmed.hassan@medcal.dz',
    available: true, 
    slots: ['09:00', '10:30', '14:00', '15:30'],
  },
  { 
    id: 2, 
    name: 'Dr. Fatima Ben Ali', 
    specialty: 'Dermatologie',
    phone: '0561234567',
    email: 'fatima.benali@medcal.dz',
    available: true, 
    slots: ['08:30', '11:00', '13:30', '16:00'],
  },
  { 
    id: 3, 
    name: 'Dr. Mohamed Saidi', 
    specialty: 'Neurologie',
    phone: '0572345678',
    email: 'mohamed.saidi@medcal.dz',
    available: false, 
    slots: [],
  },
  { 
    id: 4, 
    name: 'Dr. Leila Bouvier', 
    specialty: 'Pediatrie',
    phone: '0583456789',
    email: 'leila.bouvier@medcal.dz',
    available: true, 
    slots: ['09:30', '11:30', '15:00'],
  },
  { 
    id: 5, 
    name: 'Dr. Karim Djamal', 
    specialty: 'Chirurgie Générale',
    phone: '0594567890',
    email: 'karim.djamal@medcal.dz',
    available: true, 
    slots: ['10:00', '12:00', '14:30'],
  },
  { 
    id: 6, 
    name: 'Dr. Nadia Leblanc', 
    specialty: 'Gastroenterologie',
    phone: '0605678901',
    email: 'nadia.leblanc@medcal.dz',
    available: true, 
    slots: ['09:00', '14:00', '16:30'],
  },
  { 
    id: 7, 
    name: 'Dr. Hamza Riad', 
    specialty: 'Médecine Générale',
    phone: '0616789012',
    email: 'hamza.riad@medcal.dz',
    available: true, 
    slots: ['08:00', '09:30', '13:00', '15:00', '17:00'],
  },
];

// ===== DISEASES DATABASE (25+ MALADIES) =====
const DISEASES_DATABASE = [
  {
    id: 1,
    name: 'Fièvre',
    keywords: ['fièvre', 'fievre', 'température', 'temperature', 'chaud', 'frisson'],
    emoji: '🌡️',
    info: "LA FIÈVRE - Informations médicales:\n\nLa fièvre (> 38°C) indique une infection.\n\n⚠️ SYMPTÔMES COURANTS:\n• Sensation de chaud/froid\n• Frissons\n• Maux de tête\n• Fatigue\n\n💊 CE QUE FAIRE:\n• Repos complet\n• Hydratez-vous régulièrement\n• Paracétamol si nécessaire\n\n🚨 CONSULTEZ UN MÉDECIN SI:\n• Fièvre > 3 jours\n• Température > 39°C\n• Accompagnée de dyspnée",
    specialty: 'Médecine Générale'
  },
  {
    id: 2,
    name: 'Toux',
    keywords: ['toux', 'tousse', 'toussement'],
    emoji: '🫁',
    info: "LA TOUX - Informations médicales:\n\nLa toux est une réaction naturelle du corps.\n\n📋 CAUSES POSSIBLES:\n• Rhume viral\n• Bronchite\n• Asthme\n• Allergies\n• Pneumonie\n\n💊 TRAITEMENTS NATURELS:\n• Repos\n• Buvez beaucoup d'eau\n• Miel et citron chaud\n• Vapeur d'eau chaude\n\n🚨 CONSULTEZ SI:\n• Toux persiste > 2 semaines\n• Crachats de sang\n• Essoufflement grave\n• Douleur thoracique",
    specialty: 'Médecine Générale'
  },
  {
    id: 3,
    name: 'Mal de tête',
    keywords: ['mal', 'tête', 'tete', 'migraine', 'headache', 'céphalée'],
    emoji: '🤕',
    info: "MAL DE TÊTE - Informations médicales:\n\nLes maux de tête sont très courants.\n\n🎯 TYPES COURANTS:\n• Tension (muscle/stress)\n• Migraines\n• Sinusite\n• Fatigue\n\n💊 SOULAGEMENT IMMÉDIAT:\n• Reposez-vous dans l'obscurité\n• Compresses froides ou chaudes\n• Hydratation régulière\n• Paracétamol ou ibuprofène\n\n🧘 PRÉVENTION:\n• Gestion du stress\n• Sommeil régulier\n• Exercice modéré\n• Alimentation équilibrée",
    specialty: 'Neurologie'
  },
  {
    id: 4,
    name: 'Problèmes digestifs',
    keywords: ['estomac', 'digestion', 'mal au ventre', 'gastro', 'constipation', 'diarrhée'],
    emoji: '🤢',
    info: "PROBLÈMES DIGESTIFS - Informations médicales:\n\n💊 CAUSES COURANTES:\n• Repas trop lourd\n• Stress\n• Nourriture épicée\n• Intoxication alimentaire\n• Gastro-entérite\n\n🛑 CE QU'IL FAUT FAIRE:\n• Repos digestif (aliments légers)\n• Hydratation régulière\n• Évitez alcool et caféine\n• Compresses chaudes sur le ventre\n\n🚨 CONSULTEZ SI:\n• Douleur intense\n• Vomissements persistants\n• Signes de déshydratation\n• Douleur > 24 heures",
    specialty: 'Gastroenterologie'
  },
  {
    id: 5,
    name: 'Acné / Problèmes de peau',
    keywords: ['peau', 'acné', 'eczema', 'eczéma', 'dermatologie', 'bouton', 'psoriasis', 'urticaire'],
    emoji: '🔴',
    info: "PROBLÈMES DE PEAU - Informations médicales:\n\n📋 PROBLÈMES COURANTS:\n• Acné\n• Eczéma\n• Psoriasis\n• Dermatite\n• Urticaire\n\n💧 SOINS DE BASE:\n• Nettoyage doux deux fois par jour\n• Hydratation régulière\n• Évitez irritants/savons agressifs\n• Protégez-vous du soleil (SPF 30+)\n• Pas de grattage\n\n🚨 CONSULTEZ UN DERMATOLOGUE SI:\n• Problèmes persistants > 2 semaines\n• Infection ou suppuration\n• Étendue importante\n• Problèmes récurrents",
    specialty: 'Dermatologie'
  },
  {
    id: 6,
    name: 'Grippe',
    keywords: ['grippe', 'flu', 'virus', 'grippal'],
    emoji: '🦠',
    info: "GRIPPE - Informations médicales:\n\nInfection virale respiratoire saisonnière.\n\n⚠️ SYMPTÔMES:\n• Fièvre soudaine (38-40°C)\n• Toux sèche\n• Fatigue extrême\n• Douleurs musculaires\n• Mal de gorge\n\n💊 TRAITEMENT:\n• Repos au lit 3-4 jours\n• Hydratation abondante\n• Antiviraux si précoce\n• Paracétamol\n\n🚨 URGENCE SI:\n• Difficultés respiratoires\n• Confusion mentale\n• Fièvre > 40°C",
    specialty: 'Médecine Générale'
  },
  {
    id: 7,
    name: 'Asthme',
    keywords: ['asthme', 'asthmatique', 'respiration', 'essoufflement'],
    emoji: '💨',
    info: "ASTHME - Informations médicales:\n\nMaladie inflammatoire des voies respiratoires.\n\n⚠️ SYMPTÔMES:\n• Essoufflement\n• Toux persistante\n• Sensation d'oppression thoracique\n• Sifflement lors de la respiration\n\n💊 GESTION:\n• Inhalateurs de secours\n• Prévention des allergènes\n• Éviter le froid/pollution\n• Exercice régulier modéré\n\n🚨 CRISE D'ASTHME:\n• Appeler médecin rapidement\n• Respiration calme\n• Utiliser inhalateur",
    specialty: 'Médecine Générale'
  },
  {
    id: 8,
    name: 'Diabète',
    keywords: ['diabète', 'diabetes', 'sucre', 'glucose', 'glycémie'],
    emoji: '🩺',
    info: "DIABÈTE - Informations médicales:\n\nMaladie métabolique du glucose.\n\n📋 TYPES:\n• Type 1: Auto-immune\n• Type 2: Métabolique/Obésité\n\n⚠️ SYMPTÔMES:\n• Soif excessive\n• Mictions fréquentes\n• Fatigue\n• Vision floue\n• Plaies qui cicatrisent lentement\n\n💊 GESTION:\n• Régime adapté\n• Exercice régulier\n• Traitement médicamenteux\n• Suivi médical régulier",
    specialty: 'Médecine Générale'
  },
  {
    id: 9,
    name: 'Hypertension',
    keywords: ['hypertension', 'tension', 'pressión', 'ta élevée'],
    emoji: '❤️',
    info: "HYPERTENSION - Informations médicales:\n\nTension artérielle élevée (> 140/90).\n\n⚠️ RISQUES:\n• Crise cardiaque\n• Accident vasculaire\n• Insuffisance rénale\n\n💊 PRÉVENTION:\n• Régime pauvre en sel\n• Exercice 30 min/jour\n• Gestion du stress\n• Perte de poids\n• Limitation alcool\n\n🚨 CONSULTEZ SI:\n• Tension > 180/120\n• Mal de tête intense\n• Vision floue",
    specialty: 'Cardiologie'
  },
  {
    id: 10,
    name: 'Angine / Mal de gorge',
    keywords: ['angine', 'gorge', 'pharyngite', 'amygdalite', 'throat'],
    emoji: '🔴',
    info: "ANGINE - Informations médicales:\n\nInflammation de la gorge/amygdales.\n\n⚠️ SYMPTÔMES:\n• Mal de gorge intense\n• Fièvre\n• Difficulté à avaler\n• Gonflement amygdales\n• Rougeur\n\n💊 TRAITEMENT:\n• Repos vocal\n• Pastilles pour la gorge\n• Boissons chaudes\n• Paracétamol/Ibuprofène\n• Antibiotiques si bactérienne\n\n🚨 CONSULTEZ SI:\n• Symptômes graves\n• Fièvre > 3 jours",
    specialty: 'Médecine Générale'
  },
  {
    id: 11,
    name: 'Rhume',
    keywords: ['rhume', 'cold', 'rhinite', 'nez bouché', 'nez encombré'],
    emoji: '🤧',
    info: "RHUME - Informations médicales:\n\nInfection virale courante des voies nasales.\n\n⚠️ SYMPTÔMES:\n• Nez bouché/écoulement\n• Éternuements\n• Mal de gorge léger\n• Toux légère\n• Fatigue légère\n\n💊 TRAITEMENT:\n• Repos suffisant\n• Hydratation\n• Sprays nasaux\n• Miel et citron\n• Vitamine C\n\nℹ️ Le rhume disparaît en 3-7 jours",
    specialty: 'Médecine Générale'
  },
  {
    id: 12,
    name: 'Allergies',
    keywords: ['allergie', 'allergique', 'alergia', 'démangeaison', 'histamine'],
    emoji: '🌸',
    info: "ALLERGIES - Informations médicales:\n\nRéaction immunitaire à une substance.\n\n⚠️ SYMPTÔMES:\n• Démangeaisons\n• Éruption cutanée\n• Nez qui coule\n• Yeux rouges/qui pleurent\n• Respiration sifflante\n\n💊 TRAITEMENT:\n• Antihistaminiques\n• Corticoïdes topiques\n• Éviter allergène\n• Immunothérapie si grave\n\n🚨 CHOC ALLERGIQUE:\n• Appelez SAMU 15\n• Position allongée",
    specialty: 'Dermatologie'
  },
  {
    id: 13,
    name: 'Arthrite / Arthrose',
    keywords: ['arthrite', 'arthrose', 'articulation', 'joint', 'rhumatisme'],
    emoji: '🦴',
    info: "ARTHRITE/ARTHROSE - Informations médicales:\n\nInflammation/usure des articulations.\n\n⚠️ SYMPTÔMES:\n• Douleur articulaire\n• Raideur du matin\n• Gonflement\n• Limitation mouvements\n• Craquements\n\n💊 TRAITEMENT:\n• Anti-inflammatoires\n• Physiothérapie\n• Perte de poids\n• Exercices adaptés\n• Compresses chaudes\n\n🚨 Consultez si douleur invalidante",
    specialty: 'Médecine Générale'
  },
  {
    id: 14,
    name: 'Insomnie',
    keywords: ['insomnie', 'sommeil', 'sleep', 'dormir', 'sommeil perturbé'],
    emoji: '😴',
    info: "INSOMNIE - Informations médicales:\n\nDifficultés d'endormissement ou maintien du sommeil.\n\n⚠️ CAUSES:\n• Stress/Anxiété\n• Caféine\n• Écrans avant lit\n• Irrégularité horaire\n• Problèmes médicaux\n\n💊 SOLUTIONS:\n• Hygiène de sommeil\n• Chambre sombre/froide\n• Éviter écrans 1h avant\n• Médicaments si nécessaire\n• Thérapie comportementale",
    specialty: 'Médecine Générale'
  },
  {
    id: 15,
    name: 'Anémie',
    keywords: ['anémie', 'anemia', 'fer', 'fatigue extrême', 'pâleur'],
    emoji: '🩸',
    info: "ANÉMIE - Informations médicales:\n\nManque de globules rouges/hémoglobine.\n\n⚠️ SYMPTÔMES:\n• Fatigue intense\n• Pâleur\n• Essoufflement\n• Étourdissements\n• Vertiges\n\n💊 CAUSES:\n• Carence fer\n• Carence B12/acide folique\n• Perte de sang\n\n💊 TRAITEMENT:\n• Suppléments fer\n• Alimentation riche\n• Traiter cause sous-jacente",
    specialty: 'Médecine Générale'
  },
  {
    id: 16,
    name: 'Cholestérol élevé',
    keywords: ['cholestérol', 'cholesterol', 'lipides', 'lipidémie'],
    emoji: '⚡',
    info: "CHOLESTÉROL ÉLEVÉ - Informations médicales:\n\nTaux élevé de lipides dans le sang.\n\n⚠️ RISQUES:\n• Maladie cardiaque\n• Attaque cérébrale\n• Obstruction artères\n\n💊 RÉDUCTION:\n• Régime pauvre en graisses\n• Exercice régulier\n• Perte de poids\n• Statines si nécessaire\n\n📋 Suivi sanguin régulier",
    specialty: 'Cardiologie'
  },
  {
    id: 17,
    name: 'Anxiété',
    keywords: ['anxiété', 'anxiety', 'stress', 'nervosité', 'panique'],
    emoji: '😰',
    info: "ANXIÉTÉ - Informations médicales:\n\nTroubles de l'anxiété généralisée.\n\n⚠️ SYMPTÔMES:\n• Nervosité\n• Agitation\n• Fatigue\n• Concentration difficile\n• Tremblements\n• Palpitations\n\n💊 TRAITEMENT:\n• Thérapie comportementale\n• Relaxation/Méditation\n• Exercice physique\n• Anxiolytiques si nécessaire\n• Psychothérapie",
    specialty: 'Médecine Générale'
  },
  {
    id: 18,
    name: 'Dépression',
    keywords: ['dépression', 'depression', 'mélancolie', 'tristesse persistante'],
    emoji: '😢',
    info: "DÉPRESSION - Informations médicales:\n\nTrouble psychologique affectant l'humeur.\n\n⚠️ SYMPTÔMES:\n• Tristesse persistante\n• Perte d'intérêt\n• Fatigue\n• Inappétence\n• Culpabilité\n• Pensées suicidaires\n\n💊 TRAITEMENT:\n• Psychothérapie\n• Antidépresseurs\n• Exercice régulier\n• Support social\n\n🚨 URGENCE si suicidaire",
    specialty: 'Médecine Générale'
  },
  {
    id: 19,
    name: 'Gastrite',
    keywords: ['gastrite', 'gastrique', 'estomac irrité', 'brûlure d\'estomac', 'reflux'],
    emoji: '🌶️',
    info: "GASTRITE - Informations médicales:\n\nInflammation de l'estomac.\n\n⚠️ SYMPTÔMES:\n• Brûlures d'estomac\n• Nausées\n• Ballonnements\n• Douleur épigastrique\n• Perte d'appétit\n\n💊 CAUSES:\n• Bactérie H. pylori\n• AINS\n• Alcool\n• Stress\n\n💊 TRAITEMENT:\n• Antiacides\n• IPP\n• Régime doux",
    specialty: 'Gastroenterologie'
  },
  {
    id: 20,
    name: 'Migraine',
    keywords: ['migraine', 'céphalée', 'hemiplegic'],
    emoji: '🤯',
    info: "MIGRAINE - Informations médicales:\n\nMal de tête intense et unilatéral.\n\n⚠️ SYMPTÔMES:\n• Douleur pulsatile intense\n• Nausées/Vomissements\n• Sensibilité lumière\n• Sensibilité bruit\n• Aura (vision floue)\n\n💊 TRAITEMENT:\n• Repos dans noir\n• Triptans\n• Anti-inflammatoires\n• Prévention (bêtabloquants)\n\n🚨 Consultez si grave",
    specialty: 'Neurologie'
  },
  {
    id: 21,
    name: 'Infection urinaire (UTI)',
    keywords: ['infection urinaire', 'uti', 'cystite', 'urinary', 'pipi douloureux'],
    emoji: '🔥',
    info: "INFECTION URINAIRE - Informations médicales:\n\nInflammation de l'urètre/Vessie.\n\n⚠️ SYMPTÔMES:\n• Brûlures miction\n• Urines fréquentes\n• Urine trouble/sang\n• Douleur abdominale\n• Sensation urgence\n\n💊 TRAITEMENT:\n• Hydratation abondante\n• Antibiotiques\n• Antiseptiques urinaires\n• Jus cranberry\n\n🚨 Consultez rapidement",
    specialty: 'Médecine Générale'
  },
  {
    id: 22,
    name: 'Hypertrophie prostate',
    keywords: ['prostate', 'prostatic', 'hypertrophie', 'adénome'],
    emoji: '🔵',
    info: "HYPERTROPHIE PROSTATE - Informations médicales:\n\nGrossissement de la prostate (BPH).\n\n⚠️ SYMPTÔMES (homme > 50ans):\n• Urines fréquentes\n• Jet urinaire faible\n• Nycturie (la nuit)\n• Sensation incomplétude\n• Douleur miction\n\n💊 TRAITEMENT:\n• Alpha-bloquants\n• Inhibiteurs 5-alpha\n• Chirurgie si grave\n\n📋 Suivi urologique",
    specialty: 'Médecine Générale'
  },
  {
    id: 23,
    name: 'Sinusite',
    keywords: ['sinusite', 'sinusitis', 'sinus', 'nez congestionné'],
    emoji: '👃',
    info: "SINUSITE - Informations médicales:\n\nInflammation des sinus nasaux.\n\n⚠️ SYMPTÔMES:\n• Douleur sinus\n• Nez obstrué\n• Écoulement nasal épais\n• Mal de tête\n• Toux\n• Fièvre légère\n\n💊 TRAITEMENT:\n• Rinçage nasal salin\n• Antihistaminiques\n• Décongestionnants\n• Antibiotiques si bactérienne\n\n🚨 Consultez si persistant",
    specialty: 'Médecine Générale'
  },
  {
    id: 24,
    name: 'Bronchite',
    keywords: ['bronchite', 'bronchitis', 'bronchique'],
    emoji: '🫁',
    info: "BRONCHITE - Informations médicales:\n\nInflammation des bronches.\n\n⚠️ SYMPTÔMES:\n• Toux persistante (2-3 semaines)\n• Expectoration\n• Essoufflement léger\n• Gêne thoracique\n• Fièvre modérée\n\n💊 TRAITEMENT:\n• Repos\n• Hydratation\n• Expectorants\n• Antibiotiques si bactérienne\n\n🚨 Consultez si grave",
    specialty: 'Médecine Générale'
  },
  {
    id: 25,
    name: 'Verrues',
    keywords: ['verrue', 'wart', 'viral', 'excroissance'],
    emoji: '⚫',
    info: "VERRUES - Informations médicales:\n\nCroissances bénignes dues au HPV.\n\n⚠️ TYPES:\n• Verrues communes\n• Verrues plantaires\n• Verrues génitales\n\n💊 TRAITEMENT:\n• Acide salicylique\n• Cryothérapie\n• Laser\n• Électrocautérisation\n\n⏱️ Disparition spontanée possible\n\n🚨 Consultez si gênantes",
    specialty: 'Dermatologie'
  },
];

// ===== SHOW DISEASES MENU =====
const displayDiseasesMenu = (): string => {
  let response = `📋 LISTE DES MALADIES & SYMPTÔMES:\n\nTapez le numéro ou le nom de la maladie:\n\n`;
  
  DISEASES_DATABASE.forEach((disease, index) => {
    response += `${index + 1}. ${disease.emoji} ${disease.name}\n`;
  });
  
  response += `\nExemple: Tapez "1" ou "Fièvre"\n`;
  return response;
};

export default function Chatbot() {
  useEffect(() => {
    let bookingState = {
      step: null as string | null,
      doctor: null as any,
      patientName: '',
      patientLastName: '',
      patientEmail: '',
      patientReason: ''
    };

    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotInput = document.getElementById('chatbot-input') as HTMLInputElement;
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotToggle || !chatbotWindow) return;

    const loadChatHistory = () => {
      const history = sessionStorage.getItem('medcal_chat_history');
      if (history && chatbotMessages) {
        chatbotMessages.innerHTML = history;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
    };

    const saveChatHistory = () => {
      if (chatbotMessages) {
        sessionStorage.setItem('medcal_chat_history', chatbotMessages.innerHTML);
      }
    };

    const saveAppointment = (appointment: any) => {
      const appointments = JSON.parse(localStorage.getItem('medcal_appointments') || '[]');
      appointments.push({ ...appointment, id: Date.now() });
      localStorage.setItem('medcal_appointments', JSON.stringify(appointments));
    };

    // ===== AFFICHER TOUS LES MÉDECINS =====
    const displayAllDoctors = (): string => {
      let response = `✅ TOUS LES MÉDECINS DISPONIBLES:\n\n`;
      
      DOCTORS_DATABASE.forEach(doc => {
        response += `${doc.available ? '✅' : '❌'} ${doc.name}\n`;
        response += `📋 ${doc.specialty}\n`;
        if (doc.available) {
          response += `⏰ Créneaux: ${doc.slots.join(', ')}\n`;
        }
        response += `📞 ${doc.phone}\n📧 ${doc.email}\n\n`;
      });
      
      response += `📅 Pour prendre rendez-vous, dites: "Rendez-vous avec Dr. [NOM]"`;
      return response;
    };

    // ===== DETECT DISEASE =====
    const detectDisease = (input: string): string | null => {
      // Check by number (1-25)
      const num = parseInt(input);
      if (num >= 1 && num <= DISEASES_DATABASE.length) {
        const disease = DISEASES_DATABASE[num - 1];
        return `${disease.emoji} ${disease.name}\n\n${disease.info}\n\n👨‍⚕️ Médecin recommandé: ${disease.specialty}`;
      }

      // Check by keywords
      for (const disease of DISEASES_DATABASE) {
        for (const keyword of disease.keywords) {
          if (input.includes(keyword)) {
            return `${disease.emoji} ${disease.name}\n\n${disease.info}\n\n👨‍⚕️ Médecin recommandé: ${disease.specialty}`;
          }
        }
      }

      return null;
    };

    const extractSpecialty = (message: string): string | null => {
      const input = message.toLowerCase();
      const specialtyMap: {[key: string]: string} = {
        'cardio': 'Cardiologie',
        'coeur': 'Cardiologie',
        'derma': 'Dermatologie',
        'peau': 'Dermatologie',
        'neuro': 'Neurologie',
        'cerveau': 'Neurologie',
        'pediatr': 'Pediatrie',
        'enfant': 'Pediatrie',
        'chirur': 'Chirurgie Générale',
        'gastro': 'Gastroenterologie',
        'digestion': 'Gastroenterologie',
        'general': 'Médecine Générale',
      };

      for (const [keyword, specialty] of Object.entries(specialtyMap)) {
        if (input.includes(keyword)) {
          return specialty;
        }
      }
      return null;
    };

    const displayDoctorsBySpecialty = (specialty: string): string => {
      const doctors = DOCTORS_DATABASE.filter(d => 
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );

      if (doctors.length === 0) {
        return `❌ Aucun médecin trouvé en ${specialty}.\n\n👨‍⚕️ Essayez une autre spécialité!`;
      }

      let response = `✅ MÉDECINS DISPONIBLES EN ${specialty.toUpperCase()}:\n\n`;
      doctors.forEach(doc => {
        response += `${doc.available ? '✅' : '❌'} Dr. ${doc.name.split(' ').pop()}\n`;
        if (doc.available) response += `⏰ Créneaux: ${doc.slots.join(', ')}\n`;
        response += `📞 ${doc.phone}\n\n`;
      });
      response += `📅 Pour prendre rendez-vous, dites: "Rendez-vous avec Dr. [NOM]"`;
      return response;
    };

    const handleBooking = (message: string): string => {
      const match = message.match(/avec\s+(.+?)(?:\s+pour|\s+à|\s+le|\s+$)/i) || 
                    message.match(/avec\s+(.+?)$/i);
      
      if (!match) {
        return "❌ Veuillez spécifier le nom du médecin.\n\nExemple: 'Rendez-vous avec Dr. Ahmed Hassan'";
      }

      let doctorName = match[1].trim().replace(/^dr\.?\s*/i, '');

      const doctor = DOCTORS_DATABASE.find(d => 
        d.name.toLowerCase().includes(doctorName.toLowerCase())
      );
      
      if (!doctor) {
        return `❌ Médecin "${doctorName}" non trouvé.\n\nMédecins disponibles:\n${DOCTORS_DATABASE.map(d => `• ${d.name}`).join('\n')}`;
      }

      if (!doctor.available) {
        return `❌ Le Dr. ${doctor.name.split(' ').pop()} n'est pas disponible actuellement.\n\nVoulez-vous un autre médecin?`;
      }

      bookingState = { 
        step: 'name', 
        doctor: doctor,
        patientName: '',
        patientLastName: '',
        patientEmail: '',
        patientReason: ''
      };

      return `📝 FORMULAIRE DE RENDEZ-VOUS\n\n🏥 Médecin: Dr. ${doctor.name}\n📋 Spécialité: ${doctor.specialty}\n\n1️⃣ Quel est votre PRÉNOM?\n(Exemple: Jean)`;
    };

    const handlePatientInfoStep = (message: string): string => {
      if (bookingState.step === 'name') {
        bookingState.patientName = message;
        bookingState.step = 'lastname';
        return `✅ Merci ${message}!\n\n2️⃣ Quel est votre NOM DE FAMILLE?\n(Exemple: Dupont)`;
      }

      if (bookingState.step === 'lastname') {
        bookingState.patientLastName = message;
        bookingState.step = 'email';
        return `✅ ${bookingState.patientName} ${message}\n\n3️⃣ Quel est votre ADRESSE EMAIL?\n(Exemple: jean.dupont@gmail.com)`;
      }

      if (bookingState.step === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(message)) {
          return `❌ Email invalide!\n\nFormat correct: jean@gmail.com\n\nRéessayez:`;
        }
        bookingState.patientEmail = message;
        bookingState.step = 'reason';
        return `✅ Email enregistré!\n\n4️⃣ RAISON DE VOTRE VISITE?\n(Courte description de vos symptômes)`;
      }

      if (bookingState.step === 'reason') {
        const appointment = {
          doctorName: bookingState.doctor.name,
          specialty: bookingState.doctor.specialty,
          doctorPhone: bookingState.doctor.phone,
          doctorEmail: bookingState.doctor.email,
          patientName: `${bookingState.patientName} ${bookingState.patientLastName}`,
          patientEmail: bookingState.patientEmail,
          reason: message,
          slot: bookingState.doctor.slots[0],
          date: new Date().toLocaleDateString('fr-FR'),
        };

        saveAppointment(appointment);

        const response = `✅ ✅ ✅ RENDEZ-VOUS CONFIRMÉ! ✅ ✅ ✅\n\n👨‍⚕️ Dr. ${bookingState.doctor.name}\n📋 ${bookingState.doctor.specialty}\n⏰ ${bookingState.doctor.slots[0]}\n📅 ${new Date().toLocaleDateString('fr-FR')}\n\n👤 Patient: ${bookingState.patientName} ${bookingState.patientLastName}\n📧 ${bookingState.patientEmail}\n💭 Raison: ${message}\n\n✉️ Confirmation envoyée à: ${bookingState.patientEmail}\n\n🏥 Merci d'avoir choisi Medcal! ❤️`;

        bookingState = {
          step: null,
          doctor: null,
          patientName: '',
          patientLastName: '',
          patientEmail: '',
          patientReason: ''
        };

        return response;
      }

      return "Erreur";
    };

    const getResponse = (message: string): string => {
      const input = message.toLowerCase().trim();

      // Si en cours de booking
      if (bookingState.step !== null) {
        return handlePatientInfoStep(input);
      }

      // ✅ AFFICHER MENU MALADIES - CHECK FIRST!
      if (input.includes('maladie') || input.includes('maladies') || input.includes('symptômes') || input.includes('symptomes') || input.includes('maux') || input.includes('problème') || input.includes('probleme') || input === 'maladie') {
        return displayDiseasesMenu();
      }

      // ✅ VOIR TOUS LES MÉDECINS - CHECK BEFORE BOOKING
      if (input.includes('tous') && (input.includes('médecin') || input.includes('medecin')) || (input.includes('liste') && (input.includes('médecin') || input.includes('medecin'))) || (input.includes('medecin') && input.includes('dispo')) || (input.includes('médecin') && input.includes('dispo'))) {
        return displayAllDoctors();
      }

      // ✅ DÉTECTE MALADIE/SYMPTÔME
      const diseaseResponse = detectDisease(input);
      if (diseaseResponse) {
        return diseaseResponse;
      }

      // Recherche médecin par spécialité - BEFORE booking
      if ((input.includes('trouvez') || input.includes('trouver') || input.includes('voir') || input.includes('consulter') || input.includes('médecin') || input.includes('medecin')) && !input.includes('avec')) {
        const specialty = extractSpecialty(input);
        if (specialty) {
          return displayDoctorsBySpecialty(specialty);
        }
        return `👨‍⚕️ SPÉCIALITÉS DISPONIBLES:\n• Cardiologie (coeur)\n• Dermatologie (peau)\n• Neurologie (cerveau/migraines)\n• Pédiatrie (enfants)\n• Chirurgie Générale\n• Gastroentérologie (digestion)\n• Médecine Générale\n\nQuelle spécialité cherchez-vous?`;
      }

      // Booking - LAST
      if (input.includes('rendez-vous') || input.includes('rendez vous') || input.includes('appointment')) {
        return handleBooking(input);
      }

      // Greetings
      if (input.includes('bonjour') || input.includes('hello') || input.includes('salut') || input.includes('hi')) {
        return `👋 Bonjour! Je suis votre Assistant Médical Medcal!\n\n🏥 COMMENT M'UTILISER:\n\n💊 MALADIES (25+):\n• Tapez "maladie" pour voir la liste\n• Ou dites votre symptôme\n\n👨‍⚕️ MÉDECINS:\n• 'Trouvez un cardiologue'\n• 'Voir tous les médecins'\n\n📅 RENDEZ-VOUS:\n• 'Rendez-vous avec Dr. Ahmed Hassan'`;
      }

      if (input.includes('aide') || input.includes('help')) {
        return `📞 AIDE - COMMENT M'UTILISER:\n\n1️⃣ MALADIES & SYMPTÔMES:\nTapez "maladie" pour lister 25+ maladies\nOu tapez le numéro (1-25) ou le nom\n\n2️⃣ CHERCHEZ UN MÉDECIN:\n• 'Trouvez un cardiologue'\n• 'Voir tous les médecins'\n\n3️⃣ PRENEZ RENDEZ-VOUS:\nDites: 'Rendez-vous avec Dr. [Nom]'\n\n4️⃣ QUESTIONS:\nPoser vos questions médicales!`;
      }

      return `🤖 Je peux vous aider avec:\n\n💊 MALADIES: Tapez "maladie"\n👨‍⚕️ MÉDECINS: Cherchez une spécialité\n📅 RENDEZ-VOUS: Prenez un rendez-vous\n\nQue puis-je faire pour vous?`;
    };

    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('hidden');
      if (!chatbotWindow.classList.contains('hidden')) {
        chatbotInput?.focus();
        loadChatHistory();
      }
    });

    if (chatbotClose) {
      chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
      });
    }

    const sendMessage = () => {
      const message = chatbotInput?.value.trim();
      if (!message || !chatbotMessages) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'chatbot-message user';
      userMsg.innerHTML = `<p>${message}</p>`;
      chatbotMessages.appendChild(userMsg);

      if (chatbotInput) chatbotInput.value = '';

      setTimeout(() => {
        const response = getResponse(message);
        const botMsg = document.createElement('div');
        botMsg.className = 'chatbot-message bot';
        botMsg.innerHTML = `<p>${response.replace(/\n/g, '<br>')}</p>`;
        chatbotMessages.appendChild(botMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        saveChatHistory();
      }, 500);

      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    if (chatbotSend) {
      chatbotSend.addEventListener('click', sendMessage);
    }

    if (chatbotInput) {
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    loadChatHistory();
  }, []);

  return (
    <>
      <style>{`
        #chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .chatbot-floating-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1f4ea3 0%, #3b7bd5 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(31, 78, 163, 0.4);
          transition: all 0.3s ease;
          padding: 0;
        }

        .chatbot-floating-btn:hover {
          background: linear-gradient(135deg, #163a7d 0%, #2d5fa8 100%);
          box-shadow: 0 6px 16px rgba(31, 78, 163, 0.6);
          transform: scale(1.1);
        }

        .chatbot-floating-btn svg {
          width: 28px;
          height: 28px;
        }

        .chatbot-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          opacity: 1;
          overflow: hidden;
        }

        .chatbot-window.hidden {
          display: none;
          opacity: 0;
        }

        .chatbot-header {
          background: linear-gradient(135deg, #1f4ea3 0%, #3b7bd5 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8f9fa;
        }

        .chatbot-message {
          display: flex;
          margin-bottom: 8px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chatbot-message.user {
          justify-content: flex-end;
        }

        .chatbot-message p {
          margin: 0;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.6;
          max-width: 90%;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .chatbot-message.user p {
          background: linear-gradient(135deg, #1f4ea3 0%, #3b7bd5 100%);
          color: white;
        }

        .chatbot-message.bot p {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
        }

        .chatbot-input-wrapper {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: white;
          border-top: 1px solid #e0e0e0;
          flex-shrink: 0;
        }

        .chatbot-input {
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
          outline: none;
        }

        .chatbot-input:focus {
          border-color: #1f4ea3;
          box-shadow: 0 0 0 3px rgba(31, 78, 163, 0.1);
        }

        .chatbot-send-btn {
          background: linear-gradient(135deg, #1f4ea3 0%, #3b7bd5 100%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: bold;
        }

        .chatbot-send-btn:hover {
          background: linear-gradient(135deg, #163a7d 0%, #2d5fa8 100%);
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 20px);
            height: 70vh;
            bottom: 70px;
            right: 10px;
          }
        }
      `}</style>

      <div id="chatbot-container">
        <button id="chatbot-toggle" className="chatbot-floating-btn" title="Ouvrir le chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <div id="chatbot-window" className="chatbot-window hidden">
          <div className="chatbot-header">
            <h3>Medcal Assistant 🩺</h3>
            <button id="chatbot-close" className="chatbot-close-btn">✕</button>
          </div>
          <div id="chatbot-messages" className="chatbot-messages">
            <div className="chatbot-message bot">
              <p>👋 Bonjour! Je suis votre Assistant Médical Medcal!<br/><br/>💊 Décrivez vos symptômes<br/>👨‍⚕️ Cherchez un médecin<br/>📅 Prenez rendez-vous</p>
            </div>
          </div>
          <div className="chatbot-input-wrapper">
            <input 
              type="text" 
              id="chatbot-input" 
              className="chatbot-input" 
              placeholder="Votre message..." 
            />
            <button id="chatbot-send" className="chatbot-send-btn">➤</button>
          </div>
        </div>
      </div>
    </>
  );
}