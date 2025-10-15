# Firebase Phone Authentication Setup Guide

This guide will help you set up Firebase Phone Authentication for your Hifz Tracker app.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "hifz-tracker")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Add Your App to Firebase

### For Android:
1. In Firebase Console, click "Add app" and select Android
2. Enter your package name: `com.rork.hifztracker`
3. Enter app nickname: "Hifz Tracker Android"
4. Download `google-services.json` and place it in your project root
5. Click "Next" and follow the setup instructions

### For iOS:
1. In Firebase Console, click "Add app" and select iOS
2. Enter your bundle ID: `app.rork.hifz-tracker-2q6sks0`
3. Enter app nickname: "Hifz Tracker iOS"
4. Download `GoogleService-Info.plist` and add it to your iOS project
5. Click "Next" and follow the setup instructions

## 3. Enable Phone Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Click on "Phone" provider
3. Toggle "Enable" to turn on phone authentication
4. Add your test phone numbers (for development)
5. Save the changes

## 4. Configure Firebase in Your App

Update the Firebase configuration in `config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

You can find these values in:
- Firebase Console > Project Settings > General > Your apps
- Or in your `google-services.json` (Android) / `GoogleService-Info.plist` (iOS)

## 5. Install Dependencies

Run the following command to install Firebase:

```bash
bun install firebase
```

## 6. Configure reCAPTCHA (for Web)

If you're testing on web, you need to configure reCAPTCHA:

1. In Firebase Console, go to "Authentication" > "Settings" > "Authorized domains"
2. Add your domain (e.g., `localhost` for development)
3. For production, add your actual domain

## 7. Test Phone Authentication

1. Start your app: `bun start`
2. Navigate to Sign In screen
3. Click "Sign in with Phone Number"
4. Enter a test phone number (format: +1234567890)
5. Check your phone for the SMS verification code
6. Enter the code to complete authentication

## 8. Production Considerations

### SMS Costs
- Firebase charges for SMS messages sent
- Consider implementing rate limiting
- Monitor usage in Firebase Console

### Security
- Implement proper phone number validation
- Add rate limiting to prevent abuse
- Consider implementing additional security measures

### Error Handling
- Handle network errors gracefully
- Provide clear error messages to users
- Implement retry mechanisms

## 9. Troubleshooting

### Common Issues:

1. **"reCAPTCHA verification failed"**
   - Make sure you're using a valid phone number format
   - Check if reCAPTCHA is properly configured

2. **"Invalid phone number"**
   - Ensure phone number includes country code (e.g., +1 for US)
   - Check phone number format

3. **"Too many requests"**
   - Firebase has rate limits for phone authentication
   - Wait before retrying or use test phone numbers

4. **"Network request failed"**
   - Check internet connection
   - Verify Firebase configuration

### Debug Mode:
Enable debug logging by adding this to your app:

```typescript
import { getApps } from 'firebase/app';
console.log('Firebase apps:', getApps());
```

## 10. Next Steps

After setting up phone authentication:

1. Test the complete flow
2. Implement user profile management
3. Add phone number verification for masjid registration
4. Consider implementing additional authentication methods
5. Set up proper error monitoring and analytics

## Support

For more help:
- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
