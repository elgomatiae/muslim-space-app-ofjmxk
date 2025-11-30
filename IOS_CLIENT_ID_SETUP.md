
# 🚀 Quick Setup: Add Your iOS Client ID

You've created an iOS Client ID in Google Cloud Console - great! Now you just need to add it to your app.

## Step 1: Copy Your iOS Client ID

From Google Cloud Console, copy your iOS Client ID. It should look something like:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

## Step 2: Update AuthContext.tsx

1. Open `contexts/AuthContext.tsx`
2. Find line 48 (around the `GoogleSignin.configure` section)
3. Replace `'YOUR_IOS_CLIENT_ID_HERE'` with your actual iOS Client ID

**Before:**
```typescript
GoogleSignin.configure({
  iosClientId: 'YOUR_IOS_CLIENT_ID_HERE', // Replace with your iOS Client ID
  scopes: ['openid', 'profile', 'email'],
});
```

**After:**
```typescript
GoogleSignin.configure({
  iosClientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
  scopes: ['openid', 'profile', 'email'],
});
```

## Step 3: Add iOS Client ID to Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Google**
3. In the **Client ID (for OAuth)** field, paste your iOS Client ID
4. For **Client Secret**, you can use a placeholder like `not-required-for-ios` (iOS native sign-in doesn't need a client secret)
5. Enable **Skip nonce check** (toggle it ON)
6. Click **Save**

## Step 4: Restart and Test

1. Restart your Expo development server:
   ```bash
   npm start
   ```

2. Open the app on an iOS device or simulator

3. Go to the Profile tab

4. Click "Continue with Google"

5. The native iOS Google Sign-In sheet should appear! 🎉

## ✅ What Works Now

- **Sign In**: Existing users can sign in with Google
- **Sign Up**: New users are automatically created in Supabase
- **User Data**: All user data (email, Iman Tracker stats) saved to Supabase
- **Sign Out**: Users can sign out from both Google and Supabase

## 🐛 Troubleshooting

If the sign-in doesn't work:

1. **Check the iOS Client ID**: Make sure it's correct in both `AuthContext.tsx` and Supabase Dashboard
2. **Check the Bundle ID**: Make sure it matches in `app.json` and Google Cloud Console (should be `com.anonymous.Natively`)
3. **Enable Skip Nonce Check**: In Supabase Dashboard, make sure "Skip nonce check" is enabled for the Google provider
4. **Check Console Logs**: Look for error messages in the Expo console
5. **Restart**: Try restarting the Expo development server

## 📚 Full Documentation

For more detailed instructions, see `GOOGLE_SIGNIN_SETUP.md`.

---

**That's it! Once you add your iOS Client ID, the native Google Sign-In will work perfectly on iOS.** 🚀
