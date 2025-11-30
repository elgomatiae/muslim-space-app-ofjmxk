
# Google Sign-In Setup Guide for Muslim Space App

## ⚠️ IMPORTANT: You're getting the "provider is not enabled" error

This means the Google OAuth provider is **NOT enabled** in your Supabase project. Follow these steps to fix it.

---

## 🔧 Step 1: Enable Google Provider in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/teemloiwfnwrogwnoxsa
2. Click on **Authentication** in the left sidebar
3. Click on **Providers**
4. Find **Google** in the list of providers
5. Click on **Google** to expand the settings
6. Toggle **"Enable Sign in with Google"** to **ON** ✅

**Don't save yet!** You need to add the Client ID and Secret first (from Step 2).

---

## 🌐 Step 2: Set Up Google Cloud Console

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
   - `openid` (you may need to add this manually)
   - `.../auth/userinfo.email` (should be there by default)
   - `.../auth/userinfo.profile` (should be there by default)
7. Click **Save and Continue**
8. Click **Save and Continue** on Test users (you can add yourself for testing)
9. Review and click **Back to Dashboard**

### D. Create OAuth Client IDs

You need to create **THREE** OAuth Client IDs (one for each platform):

#### 1️⃣ Web Application (Required)

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

#### 2️⃣ Android Application

1. Click **Create Credentials** → **OAuth Client ID** again
2. Choose **Android**
3. Name: "Muslim Space Android"
4. **Package name**: `com.anonymous.Natively`
5. **SHA-1 certificate fingerprint**: 
   - For development, run this command in your terminal:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
   - Copy the SHA-1 fingerprint from the output
   - Paste it into the Google Cloud Console
6. Click **Create**
7. **IMPORTANT**: Copy and save the **Client ID**

#### 3️⃣ iOS Application

1. Click **Create Credentials** → **OAuth Client ID** again
2. Choose **iOS**
3. Name: "Muslim Space iOS"
4. **Bundle ID**: `com.anonymous.Natively`
5. Click **Create**
6. **IMPORTANT**: Copy and save the **Client ID**

---

## 🔐 Step 3: Configure Supabase with Google Credentials

Now go back to your Supabase Dashboard:

1. Go to **Authentication** → **Providers** → **Google**
2. Make sure **"Enable Sign in with Google"** is toggled **ON**
3. Fill in the fields:
   - **Client ID (for OAuth)**: Paste your **Web Client ID** from Step 2D-1
   - **Client Secret (for OAuth)**: Paste your **Web Client Secret** from Step 2D-1
   - **Authorized Client IDs**: Paste ALL THREE Client IDs separated by commas:
     ```
     <web-client-id>,<android-client-id>,<ios-client-id>
     ```
     Example:
     ```
     123456789-abc.apps.googleusercontent.com,123456789-def.apps.googleusercontent.com,123456789-ghi.apps.googleusercontent.com
     ```
4. **Skip nonce check**: Leave this **OFF** (unchecked) for better security
5. Click **Save**

---

## 📱 Step 4: Update Your App Code

Open `contexts/AuthContext.tsx` and find this line (around line 52):

```typescript
webClientId: 'YOUR_WEB_CLIENT_ID', // This is the Web Client ID from Google Cloud Console
```

Replace `'YOUR_WEB_CLIENT_ID'` with your actual **Web Client ID** from Step 2D-1.

Example:
```typescript
webClientId: '123456789-abc.apps.googleusercontent.com',
```

---

## 🚀 Step 5: Test It!

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
   - You should see the native Google Sign-In screen
   - Sign in with your Google account
   - You should be signed in successfully! 🎉

---

## 🐛 Troubleshooting

### Error: "provider is not enabled"
- ✅ Make sure Google OAuth is toggled **ON** in Supabase Dashboard
- ✅ Make sure you clicked **Save** in Supabase after entering the credentials

### Error: "No ID token received from Google"
- ✅ Make sure you replaced `'YOUR_WEB_CLIENT_ID'` in `AuthContext.tsx`
- ✅ Make sure the Web Client ID is correct
- ✅ Restart your Expo development server

### Error: "Invalid client"
- ✅ Check that all THREE Client IDs are added to Supabase's "Authorized Client IDs" field
- ✅ Make sure there are no extra spaces in the Client IDs
- ✅ Make sure the Client IDs are separated by commas

### Error: "Redirect URI mismatch"
- ✅ Make sure `https://teemloiwfnwrogwnoxsa.supabase.co/auth/v1/callback` is in Google Console's authorized redirect URIs
- ✅ Make sure there are no trailing slashes

### Android: "Google Play Services not available"
- ✅ Make sure you're testing on a real device or an emulator with Google Play Services
- ✅ Update Google Play Services on your device

### iOS: Sign-in doesn't work
- ✅ Make sure the iOS Client ID is correct
- ✅ Make sure the Bundle ID matches: `com.anonymous.Natively`

---

## 📝 Summary Checklist

Before testing, make sure you've completed ALL of these:

- [ ] Enabled Google OAuth in Supabase Dashboard
- [ ] Created Web OAuth Client ID in Google Cloud Console
- [ ] Created Android OAuth Client ID in Google Cloud Console
- [ ] Created iOS OAuth Client ID in Google Cloud Console
- [ ] Added Web Client ID and Secret to Supabase
- [ ] Added all THREE Client IDs to "Authorized Client IDs" in Supabase
- [ ] Clicked **Save** in Supabase Dashboard
- [ ] Replaced `'YOUR_WEB_CLIENT_ID'` in `contexts/AuthContext.tsx`
- [ ] Restarted Expo development server

---

## 🎯 What Changed in the Code?

The app now uses **native Google Sign-In** instead of the web-based OAuth flow. This provides:

- ✅ Better user experience (native Google account picker)
- ✅ Faster sign-in process
- ✅ More secure (uses device's Google account)
- ✅ Works offline (after initial sign-in)

The flow is:
1. User clicks "Continue with Google"
2. Native Google Sign-In screen appears
3. User selects their Google account
4. Google returns an ID token
5. App sends ID token to Supabase
6. Supabase validates and creates a session
7. User is signed in! 🎉

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check the Expo logs for detailed error messages
2. Check Supabase Auth logs: Dashboard → Logs → Auth
3. Make sure all URLs match exactly (no trailing slashes, correct protocols)
4. Try signing in with a different Google account
5. Clear the app cache and restart

---

**Once you complete all the steps above, the "Continue with Google" button will work perfectly!** 🚀
