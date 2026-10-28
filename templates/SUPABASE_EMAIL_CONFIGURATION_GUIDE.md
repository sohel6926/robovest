# Supabase Authentication & Email OTP Configuration Guide

Both **Registration** and **Forgot Password** in FanCode Pro are built to use a clean **6-digit OTP code** directly in the app. Users never need to click any redirect link.

Follow these 3 quick steps in your **Supabase Dashboard**:

---

## Step 1: Remove Localhost (URL Configuration)
1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard/project/khlwshpucfdkoefknxtp)**.
2. In the left navigation, click **Authentication** > **URL Configuration**.
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

## Step 2: Configure the Signup Verification OTP Template
1. In the left navigation, click **Authentication** > **Email Templates**.
2. Select **Confirm signup**.
3. Set the **Subject** line to:
   ```
   {{ .Token }} is your FanCode Pro verification code
   ```
4. In the **Message Body (HTML)** editor:
   - Delete all existing text.
   - Copy the entire contents of [`templates/email-verification-otp.html`](file:///c:/Users/sohail/OneDrive/Documents/websites/Robovest/templates/email-verification-otp.html).
   - Paste it into the editor.
5. Click **Save**.

---

## Step 3: Configure the Forgot Password Recovery OTP Template
1. Under **Email Templates**, select **Reset password**.
2. Set the **Subject** line to:
   ```
   {{ .Token }} is your FanCode Pro password reset code
   ```
3. In the **Message Body (HTML)** editor:
   - Delete all existing text.
   - Copy the entire contents of [`templates/email-reset-password-otp.html`](file:///c:/Users/sohail/OneDrive/Documents/websites/Robovest/templates/email-reset-password-otp.html).
   - Paste it into the editor.
4. Click **Save**.

---

## How It Works in the App:
- **Registration**: When a user registers, they are asked for the 6-digit OTP received in their Gmail. Once entered, their account and wallet are activated.
- **Forgot Password**: When a user clicks *"Forgot Password?"* on the login screen, they enter their email, receive a 6-digit recovery OTP, and enter the OTP along with their new password directly in the modal to reset their password immediately without clicking any email links.
