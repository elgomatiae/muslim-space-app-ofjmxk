
# Google Sign-In Setup Guide for Muslim Space App

## Current Issue
The error "provider is not enabled" indicates that Google OAuth is not configured in your Supabase project.

## Solution Steps

### 1. Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/teemloiwfnwrogwnoxsa
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list of providers
4. Click on **Google** to expand the settings
5. Toggle **Enable Sign in with Google** to ON

### 2. Get Google OAuth Credentials

You need to create OAuth credentials in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth Client ID**
6. Configure the OAuth consent screen if you haven't already:
   - Add your app name: "Muslim Space"
   - Add user support email
   - Add developer contact email
   - Add scopes: `email`, `profile`, `openid`

### 3. Create OAuth Client IDs

You need to create **THREE** OAuth Client IDs:

#### A. Web Application (Required for all platforms)
1. Application type: **Web application**
2. Name: "Muslim Space Web"
3. Authorized JavaScript origins:
   - `https://teemloiwfnwrogwnoxsa.supabase.co`
   - `http://localhost:8081` (for local development)
4. Authorized redirect URIs:
   - `https://teemloiwfnwrogwnoxsa.supabase.co/auth/v1/callback`
5. Click **Create** and save the **Client ID** and **Client Secret**

#### B. iOS Application (for iOS devices)
1. Application type: **iOS**
2. Name: "Muslim Space iOS"
3. Bundle ID: `com.anonymous.Natively` (from your app.json)
4. Click **Create** and save the **Client ID**

#### C. Android Application (for Android devices)
1. Application type: **Android**
2. Name: "Muslim Space Android"
3. Package name: `com.anonymous.Natively` (from your app.json)
4. SHA-1 certificate fingerprint:
   - For development: Run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - For production: Use your release keystore
5. Click **Create** and save the **Client ID**

### 4. Configure Supabase with Google Credentials

Back in the Supabase Dashboard (Authentication → Providers → Google):

1. **Client ID (for OAuth)**: Paste the **Web Application Client ID**
2. **Client Secret (for OAuth)**: Paste the **Web Application Client Secret**
3. **Authorized Client IDs**: Add ALL three client IDs (Web, iOS, Android), separated by commas:
   ```
   <web-client-id>,<ios-client-id>,<android-client-id>
   ```
4. **Skip nonce check**: Leave this OFF for better security
5. Click **Save**

### 5. Add Redirect URLs to Supabase

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `natively://google-auth` (for the app)
   - `http://localhost:8081` (for local development)
   - Any production URLs you'll use

### 6. Test the Implementation

The code has been updated to use the proper OAuth flow with `expo-web-browser`. Here's what happens:

1. User clicks "Continue with Google"
2. App opens a browser window with Google's sign-in page
3. User signs in with their Google account
4. Google redirects back to the app with authentication tokens
5. App exchanges tokens for a Supabase session
6. User is signed in!

### 7. Verify Everything Works

After completing the setup:

1. Restart your Expo development server: `npm start`
2. Clear the app cache if needed
3. Try signing in with Google
4. Check the console logs for any errors

## Important Notes

- **Web Client ID is required** even for mobile apps - this is used by Supabase Auth
- **All three client IDs** should be added to the "Authorized Client IDs" field in Supabase
- The redirect URL `natively://google-auth` matches your app's scheme from app.json
- Make sure to enable Google OAuth in Supabase Dashboard before testing

## Troubleshooting

### "Provider is not enabled"
- Make sure Google OAuth is toggled ON in Supabase Dashboard
- Verify you've saved the configuration

### "Invalid client"
- Check that all three Client IDs are added to Supabase
- Verify the Web Client ID and Secret are correct

### "Redirect URI mismatch"
- Ensure `natively://google-auth` is in the Supabase redirect URLs
- Check that the Supabase callback URL is in Google Console

### Browser doesn't open
- Make sure `expo-web-browser` is installed
- Check that the app scheme is configured correctly in app.json

## Testing Locally

For local development:
1. Use `npx expo start --tunnel` to get an HTTPS URL
2. Add the tunnel URL to Google Console's authorized origins
3. Test the flow

## Production Deployment

Before deploying:
1. Create production OAuth credentials in Google Console
2. Add production redirect URLs to both Google and Supabase
3. Update the bundle ID / package name if changed
4. Test thoroughly on both iOS and Android devices

## Need Help?

If you're still experiencing issues:
1. Check the Expo logs: Look for detailed error messages
2. Check Supabase Auth logs: Dashboard → Logs → Auth
3. Verify all URLs match exactly (no trailing slashes, correct protocols)
4. Make sure your Google Cloud project has the Google+ API enabled

---

**The code is now ready!** Once you complete the Google OAuth configuration in the Supabase Dashboard and Google Cloud Console, the "Continue with Google" button will work perfectly on all platforms (iOS, Android, and Web).
