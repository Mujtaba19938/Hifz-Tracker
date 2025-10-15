import { 
  PhoneAuthProvider, 
  signInWithCredential, 
  User,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Platform } from 'react-native';

export interface PhoneAuthResult {
  success: boolean;
  error?: string;
  verificationId?: string;
  user?: User;
}

class FirebasePhoneAuth {
  private verificationId: string | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA verifier for web platform
  private initializeRecaptcha(): RecaptchaVerifier {
    if (Platform.OS === 'web') {
      // For web, we need reCAPTCHA
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        // Create reCAPTCHA container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      
      return this.recaptchaVerifier;
    } else {
      // For React Native, we don't need reCAPTCHA
      // Firebase handles this automatically
      return null as any;
    }
  }

  // Send SMS verification code
  async sendVerificationCode(phoneNumber: string): Promise<PhoneAuthResult> {
    try {
      console.log('Sending SMS to:', phoneNumber);
      
      if (Platform.OS === 'web') {
        // Web platform requires reCAPTCHA
        if (!this.recaptchaVerifier) {
          this.recaptchaVerifier = this.initializeRecaptcha();
        }
        
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          this.recaptchaVerifier
        );
        
        this.verificationId = verificationId;
        return {
          success: true,
          verificationId
        };
      } else {
        // React Native platform - Firebase handles reCAPTCHA automatically
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          null as any // No reCAPTCHA needed for React Native
        );
        
        this.verificationId = verificationId;
        return {
          success: true,
          verificationId
        };
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Verify SMS code and sign in
  async verifyCodeAndSignIn(verificationId: string, code: string): Promise<PhoneAuthResult> {
    try {
      console.log('Verifying code:', code, 'with ID:', verificationId);
      
      // Use real Firebase phone authentication
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      
      console.log('User signed in successfully:', userCredential.user.uid);
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error: any) {
      console.error('Error verifying code:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code';
      case 'auth/code-expired':
        return 'Verification code has expired';
      case 'auth/session-expired':
        return 'Session expired. Please request a new code';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'Authentication failed. Please try again';
    }
  }

  // Clean up
  cleanup() {
    this.verificationId = null;
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

export const firebasePhoneAuth = new FirebasePhoneAuth();
