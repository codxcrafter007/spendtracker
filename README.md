# 💰 Spend Analyzer V2

A modern, offline-first Progressive Web App for tracking and analyzing your daily expenses with **Google Drive sync** and **client-side encryption**.

## ✨ Features

- 🔐 **Google Sign-In** - Secure authentication with Google OAuth
- 🔄 **Multi-Device Sync** - Encrypted backup to Google Drive appDataFolder
- 📴 **Offline-First** - Works completely offline with IndexedDB
- 🔒 **Client-Side Encryption** - Your data is encrypted before leaving your device
- 📊 **Interactive Analytics** - Real-time charts and spending insights
- 🌓 **Dark/Light Theme** - Beautiful themes with smooth transitions
- 📱 **PWA Ready** - Installable on mobile and desktop
- ⚡ **Fast & Modern** - Built with React, TypeScript, and Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Project with OAuth credentials

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd c:\Users\darsh\Downloads\abctracker\spend-analyzer-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure Google OAuth:**
   - Follow instructions in `GOOGLE_SETUP.md` (coming soon)
   - Add your Google Client ID to `.env`:
     ```
     VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
     ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
spend-analyzer-v2/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── auth/        # Authentication components
│   │   └── dashboard/   # Dashboard components
│   ├── contexts/        # React contexts (Auth, Theme, Sync)
│   ├── lib/             # Core libraries
│   │   ├── auth/        # Google OAuth
│   │   ├── crypto/      # Encryption
│   │   ├── db/          # IndexedDB
│   │   └── sync/        # Google Drive sync
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── App.tsx          # Main app component
├── public/              # Static assets
└── vite.config.ts       # Vite configuration
```

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (via `idb`)
- **Charts**: Chart.js (coming soon)
- **Auth**: Google Identity Services
- **Sync**: Google Drive API
- **Encryption**: Web Crypto API (AES-GCM)
- **PWA**: Vite PWA Plugin

## 🔐 Security & Privacy

- **Client-Side Encryption**: All data is encrypted using AES-GCM before upload to Google Drive
- **Key Derivation**: Encryption keys derived from OAuth token + device-specific salt
- **No Backend**: No custom server - uses only Google Drive appDataFolder
- **Local-First**: Primary storage is IndexedDB on your device
- **Zero Tracking**: No analytics, no telemetry, no third-party tracking

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (Android)
1. Open the app in Chrome
2. Tap "Add to Home screen"
3. Confirm installation

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

## 🎨 Features in Detail

### Offline-First Architecture
- All data stored locally in IndexedDB
- App works completely offline after first load
- Changes synced to Google Drive when online
- Service worker caches app shell for offline use

### Multi-Device Sync
- Sign in with Google on any device
- Encrypted backup automatically uploaded to Google Drive
- Data restored from Drive on new devices
- Conflict resolution UI for simultaneous edits

### Client-Side Encryption
- AES-GCM encryption (256-bit)
- Keys derived from OAuth token + device salt
- Data encrypted before leaving your device
- Only you can decrypt your data

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript type checking
```

### Adding Features

1. Create components in `src/components/`
2. Add types to `src/types/index.ts`
3. Use contexts for global state
4. Follow existing patterns for consistency

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to fork and improve.

## 🐛 Troubleshooting

### App not loading?
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache and reload

### Sync not working?
- Verify Google OAuth credentials
- Check internet connection
- Ensure Google Drive API is enabled

### Data not persisting?
- Check if browser is in private/incognito mode
- Ensure IndexedDB is not disabled
- Check available storage space

---

**Made with ❤️ for privacy-conscious expense tracking**
