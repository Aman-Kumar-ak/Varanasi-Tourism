# Varanasi Tourism Guide

A comprehensive, multi-language tourism platform providing detailed information about Varanasi - the spiritual heart of India. Discover ghats, temples, cultural experiences, and practical travel information in your preferred language.

## 🌟 Features

- 🏛️ **Comprehensive City Guide** - Detailed information about Varanasi's ghats, temples, and cultural sites
- 🌐 **Multi-Language Support** - Available in all major Indian languages with natural translations
- 📱 **Mobile-First Design** - Optimized for seamless mobile experience
- 🎨 **Modern UI/UX** - Beautiful, accessible interface with smooth scrolling
- 🔍 **Rich Content** - Historical significance, cultural insights, and practical travel tips
- 📸 **Media Integration** - High-quality images and videos via Cloudinary CDN
- ♿ **Accessibility** - Font size controls and responsive design for all users

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Firebase Phone Auth
- **Internationalization**: Custom i18n implementation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Security**: Helmet.js, Rate Limiting, Input Sanitization
- **File Storage**: Cloudinary CDN
- **Authentication**: JWT + Firebase Admin SDK

## 📁 Project Structure

```
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React context providers
│   └── lib/              # Utility functions
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── models/       # MongoDB models
│   │   ├── middleware/  # Express middleware
│   │   └── lib/          # Utility libraries
│   └── dist/             # Compiled JavaScript (generated)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Firebase project (for authentication)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Varanasi Tourism"
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔒 Security Features

- ✅ Security headers (Helmet.js)
- ✅ Rate limiting (API protection)
- ✅ Input validation & sanitization
- ✅ JWT authentication
- ✅ Firebase token verification
- ✅ File upload validation (magic number checking)
- ✅ CORS configuration
- ✅ Error message sanitization

## 🎨 Design System

### Color Palette
- **Primary Blue**: #00ABE7 - Primary actions, links
- **Primary Orange**: #FE9000 - Accents, CTAs
- **Primary Teal**: #5B9279 - Success states
- **Primary Dark**: #183446 - Headers, text
- **Background**: #EDE6E3 - Main background

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

## 🌍 Supported Languages

The platform supports multiple Indian languages with natural, contextually appropriate translations:
- English
- Hindi
- Bengali
- Tamil
- Telugu
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Odia
- Assamese
- And more...

## 📦 Dependencies

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase SDK

### Backend
- Express.js
- MongoDB (Mongoose)
- TypeScript
- Firebase Admin SDK
- Helmet.js
- Express Rate Limit
- Cloudinary SDK

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with ❤️ for the spiritual seekers and travelers exploring Varanasi.

---

**Note**: This project is focused on providing comprehensive tourism information.
