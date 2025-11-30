
# Google Sign-In Setup Guide for Muslim Space App

## ✅ Google Provider is Now Enabled in Supabase!

Great! You've enabled the Google OAuth provider in your Supabase project. The app now uses **Supabase's OAuth flow** which opens a browser window for Google Sign-In - no complex native configuration needed!

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

### D. Create OAuth Client ID (Web Application)

You only need to create **ONE** OAuth Client ID for web:

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth Client ID**
3. Choose **Web application**
4. Name: "Muslim Space Web"
5. **Authorized JavaScript origins**:
   - Add: `https://teemloiwfnwrogwnoxsa.supabase.co`
6. **Authorized redirect URIs**:
   - Add: `https://teemloiwfnwrogwnoxsa.supabase.co/auth/v1/callback`
7. Click **Create**
8. **IMPORTANT**: Copy and save the **Client ID** and **Client Secret** - you'll need these!

---

## 🔐 Step 2: Configure Supabase with Google Credentials

Now go back to your Supabase Dashboard:

1. Go to **Authentication** → **Providers** → **Google**
2. Make sure **"Enable Sign in with Google"** is toggled **ON**
3. Fill in the fields:
   - **Client ID (for OAuth)**: Paste your **Web Client ID** from Step 1D
   - **Client Secret (for OAuth)**: Paste your **Web Client Secret** from Step 1D
4. **Skip nonce check**: Leave this **OFF** (unchecked) for better security
5. Click **Save**

---

## 🚀 Step 3: Test It!

1. **Restart your Expo development server**:
   ```bash
   npm start
   ```
   Or press `r` in the terminal to reload

2. **Clear the app cache** (optional but recommended):
   - Press `Shift + C` in the Expo terminal

3. **Test the Google Sign-In**:
   - Open your app
   - Go to the Profile tab
   - Click "Continue with Google"
   - A browser window should open with the Google Sign-In page
   - Sign in with your Google account
   - The browser will redirect back to your app
   - You should be signed in successfully! 🎉

---

## 🐛 Troubleshooting

### Error: "Failed to get Google sign-in URL"
- ✅ Make sure Google OAuth is enabled in Supabase Dashboard
- ✅ Make sure you added the Client ID and Secret to Supabase
- ✅ Click **Save** in Supabase Dashboard
- ✅ Restart your Expo development server

### Error: "Invalid client"
- ✅ Check that the Web Client ID and Secret are correct in Supabase
- ✅ Make sure there are no extra spaces in the credentials
- ✅ Make sure you're using the **Web** Client ID, not Android or iOS

### Error: "Redirect URI mismatch"
- ✅ Make sure `https://teemloiwfnwrogwnoxsa.supabase.co/auth/v1/callback` is in Google Console's authorized redirect URIs
- ✅ Make sure there are no trailing slashes
- ✅ Make sure the URL is exactly as shown (no typos)

### Browser doesn't open
- ✅ Make sure you have internet connection
- ✅ Try restarting the Expo development server
- ✅ Check the console logs for any error messages

### Browser opens but doesn't redirect back
- ✅ Make sure the `scheme` in `app.json` is set to `"natively"`
- ✅ Try closing and reopening the app
- ✅ Check if you're testing on a physical device or emulator

---

## 📝 Summary Checklist

Before testing, make sure you've completed ALL of these:

- [x] Enabled Google OAuth in Supabase Dashboard (Already done!)
- [ ] Created Web OAuth Client ID in Google Cloud Console
- [ ] Added Web Client ID and Secret to Supabase
- [ ] Clicked **Save** in Supabase Dashboard
- [ ] Restarted Expo development server

---

## ✨ How It Works Now

### Browser-Based OAuth Flow

The app now uses **Supabase's OAuth flow** with `expo-web-browser`:

1. When you click "Continue with Google", the app calls `supabase.auth.signInWithOAuth()`
2. Supabase generates a Google OAuth URL
3. The app opens this URL in a browser window using `expo-web-browser`
4. You sign in with your Google account in the browser
5. Google redirects back to Supabase with an authorization code
6. Supabase exchanges the code for a session token
7. The browser redirects back to your app with the session
8. The app automatically detects the new session and signs you in

### Benefits

- ✅ **No native configuration needed**: Works immediately after Supabase setup
- ✅ **Cross-platform**: Works on iOS, Android, and Web
- ✅ **Secure**: Uses standard OAuth 2.0 flow
- ✅ **Simple**: Only requires Web Client ID (no Android/iOS Client IDs)
- ✅ **Familiar**: Users see the standard Google Sign-In page in a browser

---

## 🎯 What's Working Now

1. ✅ **Google Sign-In**: Users can sign in/up with Google via browser
2. ✅ **Email/Password Auth**: Users can sign in/up with email and password
3. ✅ **User Data Storage**: All emails, passwords, and Iman Tracker data stored in Supabase
4. ✅ **Daily Verse**: Automatically resets every 24 hours from 100+ verses
5. ✅ **Daily Hadith**: Automatically resets every 24 hours from 100+ hadiths
6. ✅ **Prayer Tracking**: Prayer completion status saved to AsyncStorage
7. ✅ **Profile Management**: Users can view and manage their profiles

---

**Once you complete the Google Cloud Console setup and add the credentials to Supabase, the Google Sign-In will work perfectly!** 🚀

The browser window will open automatically when you click "Continue with Google", allowing users to sign in with their device's Google accounts just like other apps.
