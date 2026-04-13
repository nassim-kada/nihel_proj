export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
}

export const WILAYAS: Wilaya[] = [
  { code: "01", name: "Adrar", communes: ["Adrar", "Reggane", "Timimoun", "Aoulef", "Tsabit", "Zaouiet Kounta"] },
  { code: "02", name: "Chlef", communes: ["Chlef", "Ténès", "Boukadir", "Ain Merane", "Oued Fodda", "El Karimia"] },
  { code: "03", name: "Laghouat", communes: ["Laghouat", "Aflou", "Ksar El Hirane", "Gueltat Sidi Saad", "Brida"] },
  { code: "04", name: "Oum El Bouaghi", communes: ["Oum El Bouaghi", "Ain Beida", "Ain Mlila", "Ain Kercha", "El Amiria", "Meskiana"] },
  { code: "05", name: "Batna", communes: ["Batna", "Barika", "Ain Touta", "Arris", "Merouana", "Timgad", "N'gaous"] },
  { code: "06", name: "Béjaïa", communes: ["Béjaïa", "Akbou", "Aokas", "Kherrata", "Sidi Aich", "Amizour", "Tichy"] },
  { code: "07", name: "Biskra", communes: ["Biskra", "Tolga", "Ouled Djellal", "El Kantara", "Sidi Okba", "Zeribet El Oued"] },
  { code: "08", name: "Béchar", communes: ["Béchar", "Abadla", "Beni Ounif", "Kenadsa", "Tabelbala"] },
  { code: "09", name: "Blida", communes: ["Blida", "Boufarik", "Meftah", "Bou Arfa", "Larbaa", "Ouled Yaich", "Chebli"] },
  { code: "10", name: "Bouira", communes: ["Bouira", "Lakhdaria", "Sour El Ghouzlane", "Ain Bessem", "El Adjiba", "Haizer"] },
  { code: "11", name: "Tamanrasset", communes: ["Tamanrasset", "In Salah", "In Guezzam", "Abalessa", "Tazrouk"] },
  { code: "12", name: "Tébessa", communes: ["Tébessa", "Bir El Ater", "Cheria", "El Aouinet", "Ouenza", "El Ogla"] },
  { code: "13", name: "Tlemcen", communes: ["Tlemcen", "Maghnia", "Ghazaouet", "Bab El Assa", "Nedroma", "Remchi", "Hennaya"] },
  { code: "14", name: "Tiaret", communes: ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mehdia", "Ain Kermes"] },
  { code: "15", name: "Tizi Ouzou", communes: ["Tizi Ouzou", "Azazga", "Draa Ben Khedda", "Ain El Hammam", "Boghni", "Tigzirt", "Mekla"] },
  { code: "16", name: "Alger", communes: ["Alger Centre", "Bab El Oued", "Hussein Dey", "El Harrach", "Birkhadem", "Dar El Beida", "Rouiba", "Kouba", "Bouzareah", "Cheraga", "Draria", "Bab Ezzouar", "Ben Aknoun", "Bordj El Kiffan", "El Biar", "Hydra", "Bir Mourad Rais", "Dely Ibrahim"] },
  { code: "17", name: "Djelfa", communes: ["Djelfa", "Ain Oussera", "Messaad", "Birine", "Hassi Bahbah", "Faidh El Botma"] },
  { code: "18", name: "Jijel", communes: ["Jijel", "Taher", "El Milia", "Ziama Mansouriah", "Sidi Maarouf"] },
  { code: "19", name: "Sétif", communes: ["Sétif", "El Eulma", "Ain El Kebira", "Maoklane", "Ain Oulmene", "Bougaa", "Ain Azel"] },
  { code: "20", name: "Saïda", communes: ["Saïda", "Ain El Hadjar", "Youb", "Sidi Boubekeur", "El Hassasna"] },
  { code: "21", name: "Skikda", communes: ["Skikda", "Azzaba", "Collo", "Ain Charchar", "El Harrouch", "Ben Azzouz"] },
  { code: "22", name: "Sidi Bel Abbès", communes: ["Sidi Bel Abbès", "Tessala", "Telagh", "Ben Badis", "Sidi Brahim"] },
  { code: "23", name: "Annaba", communes: ["Annaba", "El Hadjar", "Berrahal", "El Bouni", "Ain Berda", "Chetaibi"] },
  { code: "24", name: "Guelma", communes: ["Guelma", "Bouchegouf", "Oued Zenati", "Heliopolis", "Ain Makhlouf"] },
  { code: "25", name: "Constantine", communes: ["Constantine", "El Khroub", "Ain Smara", "Hamma Bouziane", "Didouche Mourad", "Ibn Ziad"] },
  { code: "26", name: "Médéa", communes: ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Ain Boucif", "El Omaria", "Tablat"] },
  { code: "27", name: "Mostaganem", communes: ["Mostaganem", "Ain Nouissy", "Mesra", "Sidi Ali", "Achaacha", "Hadjadj"] },
  { code: "28", name: "M'Sila", communes: ["M'Sila", "Bou Saada", "Sidi Aissa", "Ain El Melh", "Djebel Messaad"] },
  { code: "29", name: "Mascara", communes: ["Mascara", "Sig", "Tighennif", "Ain Fares", "Ghriss", "Mohammadia"] },
  { code: "30", name: "Ouargla", communes: ["Ouargla", "Hassi Messaoud", "Touggourt", "Ain Beida Sahara", "Temacine"] },
  { code: "31", name: "Oran", communes: ["Oran", "Es Senia", "Bir El Djir", "El Kerma", "Ain El Turck", "Bethioua", "Arzew"] },
  { code: "32", name: "El Bayadh", communes: ["El Bayadh", "Brezina", "Bougtob", "Chellala"] },
  { code: "33", name: "Illizi", communes: ["Illizi", "In Amenas", "Djanet", "Bordj Omar Driss"] },
  { code: "34", name: "Bordj Bou Arréridj", communes: ["Bordj Bou Arréridj", "Ras El Oued", "El Anseur", "Bir Kasdali", "Bordj Ghedir"] },
  { code: "35", name: "Boumerdès", communes: ["Boumerdès", "Khemis El Khechna", "Boudouaou", "Bordj Menaiel", "Dellys", "Tidjelabine"] },
  { code: "36", name: "El Tarf", communes: ["El Tarf", "Ben M'Hidi", "Besbes", "Chebaita Mokhtar", "Lac des Oiseaux"] },
  { code: "37", name: "Tindouf", communes: ["Tindouf", "Oum El Assel"] },
  { code: "38", name: "Tissemsilt", communes: ["Tissemsilt", "Theniet El Had", "Khemisti", "Bordj Emir Abdelkader"] },
  { code: "39", name: "El Oued", communes: ["El Oued", "Guemar", "Robbah", "Kouinine", "Debila", "Magrane"] },
  { code: "40", name: "Khenchela", communes: ["Khenchela", "Ain Touila", "Bouhmama", "Chechar", "El Hamma"] },
  { code: "41", name: "Souk Ahras", communes: ["Souk Ahras", "Sedrata", "Mechroha", "Bir Bou Houri", "Ouled Driss"] },
  { code: "42", name: "Tipaza", communes: ["Tipaza", "Koléa", "Cherchell", "Ahmar El Ain", "Gouraya", "Hadjout"] },
  { code: "43", name: "Mila", communes: ["Mila", "Ferdjioua", "Chelghoum Laid", "Ain Mlila", "Tassadane Haddada"] },
  { code: "44", name: "Ain Defla", communes: ["Ain Defla", "Miliana", "Khemis Miliana", "El Attaf", "Ain Lechiakh"] },
  { code: "45", name: "Naâma", communes: ["Naâma", "Mekmen Ben Amar", "Ain Sefra", "Sfissifa", "Tiout"] },
  { code: "46", name: "Ain Témouchent", communes: ["Ain Témouchent", "Hammam Bou Hadjar", "Beni Saf", "El Amria", "Aghlal"] },
  { code: "47", name: "Ghardaïa", communes: ["Ghardaïa", "Metlili", "El Meniaa", "Berriane", "Zelfana"] },
  { code: "48", name: "Relizane", communes: ["Relizane", "Mazouna", "Oued Rhiou", "Yellel", "Zemmoura"] },
  { code: "49", name: "Timimoun", communes: ["Timimoun", "Aougrout", "Charouine", "Deldoul"] },
  { code: "50", name: "Bordj Badji Mokhtar", communes: ["Bordj Badji Mokhtar", "Timiaouine"] },
  { code: "51", name: "Ouled Djellal", communes: ["Ouled Djellal", "Doucen", "Ras El Miad"] },
  { code: "52", name: "Béni Abbès", communes: ["Béni Abbès", "Ksabi", "Igli", "Ouled Khoudir"] },
  { code: "53", name: "In Salah", communes: ["In Salah", "Foggaret Ezzaouia", "In Ghar"] },
  { code: "54", name: "In Guezzam", communes: ["In Guezzam", "Tin Zaouatine"] },
  { code: "55", name: "Touggourt", communes: ["Touggourt", "Temacine", "Nezla", "Monguel"] },
  { code: "56", name: "Djanet", communes: ["Djanet", "Bordj El Haouasse"] },
  { code: "57", name: "El M'Ghair", communes: ["El M'Ghair", "Djamaa", "Sidi Khaled"] },
  { code: "58", name: "El Meniaa", communes: ["El Meniaa", "Hassi Gara"] },
];

export const getWilayaNames = (): string[] => WILAYAS.map((w) => w.name);

export const getCommunesByWilaya = (wilayaName: string): string[] => {
  const wilaya = WILAYAS.find((w) => w.name === wilayaName);
  return wilaya ? wilaya.communes : [];
};
