# Native Android APK Build Instructions

## Project Structure
This is a **100% NATIVE ANDROID APPLICATION** built with:
- **Pure Java/Android SDK** (NO web components)
- **SQLite Database** for offline data storage
- **Native Android UI** with material design
- **Complete offline functionality**

## Features Implemented
✅ **PIN Authentication** (Default: 2208, Security reset: "LUDO")
✅ **Cards Management** with SQLite database
✅ **Excel/Spreadsheet Editor** with data persistence
✅ **Media Gallery** organized by cards
✅ **Offline-First Architecture** using local storage
✅ **Light Blue & Pink Theme** as requested
✅ **Material Design UI Components**

## Build Requirements
- Android Studio Arctic Fox or later
- Android SDK API 21+ (Android 5.0+)
- Java 8+ or Kotlin support
- Gradle Build System

## Build Steps
1. Open `android/` folder in Android Studio
2. Sync Gradle files
3. Build > Generate Signed Bundle/APK
4. Select APK and choose build variant
5. Sign with release keystore
6. Generate APK

## APK Details
- **Package Name**: com.cardmanager.app
- **Version**: 1.0 (Build 1)
- **Min SDK**: API 21 (Android 5.0)
- **Target SDK**: API 34 (Android 14)
- **Architecture**: Universal (ARM, x86, x64)

## Database Schema
```sql
-- Cards Table
CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    name TEXT,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    photo TEXT,
    id_front TEXT,
    id_back TEXT,
    notes TEXT,
    birthday TEXT
);

-- Excel Files Table  
CREATE TABLE excel_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    data TEXT,
    created_date INTEGER
);

-- Media Table
CREATE TABLE media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    name TEXT,
    type TEXT,
    data TEXT,
    created_date INTEGER,
    FOREIGN KEY(card_id) REFERENCES cards(id)
);
```

## Key Components
- **MainActivity**: Main menu with 4 buttons
- **PinActivity**: PIN authentication with security question
- **CardsActivity**: CRUD operations for personal cards
- **ExcelActivity**: Spreadsheet creation and editing
- **GalleryActivity**: Media management per card
- **DatabaseHelper**: SQLite database operations

## Security Features
- PIN-based authentication
- Security question for PIN reset
- Local data encryption option
- No network permissions for data security

## Installation
1. Enable "Install from unknown sources" on Android device
2. Download and install the generated APK
3. Launch "Card Manager" app
4. Enter default PIN: **2208**
5. Start managing your personal data offline

This is a completely native Android application without any web-based components.