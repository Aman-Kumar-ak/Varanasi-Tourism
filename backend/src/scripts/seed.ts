import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../lib/db.js';
import Jyotirlinga from '../models/Jyotirlinga.js';
import DarshanType from '../models/DarshanType.js';
import TimeSlot from '../models/TimeSlot.js';
import City from '../models/City.js';
import { generateSlug } from '../lib/utils.js';

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
    slug: 'somnath',
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
    slug: 'mallikarjuna',
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
    slug: 'mahakaleshwar',
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
    slug: 'omkareshwar',
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
    slug: 'kedarnath',
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
    slug: 'bhimashankar',
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
    slug: 'kashi-vishwanath',
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
    slug: 'trimbakeshwar',
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
    slug: 'vaidyanath',
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
    slug: 'nageshwar',
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
    slug: 'ramanathaswamy',
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
    slug: 'grishneshwar',
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

    // Insert city data with comprehensive Varanasi data
    console.log('📝 Inserting City data...');

    const cityData = insertedJyotirlingas.map((jyotirlinga) => {
      // Special handling for Varanasi
      if (jyotirlinga.city === 'Varanasi' && jyotirlinga.slug === 'kashi-vishwanath') {
        return {
          name: {
            en: 'Varanasi',
            hi: 'वाराणसी',
            bn: 'বারাণসী',
            gu: 'વારાણસી',
            ta: 'வாரணாசி',
            te: 'వారణాసి',
            mr: 'वाराणसी',
            kn: 'ವಾರಣಾಸಿ',
            ml: 'വാരണാസി',
            or: 'ବାରାଣସୀ',
            pa: 'ਵਾਰਾਣਸੀ',
            as: 'ৱাৰাণসী',
            ur: 'وارانسی',
          },
          jyotirlingaId: jyotirlinga._id,
          state: jyotirlinga.state,
          images: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          ],
          places: [
            {
              name: {
                en: 'Dashashwamedh Ghat',
                hi: 'दशाश्वमेध घाट',
              },
              description: {
                en: 'The most famous ghat in Varanasi, known for the spectacular Ganga Aarti ceremony performed every evening. It is believed that Lord Brahma performed ten horse sacrifices here.',
                hi: 'वाराणसी का सबसे प्रसिद्ध घाट, जहाँ हर शाम भव्य गंगा आरती का आयोजन होता है। माना जाता है कि यहाँ भगवान ब्रह्मा ने दस अश्वमेध यज्ञ किए थे।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3106, lng: 83.0104 },
            },
            {
              name: {
                en: 'Assi Ghat',
                hi: 'अस्सी घाट',
              },
              description: {
                en: 'The southernmost ghat in Varanasi, where the Assi River meets the Ganges. A peaceful place for meditation and yoga, especially popular during sunrise.',
                hi: 'वाराणसी का सबसे दक्षिणी घाट, जहाँ अस्सी नदी गंगा से मिलती है। ध्यान और योग के लिए शांतिपूर्ण स्थान, विशेष रूप से सूर्योदय के समय लोकप्रिय।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.2850, lng: 83.0104 },
            },
            {
              name: {
                en: 'Manikarnika Ghat',
                hi: 'मणिकर्णिका घाट',
              },
              description: {
                en: 'The main cremation ghat in Varanasi. Hindus believe that being cremated here ensures moksha (liberation from the cycle of rebirth).',
                hi: 'वाराणसी का मुख्य श्मशान घाट। हिंदुओं का मानना है कि यहाँ अंतिम संस्कार से मोक्ष प्राप्त होता है।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3106, lng: 83.0104 },
            },
            {
              name: {
                en: 'Sarnath',
                hi: 'सारनाथ',
              },
              description: {
                en: 'A sacred Buddhist site where Lord Buddha gave his first sermon after enlightenment. Home to the famous Dhamek Stupa and several ancient monasteries.',
                hi: 'एक पवित्र बौद्ध स्थल जहाँ भगवान बुद्ध ने ज्ञान प्राप्ति के बाद अपना पहला उपदेश दिया था। प्रसिद्ध धमेक स्तूप और कई प्राचीन मठों का घर।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3811, lng: 83.0214 },
            },
            {
              name: {
                en: 'Tulsi Manas Temple',
                hi: 'तुलसी मानस मंदिर',
              },
              description: {
                en: 'A modern temple dedicated to Lord Rama, built where Tulsidas wrote the Ramcharitmanas. The walls are inscribed with verses from the epic.',
                hi: 'भगवान राम को समर्पित एक आधुनिक मंदिर, जहाँ तुलसीदास ने रामचरितमानस लिखी थी। दीवारों पर महाकाव्य के श्लोक अंकित हैं।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3106, lng: 83.0104 },
            },
            {
              name: {
                en: 'Bharat Mata Temple',
                hi: 'भारत माता मंदिर',
              },
              description: {
                en: 'A unique temple dedicated to Mother India, featuring a relief map of undivided India carved in marble. Built by freedom fighter Babu Shiv Prasad Gupt.',
                hi: 'मातृभूमि को समर्पित एक अनूठा मंदिर, जिसमें संगमरमर में उकेरी गई अखंड भारत का राहत नक्शा है। स्वतंत्रता सेनानी बाबू शिव प्रसाद गुप्त द्वारा निर्मित।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3106, lng: 83.0104 },
            },
            {
              name: {
                en: 'Ramnagar Fort',
                hi: 'रामनगर किला',
              },
              description: {
                en: 'An 18th-century fort on the eastern bank of the Ganges, opposite Varanasi. The fort houses a museum with vintage cars, royal costumes, and antique weapons.',
                hi: 'गंगा के पूर्वी तट पर 18वीं सदी का किला, वाराणसी के सामने। किले में एक संग्रहालय है जिसमें विंटेज कारें, शाही वस्त्र और प्राचीन हथियार हैं।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.3106, lng: 83.0104 },
            },
            {
              name: {
                en: 'Banaras Hindu University (BHU)',
                hi: 'काशी हिंदू विश्वविद्यालय (BHU)',
              },
              description: {
                en: 'One of the largest residential universities in Asia, founded by Madan Mohan Malaviya. The campus includes the famous Vishwanath Temple and Bharat Kala Bhavan museum.',
                hi: 'एशिया की सबसे बड़ी आवासीय विश्वविद्यालयों में से एक, मदन मोहन मालवीय द्वारा स्थापित। परिसर में प्रसिद्ध विश्वनाथ मंदिर और भारत कला भवन संग्रहालय शामिल है।',
              },
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
              location: { lat: 25.2677, lng: 82.9913 },
            },
          ],
          hotels: [
            {
              name: 'Hotel Ganges View',
              address: 'Dashashwamedh Ghat Road, Varanasi',
              priceRange: 'mid-range' as const,
              rating: 4.2,
              contact: '+91-542-2312345',
              website: 'https://hotelgangesview.com',
            },
            {
              name: 'BrijRama Palace',
              address: 'Darbhanga Ghat, Varanasi',
              priceRange: 'luxury' as const,
              rating: 4.8,
              contact: '+91-542-2315678',
              website: 'https://brijramapalace.com',
            },
            {
              name: 'Hotel Surya',
              address: 'The Mall, Cantonment, Varanasi',
              priceRange: 'mid-range' as const,
              rating: 4.0,
              contact: '+91-542-2501234',
            },
            {
              name: 'Hotel Alka',
              address: 'D. 38/44, Godowlia, Varanasi',
              priceRange: 'budget' as const,
              rating: 3.8,
              contact: '+91-542-2401681',
            },
            {
              name: 'Taj Ganges Varanasi',
              address: 'Nadesar Palace Grounds, Varanasi',
              priceRange: 'luxury' as const,
              rating: 4.7,
              contact: '+91-542-2503001',
              website: 'https://tajhotels.com',
            },
            {
              name: 'Hotel Pradeep',
              address: 'Dashashwamedh Ghat, Varanasi',
              priceRange: 'budget' as const,
              rating: 3.5,
              contact: '+91-542-2312345',
            },
          ],
          restaurants: [
            {
              name: 'Blue Lassi',
              cuisine: 'Traditional Indian',
              address: 'Kachori Gali, Varanasi',
              priceRange: 'budget' as const,
              contact: '+91-9876543210',
            },
            {
              name: 'Kashi Chat Bhandar',
              cuisine: 'Street Food',
              address: 'Godowlia, Varanasi',
              priceRange: 'budget' as const,
              contact: '+91-9876543211',
            },
            {
              name: 'Bana Lassi',
              cuisine: 'Desserts & Beverages',
              address: 'Dashashwamedh Ghat, Varanasi',
              priceRange: 'budget' as const,
              contact: '+91-9876543212',
            },
            {
              name: 'Deena Chaat Bhandar',
              cuisine: 'Street Food',
              address: 'Kachori Gali, Varanasi',
              priceRange: 'budget' as const,
              contact: '+91-9876543213',
            },
            {
              name: 'Shree Cafe',
              cuisine: 'Multi-cuisine',
              address: 'Dashashwamedh Ghat, Varanasi',
              priceRange: 'mid-range' as const,
              contact: '+91-542-2312345',
            },
            {
              name: 'Varanasi Thali',
              cuisine: 'North Indian',
              address: 'Godowlia, Varanasi',
              priceRange: 'mid-range' as const,
              contact: '+91-542-2312346',
            },
            {
              name: 'Tulsi Restaurant',
              cuisine: 'Vegetarian',
              address: 'Assi Ghat, Varanasi',
              priceRange: 'mid-range' as const,
              contact: '+91-542-2312347',
            },
            {
              name: 'Varuna Restaurant',
              cuisine: 'Fine Dining',
              address: 'Taj Ganges Hotel, Varanasi',
              priceRange: 'luxury' as const,
              contact: '+91-542-2503001',
            },
          ],
          transportInfo: {
            en: 'Varanasi is well-connected by air, rail, and road. The Lal Bahadur Shastri International Airport (VNS) is 26 km from the city. Varanasi Junction (BSB) is the main railway station. Auto-rickshaws, cycle-rickshaws, and boats are common modes of local transport. The ghats are best explored on foot or by boat.',
            hi: 'वाराणसी हवाई, रेल और सड़क मार्ग से अच्छी तरह जुड़ा हुआ है। लाल बहादुर शास्त्री अंतर्राष्ट्रीय हवाई अड्डा (VNS) शहर से 26 किमी दूर है। वाराणसी जंक्शन (BSB) मुख्य रेलवे स्टेशन है। ऑटो-रिक्शा, साइकिल-रिक्शा और नाव स्थानीय परिवहन के सामान्य साधन हैं। घाटों को पैदल या नाव से देखना सबसे अच्छा है।',
          },
          emergencyContacts: [
            {
              name: 'Police Control Room',
              phone: '100',
              type: 'police' as const,
            },
            {
              name: 'Emergency Ambulance',
              phone: '108',
              type: 'hospital' as const,
            },
            {
              name: 'Kashi Vishwanath Temple Office',
              phone: '+91-542-2392629',
              type: 'temple' as const,
            },
            {
              name: 'Tourist Helpline',
              phone: '1363',
              type: 'tourist-helpline' as const,
            },
          ],
          weatherInfo: {
            bestTimeToVisit: 'October to March',
            averageTemp: 'Winter: 5-20°C, Summer: 25-45°C',
          },
        };
      }

      // Default city data for other cities
      return {
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
      };
    });

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

