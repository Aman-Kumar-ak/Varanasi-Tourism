import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../lib/db.js';
import Jyotirlinga from '../models/Jyotirlinga.js';
import DarshanType from '../models/DarshanType.js';
import TimeSlot from '../models/TimeSlot.js';
import City from '../models/City.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// 12 Jyotirlingas data
const jyotirlingasData = [
  {
    name: {
      en: 'Somnath',
      hi: 'सोमनाथ',
      gu: 'સોમનાથ',
      ta: 'சோமநாதர்',
      te: 'సోమనాథ్',
      mr: 'सोमनाथ',
      bn: 'সোমনাথ',
      kn: 'ಸೋಮನಾಥ',
      ml: 'സോമനാഥ്',
      or: 'ସୋମନାଥ',
      pa: 'ਸੋਮਨਾਥ',
      as: 'সোমনাথ',
      ur: 'سومناتھ',
    },
    city: 'Prabhas Patan',
    state: 'Gujarat',
    stateCode: 'GJ',
    location: { lat: 20.8876, lng: 70.4010 },
    pageTemplate: 'somnath',
    templeRules: [
      'Remove footwear before entering the temple',
      'Maintain silence inside the sanctum',
      'Photography is restricted in certain areas',
      'Follow the queue system for darshan',
    ],
    nearbyPlaces: ['Prabhas Patan Beach', 'Triveni Sangam', 'Bhalka Tirth'],
    displayOrder: 1,
  },
  {
    name: {
      en: 'Mallikarjuna',
      hi: 'मल्लिकार्जुन',
      te: 'మల్లికార్జున',
      ta: 'மல்லிகார்ஜுனர்',
      kn: 'ಮಲ್ಲಿಕಾರ್ಜುನ',
      ml: 'മല്ലികാർജുന',
    },
    city: 'Srisailam',
    state: 'Andhra Pradesh',
    stateCode: 'AP',
    location: { lat: 16.0748, lng: 78.8686 },
    pageTemplate: 'mallikarjuna',
    templeRules: [
      'Dress modestly',
      'No photography inside the sanctum',
      'Follow the designated path',
      'Respect the temple traditions',
    ],
    nearbyPlaces: ['Krishna River', 'Srisailam Dam', 'Akkamahadevi Caves'],
    displayOrder: 2,
  },
  {
    name: {
      en: 'Mahakaleshwar',
      hi: 'महाकालेश्वर',
      mr: 'महाकालेश्वर',
      gu: 'મહાકાળેશ્વર',
    },
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    location: { lat: 23.1828, lng: 75.7683 },
    pageTemplate: 'mahakaleshwar',
    templeRules: [
      'Attend the Bhasma Aarti early morning',
      'Maintain decorum during rituals',
      'No leather items allowed',
      'Follow the queue system',
    ],
    nearbyPlaces: ['Kshipra River', 'Kal Bhairav Temple', 'Harsiddhi Temple'],
    displayOrder: 3,
  },
  {
    name: {
      en: 'Omkareshwar',
      hi: 'ओंकारेश्वर',
      mr: 'ओंकारेश्वर',
      gu: 'ઓંકારેશ્વર',
    },
    city: 'Omkareshwar',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    location: { lat: 22.2456, lng: 76.1500 },
    pageTemplate: 'omkareshwar',
    templeRules: [
      'Take a boat ride to reach the temple',
      'Respect the natural surroundings',
      'No plastic items',
      'Maintain silence',
    ],
    nearbyPlaces: ['Narmada River', 'Mamleshwar Temple', 'Siddhanath Temple'],
    displayOrder: 4,
  },
  {
    name: {
      en: 'Kedarnath',
      hi: 'केदारनाथ',
      gu: 'કેદારનાથ',
      pa: 'ਕੇਦਾਰਨਾਥ',
    },
    city: 'Kedarnath',
    state: 'Uttarakhand',
    stateCode: 'UK',
    location: { lat: 30.7352, lng: 79.0669 },
    pageTemplate: 'kedarnath',
    templeRules: [
      'Physical fitness required for the trek',
      'Carry warm clothing',
      'Respect the mountain environment',
      'Follow safety guidelines',
    ],
    nearbyPlaces: ['Chorabari Tal', 'Gandhi Sarovar', 'Bhairav Temple'],
    displayOrder: 5,
  },
  {
    name: {
      en: 'Bhimashankar',
      hi: 'भीमाशंकर',
      mr: 'भीमाशंकर',
      gu: 'ભીમાશંકર',
    },
    city: 'Bhimashankar',
    state: 'Maharashtra',
    stateCode: 'MH',
    location: { lat: 19.0722, lng: 73.5353 },
    pageTemplate: 'bhimashankar',
    templeRules: [
      'Wear comfortable trekking shoes',
      'Carry water and snacks',
      'Respect the wildlife',
      'Follow forest guidelines',
    ],
    nearbyPlaces: ['Bhimashankar Wildlife Sanctuary', 'Gupt Bhimashankar', 'Hanuman Lake'],
    displayOrder: 6,
  },
  {
    name: {
      en: 'Kashi Vishwanath',
      hi: 'काशी विश्वनाथ',
      bn: 'কাশী বিশ্বনাথ',
      ur: 'کاشی وشوناتھ',
    },
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    location: { lat: 25.3176, lng: 83.0058 },
    pageTemplate: 'kashi-vishwanath',
    templeRules: [
      'Early morning darshan recommended',
      'Respect the Ganga ghats',
      'No photography inside sanctum',
      'Follow security guidelines',
    ],
    nearbyPlaces: ['Ganga Ghats', 'Sarnath', 'Dashashwamedh Ghat'],
    displayOrder: 7,
  },
  {
    name: {
      en: 'Trimbakeshwar',
      hi: 'त्र्यंबकेश्वर',
      mr: 'त्र्यंबकेश्वर',
      gu: 'ત્ર્યંબકેશ્વર',
    },
    city: 'Trimbak',
    state: 'Maharashtra',
    stateCode: 'MH',
    location: { lat: 19.9322, lng: 73.5317 },
    pageTemplate: 'trimbakeshwar',
    templeRules: [
      'Respect the sacred Godavari source',
      'Maintain cleanliness',
      'Follow temple timings',
      'No photography of the lingam',
    ],
    nearbyPlaces: ['Godavari River', 'Brahmagiri Hill', 'Kushavarta Kund'],
    displayOrder: 8,
  },
  {
    name: {
      en: 'Vaidyanath',
      hi: 'वैद्यनाथ',
      bn: 'বৈদ্যনাথ',
      or: 'ବୈଦ୍ୟନାଥ',
    },
    city: 'Deoghar',
    state: 'Jharkhand',
    stateCode: 'JH',
    location: { lat: 24.4820, lng: 86.7036 },
    pageTemplate: 'vaidyanath',
    templeRules: [
      'Respect the temple traditions',
      'Follow the queue system',
      'Maintain decorum',
      'No photography inside sanctum',
    ],
    nearbyPlaces: ['Nandan Pahar', 'Basukinath Temple', 'Tapovan'],
    displayOrder: 9,
  },
  {
    name: {
      en: 'Nageshwar',
      hi: 'नागेश्वर',
      gu: 'નાગેશ્વર',
      mr: 'नागेश्वर',
    },
    city: 'Dwarka',
    state: 'Gujarat',
    stateCode: 'GJ',
    location: { lat: 22.2403, lng: 69.0686 },
    pageTemplate: 'nageshwar',
    templeRules: [
      'Respect the coastal environment',
      'Follow temple timings',
      'Maintain cleanliness',
      'No photography inside sanctum',
    ],
    nearbyPlaces: ['Dwarka Temple', 'Bet Dwarka', 'Gomti Ghat'],
    displayOrder: 10,
  },
  {
    name: {
      en: 'Ramanathaswamy',
      hi: 'रामनाथस्वामी',
      ta: 'ராமநாதசுவாமி',
      te: 'రామనాథస్వామి',
      kn: 'ರಾಮನಾಥಸ್ವಾಮಿ',
      ml: 'രാമനാഥസ്വാമി',
    },
    city: 'Rameshwaram',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    location: { lat: 9.2881, lng: 79.3174 },
    pageTemplate: 'ramanathaswamy',
    templeRules: [
      'Take a dip in the 22 sacred wells',
      'Respect the temple corridors',
      'Dress modestly',
      'Follow the designated path',
    ],
    nearbyPlaces: ['Dhanushkodi', 'Agni Theertham', 'Pamban Bridge'],
    displayOrder: 11,
  },
  {
    name: {
      en: 'Grishneshwar',
      hi: 'गृह्णेश्वर',
      mr: 'गृह्णेश्वर',
      gu: 'ગૃહ્ણેશ્વર',
    },
    city: 'Verul',
    state: 'Maharashtra',
    stateCode: 'MH',
    location: { lat: 20.0256, lng: 75.1792 },
    pageTemplate: 'grishneshwar',
    templeRules: [
      'Visit Ellora Caves nearby',
      'Respect the temple architecture',
      'Maintain decorum',
      'Follow temple timings',
    ],
    nearbyPlaces: ['Ellora Caves', 'Daulatabad Fort', 'Bibi Ka Maqbara'],
    displayOrder: 12,
  },
];

// Darshan types data
const darshanTypesData = [
  {
    name: {
      en: 'General Darshan',
      hi: 'सामान्य दर्शन',
    },
    price: 0,
    duration: 15,
    dailyLimit: 10000,
  },
  {
    name: {
      en: 'Special Darshan',
      hi: 'विशेष दर्शन',
    },
    price: 100,
    duration: 30,
    dailyLimit: 5000,
  },
  {
    name: {
      en: 'VIP Darshan',
      hi: 'वीआईपी दर्शन',
    },
    price: 500,
    duration: 45,
    dailyLimit: 1000,
  },
  {
    name: {
      en: 'Aarti Darshan',
      hi: 'आरती दर्शन',
    },
    price: 200,
    duration: 60,
    dailyLimit: 2000,
  },
];

// Time slots data
const timeSlotsData = [
  { startTime: '06:00', endTime: '08:00', maxBookings: 500 },
  { startTime: '08:00', endTime: '10:00', maxBookings: 800 },
  { startTime: '10:00', endTime: '12:00', maxBookings: 1000 },
  { startTime: '12:00', endTime: '14:00', maxBookings: 800 },
  { startTime: '14:00', endTime: '16:00', maxBookings: 600 },
  { startTime: '16:00', endTime: '18:00', maxBookings: 700 },
  { startTime: '18:00', endTime: '20:00', maxBookings: 500 },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Jyotirlinga.deleteMany({});
    await DarshanType.deleteMany({});
    await TimeSlot.deleteMany({});
    await City.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert Jyotirlingas
    console.log('📝 Inserting Jyotirlingas...');
    const insertedJyotirlingas = await Jyotirlinga.insertMany(jyotirlingasData);
    console.log(`✅ Inserted ${insertedJyotirlingas.length} Jyotirlingas`);

    // Insert Darshan Types and Time Slots ONLY for Kashi Vishwanath
    console.log('📝 Inserting Darshan Types and Time Slots for Kashi Vishwanath...');
    const kashiVishwanath = insertedJyotirlingas.find(
      (j) => j.pageTemplate === 'kashi-vishwanath'
    );
    
    if (kashiVishwanath) {
      // Insert darshan types for Kashi Vishwanath only
      const darshanTypes = await DarshanType.insertMany(
        darshanTypesData.map((darshan) => ({
          ...darshan,
          jyotirlingaId: kashiVishwanath._id,
        }))
      );

      // Insert time slots for each darshan type
      for (const darshanType of darshanTypes) {
        await TimeSlot.insertMany(
          timeSlotsData.map((slot) => ({
            ...slot,
            darshanTypeId: darshanType._id,
          }))
        );
      }
      console.log('✅ Inserted Darshan Types and Time Slots for Kashi Vishwanath');
    } else {
      console.log('⚠️  Kashi Vishwanath not found, skipping darshan types');
    }

    // Insert basic city data
    console.log('📝 Inserting City data...');
    const cityData = insertedJyotirlingas.map((jyotirlinga) => ({
      name: {
        en: jyotirlinga.city,
        hi: jyotirlinga.city,
      },
      jyotirlingaId: jyotirlinga._id,
      state: jyotirlinga.state,
      images: [],
      places: [],
      hotels: [],
      restaurants: [],
      transportInfo: {
        en: `Transport information for ${jyotirlinga.city}`,
        hi: `${jyotirlinga.city} के लिए परिवहन जानकारी`,
      },
      emergencyContacts: [
        {
          name: 'Police',
          phone: '100',
          type: 'police' as const,
        },
        {
          name: 'Hospital',
          phone: '108',
          type: 'hospital' as const,
        },
      ],
    }));

    await City.insertMany(cityData);
    console.log(`✅ Inserted ${cityData.length} Cities`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Jyotirlingas: ${insertedJyotirlingas.length}`);
    console.log(`   - Darshan Types: ${darshanTypesData.length} (Kashi Vishwanath only)`);
    console.log(`   - Time Slots: ${darshanTypesData.length * timeSlotsData.length} (Kashi Vishwanath only)`);
    console.log(`   - Cities: ${cityData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

