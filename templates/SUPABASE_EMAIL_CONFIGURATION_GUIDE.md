# Supabase Authentication & Email OTP Configuration Guide

To complete the setup so that Supabase sends the 6-digit OTP code directly (instead of a plain text link that redirects to localhost), follow these simple steps in your **Supabase Dashboard**:

---

## Step 1: Fix Site URL & Redirect URLs (Removes Localhost)
1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard/project/khlwshpucfdkoefknxtp)**.
2. In the left sidebar, click **Authentication** > **URL Configuration**.
3. Under **Site URL**, change `http://localhost:3000` to:
   ```
   https://robovest.vercel.app
   ```
4. Under **Redirect URLs**, click **Add URL** and add:
   ```
   https://robovest.vercel.app/**
   ```
5. Click **Save Changes**.

---

## Step 2: Configure the OTP Email Template
1. In the Supabase left sidebar, click **Authentication** > **Email Templates**.
2. Select **Confirm signup**.
3. Set the **Subject** line to:
   ```
   {{ .Token }} is your FanCode Pro verification code
   ```
4. In the **Message Body (HTML)** editor:
   - Select and delete all existing default text.
   - Copy the entire contents of [`templates/email-verification-otp.html`](file:///c:/Users/sohail/OneDrive/Documents/websites/Robovest/templates/email-verification-otp.html).
   - Paste it into the editor.
5. Click **Save**.

---

## Step 3: Verification
1. Open [`https://robovest.vercel.app/#register`](https://robovest.vercel.app/#register).
2. Enter your email and a password.
3. Check your Gmail inbox — you will receive the custom FanCode Pro branded email containing the 6-digit OTP code (`{{ .Token }}`).
4. Enter the 6-digit code in the FanCode app to immediately verify and activate your wallet.
