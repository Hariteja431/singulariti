/**
 * Validation helpers for different types of inputs used in QR generation.
 */

export function validateURL(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Allows optional +, spaces, dashes, parentheses and digits. Minimum 5 digits.
  const phoneRegex = /^\+?(\d[\s-()]*){5,}$/;
  return phoneRegex.test(phone);
}

export function validateUPI(upiId: string): boolean {
  if (!upiId) return false;
  // UPI ID format: username@bankname
  const upiRegex = /^[\w-.]+@[\w]+$/;
  return upiRegex.test(upiId);
}
