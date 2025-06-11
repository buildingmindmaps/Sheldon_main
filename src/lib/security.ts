// Security utility functions for the application

/**
 * Password strength checker
 * Returns an object with validity and feedback message
 */
export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}

export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  // Minimum password requirements
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (!hasUppercase) {
    return {
      isValid: false,
      message: 'Password must include at least one uppercase letter'
    };
  }

  if (!hasLowercase) {
    return {
      isValid: false,
      message: 'Password must include at least one lowercase letter'
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      message: 'Password must include at least one number'
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must include at least one special character'
    };
  }

  // Check for common passwords (simplified - would use a more comprehensive list in production)
  const commonPasswords = ['Password123!', 'Admin123!', 'Welcome1!', 'Qwerty123!'];
  if (commonPasswords.includes(password)) {
    return {
      isValid: false,
      message: 'This is a commonly used password. Please choose a more unique password'
    };
  }

  return {
    isValid: true,
    message: 'Password meets all requirements'
  };
};

/**
 * Check for brute force attempts
 */
interface BruteForceAttempt {
  ip: string;
  email: string;
  attempts: number;
  lastAttempt: Date;
  locked: boolean;
}

const loginAttempts = new Map<string, BruteForceAttempt>();

export const checkBruteForce = (email: string, ip: string): boolean => {
  const key = `${email}:${ip}`;
  const now = new Date();
  const attemptsData = loginAttempts.get(key);

  if (!attemptsData) {
    // First attempt
    loginAttempts.set(key, {
      ip,
      email,
      attempts: 1,
      lastAttempt: now,
      locked: false
    });
    return false;
  }

  // Reset attempts if it's been more than 30 minutes since last attempt
  const timeDiff = now.getTime() - attemptsData.lastAttempt.getTime();
  if (timeDiff > 30 * 60 * 1000) {
    loginAttempts.set(key, {
      ip,
      email,
      attempts: 1,
      lastAttempt: now,
      locked: false
    });
    return false;
  }

  // Check if account is locked
  if (attemptsData.locked) {
    return true;
  }

  // Increment attempts
  attemptsData.attempts += 1;
  attemptsData.lastAttempt = now;

  // Lock account after 5 failed attempts
  if (attemptsData.attempts >= 5) {
    attemptsData.locked = true;

    // Auto-unlock after 1 hour (in a real app, this would be more sophisticated)
    setTimeout(() => {
      const currentData = loginAttempts.get(key);
      if (currentData) {
        currentData.locked = false;
        currentData.attempts = 0;
        loginAttempts.set(key, currentData);
      }
    }, 60 * 60 * 1000);
  }

  loginAttempts.set(key, attemptsData);
  return attemptsData.locked;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate a secure random token
 */
export const generateSecureToken = (length = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
