import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
// Render provides environment variables directly, but we load .env for local development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env file');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout (increased for network flexibility)
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      // MongoDB Atlas requires SSL/TLS
      tls: true,
      tlsAllowInvalidCertificates: false,
      // Retry connection settings - helps with network switching
      retryWrites: true,
      retryReads: true,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 1,
      // Heartbeat settings for better connection monitoring
      heartbeatFrequencyMS: 10000,
      // Auto-reconnect settings
      autoIndex: true,
      autoCreate: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB Connected Successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB Connection Error:');
        console.error('Error Type:', error.constructor.name);
        console.error('Error Message:', error.message);
        
        // Provide helpful error messages
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
          console.error('\n⚠️  IP Whitelisting Issue Detected!');
          console.error('Please add your current IP address to MongoDB Atlas IP Whitelist:');
          console.error('1. Go to https://cloud.mongodb.com/');
          console.error('2. Navigate to Network Access');
          console.error('3. Click "Add IP Address"');
          console.error('4. Add your current IP or use "0.0.0.0/0" for development (not recommended for production)');
        } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
          console.error('\n⚠️  SSL/TLS Connection Issue Detected!');
          console.error('This might be due to:');
          console.error('1. Network firewall blocking SSL connections');
          console.error('2. Outdated Node.js or MongoDB driver');
          console.error('3. Incorrect MongoDB connection string');
        } else if (error.message.includes('authentication')) {
          console.error('\n⚠️  Authentication Issue Detected!');
          console.error('Please check your MongoDB username and password in the connection string');
        }
        
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

