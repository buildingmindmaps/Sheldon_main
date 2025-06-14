// Firebase configuration
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  connectAuthEmulator,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  EmailAuthProvider,
  linkWithCredential,
  updateProfile,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from 'firebase/auth';
import { validatePasswordStrength, checkBruteForce } from './security';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOSaTItAmjnoWrd6zYIAk0lESBPU1flmM",
  authDomain: "sheldonai-f7ad7.firebaseapp.com",
  projectId: "sheldonai-f7ad7",
  storageBucket: "sheldonai-f7ad7.appspot.com", // Corrected storage bucket
  messagingSenderId: "886109846750",
  appId: "1:886109846750:web:693c21e77e0dec5737964f",
  measurementId: "G-YK0K870EGB"
};

// Initialize Firebase first
const app = initializeApp(firebaseConfig);

// Then initialize auth with the app
const auth = getAuth(app);

// Set up providers after auth is initialized
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  'display': 'popup'
});

// Authentication helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error) {
    console.error("Error signing in with Facebook: ", error);
    throw error;
  }
};

// Updated sign up function with email verification
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // Validate password strength
    const validationResult = validatePasswordStrength(password);
    if (!validationResult.isValid) {
      // Instead of throwing a generic error, throw an error with the specific validation message
      const error = new Error(validationResult.message);
      // Add a custom property to identify this as a password validation error
      (error as any).code = 'auth/password-validation-failed';
      throw error;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
      // Return the user credential
      return userCredential;
    }
    throw new Error("Failed to create user");
  } catch (error) {
    console.error("Error signing up with email: ", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string, ip: string = "unknown") => {
  try {
    // Check for brute force attempts
    const isLocked = checkBruteForce(email, ip);
    if (isLocked) {
      throw new Error("Too many login attempts. Account temporarily locked for security reasons.");
    }

    const result = await signInWithEmailAndPassword(auth, email, password);

    // If the user's email is not verified, we might want to restrict access
    if (result.user && !result.user.emailVerified) {
      console.warn("User email not verified");
      // You might want to handle this case based on your security requirements
      // e.g., throw new Error("Please verify your email before signing in");
    }

    return result;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    throw error;
  }
};

// Function to check if email is verified
export const isEmailVerified = (user: User | null) => {
  return user?.emailVerified || false;
};

// Function to resend verification email
export const resendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw error;
  }
};

// Function for password reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw error;
  }
};

// Function to update user profile (name, photo, etc.)
export const updateUserProfile = async (user: User, displayName?: string, photoURL?: string) => {
  try {
    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL
    });
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Add MFA enrollment function
export const enrollMFA = async (user: User, phoneNumber: string, verificationCode: string, verificationId: string) => {
  try {
    const multiFactorSession = await multiFactor(user).getSession();

    // Create phone credential
    const phoneAuthCredential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    // MFA assertion
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

    // Enroll the user
    await multiFactor(user).enroll(multiFactorAssertion, "Phone Number");
    return true;
  } catch (error) {
    console.error("Error enrolling in MFA: ", error);
    throw error;
  }
};

// Function to initiate MFA enrollment process
export const initiateMFAEnrollment = async (user: User, phoneNumber: string) => {
  try {
    const auth = getAuth();
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneNumber,
      multiFactor(user)
    );
    return verificationId;
  } catch (error) {
    console.error("Error initiating MFA enrollment: ", error);
    throw error;
  }
};

export const logOut = () => signOut(auth);

// Export auth instance for use in other files
export { auth, onAuthStateChanged };
export type { User };














