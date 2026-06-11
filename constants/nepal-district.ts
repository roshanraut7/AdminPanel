export type NepalDistrict = {
  key: string;
  name: string;
  province: string;
};

export const NEPAL_DISTRICTS: NepalDistrict[] = [
  // Koshi Province
  { key: "bhojpur", name: "Bhojpur", province: "Koshi" },
  { key: "dhankuta", name: "Dhankuta", province: "Koshi" },
  { key: "ilam", name: "Ilam", province: "Koshi" },
  { key: "jhapa", name: "Jhapa", province: "Koshi" },
  { key: "khotang", name: "Khotang", province: "Koshi" },
  { key: "morang", name: "Morang", province: "Koshi" },
  { key: "okhaldhunga", name: "Okhaldhunga", province: "Koshi" },
  { key: "panchthar", name: "Panchthar", province: "Koshi" },
  { key: "sankhuwasabha", name: "Sankhuwasabha", province: "Koshi" },
  { key: "solukhumbu", name: "Solukhumbu", province: "Koshi" },
  { key: "sunsari", name: "Sunsari", province: "Koshi" },
  { key: "taplejung", name: "Taplejung", province: "Koshi" },
  { key: "terhathum", name: "Terhathum", province: "Koshi" },
  { key: "udayapur", name: "Udayapur", province: "Koshi" },

  // Madhesh Province
  { key: "bara", name: "Bara", province: "Madhesh" },
  { key: "dhanusha", name: "Dhanusha", province: "Madhesh" },
  { key: "mahottari", name: "Mahottari", province: "Madhesh" },
  { key: "parsa", name: "Parsa", province: "Madhesh" },
  { key: "rautahat", name: "Rautahat", province: "Madhesh" },
  { key: "saptari", name: "Saptari", province: "Madhesh" },
  { key: "sarlahi", name: "Sarlahi", province: "Madhesh" },
  { key: "siraha", name: "Siraha", province: "Madhesh" },

  // Bagmati Province
  { key: "bhaktapur", name: "Bhaktapur", province: "Bagmati" },
  { key: "chitwan", name: "Chitwan", province: "Bagmati" },
  { key: "dhading", name: "Dhading", province: "Bagmati" },
  { key: "dolakha", name: "Dolakha", province: "Bagmati" },
  { key: "kathmandu", name: "Kathmandu", province: "Bagmati" },
  { key: "kavrepalanchok", name: "Kavrepalanchok", province: "Bagmati" },
  { key: "lalitpur", name: "Lalitpur", province: "Bagmati" },
  { key: "makwanpur", name: "Makwanpur", province: "Bagmati" },
  { key: "nuwakot", name: "Nuwakot", province: "Bagmati" },
  { key: "ramechhap", name: "Ramechhap", province: "Bagmati" },
  { key: "rasuwa", name: "Rasuwa", province: "Bagmati" },
  { key: "sindhuli", name: "Sindhuli", province: "Bagmati" },
  { key: "sindhupalchok", name: "Sindhupalchok", province: "Bagmati" },

  // Gandaki Province
  { key: "baglung", name: "Baglung", province: "Gandaki" },
  { key: "gorkha", name: "Gorkha", province: "Gandaki" },
  { key: "kaski", name: "Kaski", province: "Gandaki" },
  { key: "lamjung", name: "Lamjung", province: "Gandaki" },
  { key: "manang", name: "Manang", province: "Gandaki" },
  { key: "mustang", name: "Mustang", province: "Gandaki" },
  { key: "myagdi", name: "Myagdi", province: "Gandaki" },
  { key: "nawalpur", name: "Nawalpur", province: "Gandaki" },
  { key: "parbat", name: "Parbat", province: "Gandaki" },
  { key: "syangja", name: "Syangja", province: "Gandaki" },
  { key: "tanahun", name: "Tanahun", province: "Gandaki" },

  // Lumbini Province
  { key: "arghakhanchi", name: "Arghakhanchi", province: "Lumbini" },
  { key: "banke", name: "Banke", province: "Lumbini" },
  { key: "bardiya", name: "Bardiya", province: "Lumbini" },
  { key: "dang", name: "Dang", province: "Lumbini" },
  { key: "gulmi", name: "Gulmi", province: "Lumbini" },
  { key: "kapilvastu", name: "Kapilvastu", province: "Lumbini" },
  { key: "parasi", name: "Parasi", province: "Lumbini" },
  { key: "palpa", name: "Palpa", province: "Lumbini" },
  { key: "pyuthan", name: "Pyuthan", province: "Lumbini" },
  { key: "rolpa", name: "Rolpa", province: "Lumbini" },
  { key: "rukum-east", name: "Rukum East", province: "Lumbini" },
  { key: "rupandehi", name: "Rupandehi", province: "Lumbini" },

  // Karnali Province
  { key: "dailekh", name: "Dailekh", province: "Karnali" },
  { key: "dolpa", name: "Dolpa", province: "Karnali" },
  { key: "humla", name: "Humla", province: "Karnali" },
  { key: "jajarkot", name: "Jajarkot", province: "Karnali" },
  { key: "jumla", name: "Jumla", province: "Karnali" },
  { key: "kalikot", name: "Kalikot", province: "Karnali" },
  { key: "mugu", name: "Mugu", province: "Karnali" },
  { key: "rukum-west", name: "Rukum West", province: "Karnali" },
  { key: "salyan", name: "Salyan", province: "Karnali" },
  { key: "surkhet", name: "Surkhet", province: "Karnali" },

  // Sudurpashchim Province
  { key: "achham", name: "Achham", province: "Sudurpashchim" },
  { key: "baitadi", name: "Baitadi", province: "Sudurpashchim" },
  { key: "bajhang", name: "Bajhang", province: "Sudurpashchim" },
  { key: "bajura", name: "Bajura", province: "Sudurpashchim" },
  { key: "dadeldhura", name: "Dadeldhura", province: "Sudurpashchim" },
  { key: "darchula", name: "Darchula", province: "Sudurpashchim" },
  { key: "doti", name: "Doti", province: "Sudurpashchim" },
  { key: "kailali", name: "Kailali", province: "Sudurpashchim" },
  { key: "kanchanpur", name: "Kanchanpur", province: "Sudurpashchim" },
];