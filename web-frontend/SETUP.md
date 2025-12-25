# Quick Setup Guide

## Fix the AuthJS Error

The error you're seeing is because environment variables aren't configured yet. Here's how to fix it:

### Option 1: Quick Fix (Development Only)

Create a `.env.local` file in the project root with these values:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-please-change-in-production-min-32-chars

# Google OAuth Credentials (placeholder - Google sign-in won't work until you add real credentials)
GOOGLE_CLIENT_ID=placeholder-google-client-id
GOOGLE_CLIENT_SECRET=placeholder-google-client-secret
```

After creating this file, **restart the dev server**:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The error should disappear, but Google sign-in won't work until you complete Option 2.

### Option 2: Full Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select an existing one
3. **Enable Google+ API**
4. **Create OAuth 2.0 Credentials:**
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Configure OAuth consent screen
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. **Copy your Client ID and Client Secret**
6. **Update `.env.local`** with real credentials:
   ```bash
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   ```
7. **Restart the dev server**

### Generate Secure Secret (Production)

For production, generate a secure secret:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Replace `NEXTAUTH_SECRET` in `.env.local` with the generated value.

---

**Note:** The `.env.local` file is gitignored for security, so you'll need to create it manually on each machine.
