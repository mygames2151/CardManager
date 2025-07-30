# Card Manager - Complete Project Package

## What's Included

This package contains the complete Card Manager application in multiple formats:

### 🔹 Native Android App (`android/` folder)
- **100% Pure Native Android** application
- Built with Java + Android SDK (NO web components)
- SQLite database for offline storage
- Material Design UI with light blue/pink theme
- Complete source code ready for Android Studio

### 🔹 Ready-to-Install APK
- `CardManager-Native.apk` - Install directly on Android devices
- Package: com.cardmanager.app
- Default PIN: **2208**
- Security reset: "what use of app" → "LUDO"

### 🔹 Web Backup (`web-backup/` folder)
- Original React/TypeScript PWA version
- Client-side React components
- Server-side Express.js backend
- Shared schemas and types

## Quick Start

### For Android Installation:
1. Enable "Install from unknown sources" on your Android device
2. Install `CardManager-Native.apk`
3. Launch app and enter PIN: `2208`

### For Android Development:
1. Open `android/` folder in Android Studio
2. Sync Gradle files
3. Build and run on device/emulator

### For Web Development:
1. Navigate to project root
2. Run `npm install`
3. Run `npm run dev`
4. Open browser to localhost:5000

## Features

✅ **PIN Authentication** with security question reset
✅ **Personal Cards Management** with photos and details
✅ **Excel/Spreadsheet Editor** with data persistence
✅ **Media Gallery** organized by cards
✅ **Complete Offline Functionality**
✅ **Light Blue & Pink Theme**
✅ **Search and Filter Capabilities**

## Technical Details

### Android App
- **Language**: Java
- **Database**: SQLite
- **UI Framework**: Native Android Views + Material Design
- **Min SDK**: API 21 (Android 5.0)
- **Target SDK**: API 34 (Android 14)

### Database Schema
```sql
-- Cards with personal information
CREATE TABLE cards (id, code, name, gender, phone, email, address, photo, id_front, id_back, notes, birthday);

-- Excel spreadsheet files
CREATE TABLE excel_files (id, name, data, created_date);

-- Media files organized by card
CREATE TABLE media (id, card_id, name, type, data, created_date);
```

## Support
- Default PIN: **2208**
- Security Question: "what use of app"
- Security Answer: "LUDO"
- All data stored locally on device
- No internet connection required

---

This is a complete offline personal data management solution built specifically for Android devices.