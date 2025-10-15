import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { firebasePhoneAuth } from '@/services/firebaseAuth';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
}

interface RegistrationData {
  masjidName: string;
  masjidAddress: string;
  city: string;
  country: string;
  adminName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationFlow, setVerificationFlow] = useState<'signin' | 'forgot-password' | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber || '',
          name: firebaseUser.displayName || 'User',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      // For now, we'll use the old method for password-based sign in
      // In a real app, you'd integrate with your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        phoneNumber,
        name: 'Teacher',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const sendVerificationCode = useCallback(async (phoneNumber: string, flow: 'signin' | 'forgot-password' = 'signin') => {
    setIsLoading(true);
    try {
      // Format phone number to include country code if not present
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const result = await firebasePhoneAuth.sendVerificationCode(formattedPhoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setVerificationFlow(flow);
      }
      
      return result;
    } catch (error) {
      console.error('Send verification error:', error);
      return { success: false, error: 'Failed to send code' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      if (!verificationId) {
        return { success: false, error: 'No verification ID found. Please request a new code.' };
      }

      const result = await firebasePhoneAuth.verifyCodeAndSignIn(verificationId, code);
      
      if (result.success) {
        setVerificationId(null); // Clear verification ID after successful verification
        // Don't clear verificationFlow here - we need it for routing
      }
      
      return { ...result, flow: verificationFlow };
    } catch (error) {
      console.error('Verify code error:', error);
      return { success: false, error: 'Invalid code' };
    } finally {
      setIsLoading(false);
    }
  }, [verificationId]);

  const resetPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegistrationData) => {
    setIsLoading(true);
    try {
      console.log('Registering masjid:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Don't set user as authenticated after registration
      // User should sign in separately with their credentials
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      verificationId,
      verificationFlow,
      signIn,
      signOut,
      sendVerificationCode,
      verifyCode,
      resetPassword,
      register,
    }),
    [user, isLoading, verificationId, verificationFlow, signIn, signOut, sendVerificationCode, verifyCode, resetPassword, register]
  );
});
