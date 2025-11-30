
# Google Sign-In Setup Guide for Muslim Space App (iOS Native)

## ✅ Google Provider is Now Enabled in Supabase!

Great! You've enabled the Google OAuth provider in your Supabase project. The app now uses **native iOS Google Sign-In** which provides a seamless, native experience for iOS users.

---

## 🌐 Step 1: Set Up Google Cloud Console

### A. Create/Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "Muslim Space App"

### B. Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it

### C. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Muslim Space
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Add or Remove Scopes**
6. Add these scopes:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
7. Click **Save and Continue**
8. Click **Save and Continue** on Test users (you can add yourself for testing)
9. Review and click **Back to Dashboard**

### D. Create OAuth Client ID for iOS

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **iOS**
4. Name: "Muslim Space iOS"
5. **Bundle ID**: Enter `com.anonymous.Natively` (this is your app's bundle ID from app.json)
6. **App Store ID**: Leave blank for now (only needed when published)
7. Click **Create**
8. **IMPORTANT**: Copy and save the **iOS Client ID** - you'll need this!

---

## 🔐 Step 2: Configure Supabase with Google Credentials

Now go back to your Supabase Dashboard:

1. Go to **Authentication** → **Providers** → **Google**
2. Make sure **"Enable Sign in with Google"** is toggled **ON**
3. Fill in the fields:
   - **Client ID (for OAuth)**: Paste your **iOS Client ID** from Step 1D
   - **Client Secret (for OAuth)**: For iOS native sign-in, you can leave this blank or use a placeholder like "not-required-for-ios"
4. **Skip nonce check**: You may need to enable this for iOS native sign-in (toggle **ON**)
5. Click **Save**

---

## 📱 Step 3: Configure Your App

### A. Update AuthContext with Your iOS Client ID

1. Open `contexts/AuthContext.tsx`
2. Find this line:
   ```typescript
   iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
   ```
3. Replace `'YOUR_IOS_CLIENT_ID_HERE'` with your actual iOS Client ID from Step 1D
4. Save the file

### B. Update app.json (if needed)

Make sure your `app.json` has the correct bundle identifier:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.anonymous.Natively"
    }
  }
}
```

---

## 🚀 Step 4: Test It!

1. **Restart your Expo development server**:
   ```bash
   npm start
   ```
   Or press `r` in the terminal to reload

2. **Clear the app cache** (optional but recommended):
   - Press `Shift + C` in the Expo terminal

3. **Test the Google Sign-In on iOS**:
   - Open your app on an iOS device or simulator
   - Go to the Profile tab
   - Click "Continue with Google"
   - The native iOS Google Sign-In sheet should appear
   - Sign in with your Google account
   - You should be signed in successfully! 🎉

---

## 🐛 Troubleshooting

### Error: "Failed to get authentication token from Google"
- ✅ Make sure you've replaced `YOUR_IOS_CLIENT_ID_HERE` with your actual iOS Client ID
- ✅ Make sure the iOS Client ID is correct (no extra spaces)
- ✅ Restart your Expo development server after making changes

### Error: "Sign in was cancelled"
- ✅ This is normal if the user closes the sign-in sheet
- ✅ Try signing in again

### Error: "Google Play Services not available"
- ✅ This error should not appear on iOS
- ✅ If you see this, make sure you're testing on an iOS device/simulator

### Sign-in sheet doesn't appear
- ✅ Make sure you've configured the iOS Client ID in `AuthContext.tsx`
- ✅ Check the console logs for any error messages
- ✅ Make sure you have internet connection
- ✅ Try restarting the Expo development server

### Error: "Invalid client"
- ✅ Make sure the iOS Client ID in `AuthContext.tsx` matches the one in Google Cloud Console
- ✅ Make sure the Bundle ID in `app.json` matches the one you used when creating the iOS Client ID
- ✅ Try creating a new iOS Client ID in Google Cloud Console

### Sign-in works but user is not saved to Supabase
- ✅ Make sure the Google provider is enabled in Supabase Dashboard
- ✅ Make sure you've added the iOS Client ID to Supabase
- ✅ Check the Supabase logs for any errors
- ✅ Try enabling "Skip nonce check" in Supabase Dashboard

---

## 📝 Summary Checklist

Before testing, make sure you've completed ALL of these:

- [x] Enabled Google OAuth in Supabase Dashboard (Already done!)
- [ ] Created iOS OAuth Client ID in Google Cloud Console
- [ ] Added iOS Client ID to Supabase Dashboard
- [ ] Updated `AuthContext.tsx` with your iOS Client ID
- [ ] Verified Bundle ID matches in both `app.json` and Google Cloud Console
- [ ] Clicked **Save** in Supabase Dashboard
- [ ] Restarted Expo development server

---

## ✨ How It Works Now

### Native iOS Google Sign-In Flow

The app now uses **native iOS Google Sign-In** with `@react-native-google-signin/google-signin`:

1. When you click "Continue with Google", the app calls `GoogleSignin.signIn()`
2. iOS shows the native Google Sign-In sheet (same as other iOS apps)
3. You sign in with your Google account
4. Google returns an ID token to the app
5. The app sends the ID token to Supabase using `signInWithIdToken()`
6. Supabase validates the token and creates a session
7. You're signed in! 🎉

### Benefits

- ✅ **Native iOS experience**: Uses the same sign-in sheet as other iOS apps
- ✅ **Fast and seamless**: No browser redirects needed
- ✅ **Secure**: Uses iOS's built-in Google Sign-In
- ✅ **Works for both sign-in and sign-up**: New users are automatically created in Supabase
- ✅ **User data saved**: All user data (emails, Iman Tracker stats) stored in Supabase

---

## 🎯 What's Working Now

1. ✅ **Native iOS Google Sign-In**: Users can sign in/up with Google using native iOS sheet
2. ✅ **Email/Password Auth**: Users can sign in/up with email and password
3. ✅ **User Data Storage**: All emails, passwords, and Iman Tracker data stored in Supabase
4. ✅ **Daily Verse**: Automatically resets every 24 hours from 100+ verses
5. ✅ **Daily Hadith**: Automatically resets every 24 hours from 100+ hadiths
6. ✅ **Prayer Tracking**: Prayer completion status saved to AsyncStorage
7. ✅ **Profile Management**: Users can view and manage their profiles
8. ✅ **Sign Out**: Users can sign out from both Google and Supabase

---

## 🔄 For Android Support (Optional)

If you want to add Android support later, you'll need to:

1. Create an Android OAuth Client ID in Google Cloud Console
2. Add the SHA-1 certificate fingerprint
3. Update the `GoogleSignin.configure()` call to include `webClientId` for Android
4. Test on an Android device

---

**Once you complete the Google Cloud Console setup and add your iOS Client ID to the code, the native Google Sign-In will work perfectly on iOS!** 🚀

The native iOS sign-in sheet will appear automatically when you click "Continue with Google", providing the same seamless experience as other iOS apps.
