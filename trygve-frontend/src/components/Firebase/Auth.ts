import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { app } from './Config';

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Types for better TypeScript support
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignUpData {
  email?: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export interface SignInData {
  email?: string;
  password?: string;
  phoneNumber?: string;
}

// Authentication Functions

/**
 * Create a new user account with email and password
 */
export const signUpWithEmail = async (userData: SignUpData): Promise<User> => {
  try {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Update user profile if displayName is provided
    if (userData.displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: userData.displayName
      });
    }

    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
      console.log('✅ Email verification sent to:', userData.email);
    }

    console.log('✅ User created successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Sign up error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in user with email and password
 */
export const signInWithEmail = async (userData: SignInData): Promise<User> => {
  try {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }

    const userCredential = await signInWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    console.log('✅ User signed in successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Sign in error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Set up reCAPTCHA verifier for phone authentication
 */
export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('✅ reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.log('⚠️ reCAPTCHA expired');
      }
    });
    
    return recaptchaVerifier;
  } catch (error: any) {
    console.error('❌ reCAPTCHA setup error:', error.message);
    throw new Error('Failed to setup reCAPTCHA');
  }
};

/**
 * Send OTP to phone number
 */
export const sendPhoneOTP = async (
  phoneNumber: string, 
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth, 
      phoneNumber, 
      recaptchaVerifier
    );
    
    console.log('✅ OTP sent to:', phoneNumber);
    return confirmationResult;
  } catch (error: any) {
    console.error('❌ Phone OTP error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Verify OTP and sign in with phone number
 */
export const verifyPhoneOTP = async (
  confirmationResult: ConfirmationResult, 
  otp: string
): Promise<User> => {
  try {
    const userCredential = await confirmationResult.confirm(otp);
    console.log('✅ Phone verification successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ OTP verification error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with phone credential (alternative method)
 */
export const signInWithPhoneCredential = async (
  verificationId: string, 
  verificationCode: string
): Promise<User> => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const userCredential = await signInWithCredential(auth, credential);
    
    console.log('✅ Phone sign in successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Phone credential sign in error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error: any) {
    console.error('❌ Sign out error:', error.message);
    throw new Error('Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent to:', email);
  } catch (error: any) {
    console.error('❌ Password reset error:', error.message);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    await updateProfile(auth.currentUser, updates);
    console.log('✅ User profile updated successfully');
  } catch (error: any) {
    console.error('❌ Profile update error:', error.message);
    throw new Error('Failed to update profile');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = (): UserProfile | null => {
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please try again.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Export auth instance for direct use if needed
export default auth;
