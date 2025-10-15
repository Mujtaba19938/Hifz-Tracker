# Hifz Tracker - Android Build Instructions

This guide will help you build a signed APK (and optionally AAB) for the Hifz Tracker app using Expo's EAS Build service.

## Prerequisites

1. **Node.js and npm** installed on your system
2. **Expo account** (free at [expo.dev](https://expo.dev))
3. **EAS CLI** installed globally

## Setup Instructions

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

Enter your Expo credentials when prompted.

### 3. Configure the Project

The project is already configured with:
- `eas.json` - EAS Build configuration
- `app.json` - App configuration with Android settings
- Build scripts in `package.json`

## Building the App

### Option 1: Using the Automated Script

```bash
# Build APK
node build-android.js

# Build AAB (Android App Bundle)
node build-android.js --aab
```

### Option 2: Using npm Scripts

```bash
# Build APK
npm run build:android

# Build AAB
npm run build:android-aab

# Build preview APK (for testing)
npm run build:android-preview
```

### Option 3: Using EAS CLI Directly

```bash
# Build APK
eas build --platform android --profile production

# Build AAB
eas build --platform android --profile production-aab

# Build preview APK
eas build --platform android --profile preview
```

## Build Profiles

The project includes three build profiles:

1. **production** - Signed APK for distribution
2. **production-aab** - Signed AAB for Google Play Store
3. **preview** - Unsigned APK for testing

## Output Locations

After a successful build:
- **APK**: Download from Expo dashboard
- **AAB**: Download from Expo dashboard
- Build logs and status available in Expo dashboard

## App Configuration

### Android Package
- **Package Name**: `com.rork.hifztracker`
- **Version**: 1.0.0
- **Version Code**: 1

### Permissions
- `android.permission.INTERNET`
- `android.permission.ACCESS_NETWORK_STATE`

## Signing

EAS Build automatically handles:
- ✅ Keystore generation
- ✅ APK/AAB signing
- ✅ Release configuration
- ✅ ProGuard optimization (disabled for debugging)

## Troubleshooting

### Common Issues

1. **Not logged in to Expo**
   ```bash
   eas login
   ```

2. **Build fails due to dependencies**
   ```bash
   npm install
   ```

3. **EAS CLI not found**
   ```bash
   npm install -g eas-cli
   ```

### Build Logs

Check build logs in the Expo dashboard or use:
```bash
eas build:list
```

## Distribution

### APK Distribution
- Direct installation on Android devices
- Side-loading via file manager
- Distribution through your own channels

### AAB Distribution
- Upload to Google Play Console
- Automatic optimization by Google Play
- Better app size optimization

## Security Notes

- Keystores are managed by EAS Build
- Never commit keystores to version control
- Use EAS credentials for production builds
- Test builds before production release

## Support

For issues with:
- **EAS Build**: Check [Expo documentation](https://docs.expo.dev/build/introduction/)
- **App functionality**: Check app logs and Firebase configuration
- **Build errors**: Review build logs in Expo dashboard

---

**Happy Building! 🚀**
