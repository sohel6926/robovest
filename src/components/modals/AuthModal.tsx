import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Square, 
  Mail, 
  Lock, 
  Gift, 
  ArrowLeft, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  verifyEmailOtp, 
  sendPasswordResetEmail, 
  updateUserPassword, 
  ensureUserProfile 
} from '../../lib/supabase';

type AuthMode = 'login' | 'register' | 'verify_otp' | 'forgot_password' | 'reset_password';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, refreshUserData } = useApp();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [otpToken, setOtpToken] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Reset to login mode every time modal opens
  React.useEffect(() => {
    if (showAuthModal) {
      setMode('login');
      setErrorMessage(null);
      setSuccessNotice(null);
      setOtpToken('');
    }
  }, [showAuthModal]);

  if (!showAuthModal) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetFormState();
    setMode(newMode);
  };

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signInWithEmail(email.trim().toLowerCase(), password);
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Your email is not verified yet. Please enter the OTP sent to your inbox.');
          setMode('verify_otp');
        } else {
          setErrorMessage(error.message || 'Invalid email or password.');
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        await ensureUserProfile(data.user.id, data.user.email!, data.user.user_metadata);
        if (refreshUserData) {
          await refreshUserData(data.user.id);
        }
        setSuccessNotice('Welcome back! Logged in successfully.');
        setTimeout(() => {
          setShowAuthModal(false);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Register (sends OTP / Confirmation to Gmail)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide a valid email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please accept the Terms & Conditions.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail(email.trim().toLowerCase(), password, {
        inviteCode: inviteCode.trim().toUpperCase()
      });

      if (error) {
        setErrorMessage(error.message || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // If session exists immediately
        if (data.session) {
          await ensureUserProfile(data.user.id, data.user.email!, data.user.user_metadata);
          if (refreshUserData) {
            await refreshUserData(data.user.id);
          }
          setSuccessNotice('Registration successful! Welcome to FanCode.');
          setTimeout(() => {
            setShowAuthModal(false);
          }, 1200);
        } else {
          // Supabase sent verification OTP to Gmail
          setSuccessNotice(`Verification code sent to ${email}. Check your Gmail inbox or spam folder!`);
          setMode('verify_otp');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Verify OTP (Email code)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!otpToken.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await verifyEmailOtp(email.trim().toLowerCase(), otpToken.trim(), 'signup');
      if (error) {
        setErrorMessage(error.message || 'Invalid or expired OTP code. Please check your email.');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        await ensureUserProfile(data.user.id, data.user.email!, data.user.user_metadata);
        if (refreshUserData) {
          await refreshUserData(data.user.id);
        }
        setSuccessNotice('Email verified successfully! Welcome to FanCode.');
        setTimeout(() => {
          setShowAuthModal(false);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Forgot Password (Trigger reset email)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await sendPasswordResetEmail(email.trim().toLowerCase());
      if (error) {
        setErrorMessage(error.message || 'Failed to send password reset email.');
        setIsLoading(false);
        return;
      }

      setSuccessNotice(`Password reset instructions sent to ${email}. Please check your inbox.`);
      setMode('reset_password');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!otpToken.trim() || !password.trim()) {
      setErrorMessage('Please provide the verification code and your new password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: otpError } = await verifyEmailOtp(email.trim().toLowerCase(), otpToken.trim(), 'recovery');
      if (otpError) {
        setErrorMessage(otpError.message || 'Invalid recovery code.');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await updateUserPassword(password);
      if (updateError) {
        setErrorMessage(updateError.message || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      setSuccessNotice('Password reset successfully! Please login with your new password.');
      setTimeout(() => {
        setMode('login');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Lockup */}
        <div className="text-center pt-1 space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center">
            <span className="font-black italic text-white text-base tracking-tight">FC</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 font-sans">
            FAN<span className="text-[#FF4A00]">CODE</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Official Live Sports Investment & Yield Ecosystem
          </p>
        </div>

        {/* Tab Switcher (Visible on Login & Register) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Alerts & Feedback */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-tight">{successNotice}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            {/* Email Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => switchMode('forgot_password')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            {/* Email Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password (min 6 chars)"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
            </div>

            {/* Invite Code Field */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Gift className="w-4 h-4 text-orange-500" />
              </span>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Referral Code (Optional)"
                className="w-full bg-transparent py-3 px-3 text-slate-900 uppercase font-mono focus:outline-none"
              />
            </div>

            {/* Terms checkbox */}
            <div
              onClick={() => setAgreedTerms(!agreedTerms)}
              className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-slate-600 select-none"
            >
              {agreedTerms ? (
                <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>
                I agree to the{' '}
                <span className="text-blue-600 font-semibold underline">User Terms & Policies</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        )}

        {/* MODE: VERIFY EMAIL OTP */}
        {mode === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5 text-xs">
            <div className="text-center space-y-1">
              <p className="font-bold text-slate-800 text-sm">Verify Your Email</p>
              <p className="text-[11px] text-slate-500">
                Enter the 6-digit confirmation code sent to <br />
                <span className="font-semibold text-slate-800">{email}</span>
              </p>
            </div>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <KeyRound className="w-4 h-4 text-blue-600" />
              </span>
              <input
                type="text"
                maxLength={8}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="6-Digit OTP Code"
                className="w-full bg-transparent py-3 px-3 text-center text-slate-900 font-mono text-base tracking-widest focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify & Complete</span>
              )}
            </button>

            <div className="flex justify-between items-center pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="text-blue-600 font-semibold hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-3.5 text-xs">
            <div className="text-center space-y-1">
              <p className="font-bold text-slate-800 text-sm">Reset Password</p>
              <p className="text-[11px] text-slate-500">
                Enter your email address to receive recovery instructions.
              </p>
            </div>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Registered Email"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <span>Send Reset Link / OTP</span>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* MODE: RESET PASSWORD WITH OTP */}
        {mode === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
            <div className="text-center space-y-1">
              <p className="font-bold text-slate-800 text-sm">Enter Recovery Code</p>
              <p className="text-[11px] text-slate-500">
                Check your Gmail inbox for the OTP recovery code.
              </p>
            </div>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <KeyRound className="w-4 h-4 text-blue-600" />
              </span>
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="Recovery OTP Code"
                className="w-full bg-transparent py-3 px-3 text-slate-900 font-mono focus:outline-none"
                required
              />
            </div>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password (min 6 chars)"
                className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password & Login</span>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
