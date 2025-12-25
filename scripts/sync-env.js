/**
 * Script to sync backend/.env file to frontend/.env.local
 * Run this after updating backend/.env: node scripts/sync-env.js
 */

const fs = require('fs');
const path = require('path');

const backendEnvPath = path.resolve(__dirname, '../backend/.env');
const frontendEnvPath = path.resolve(__dirname, '../frontend/.env.local');

// Read backend .env
if (!fs.existsSync(backendEnvPath)) {
  console.error('❌ Backend .env file not found at backend/.env');
  process.exit(1);
}

const backendEnvContent = fs.readFileSync(backendEnvPath, 'utf-8');

// Extract only NEXT_PUBLIC_* variables for frontend
const lines = backendEnvContent.split('\n');
const frontendEnvLines = lines.filter((line) => {
  const trimmed = line.trim();
  return trimmed.startsWith('NEXT_PUBLIC_') || trimmed.startsWith('#') || trimmed === '';
});

// Write to frontend/.env.local
fs.writeFileSync(frontendEnvPath, frontendEnvLines.join('\n'));
console.log('✅ Synced environment variables to frontend/.env.local');
console.log('   Frontend will use NEXT_PUBLIC_* variables from backend/.env');

