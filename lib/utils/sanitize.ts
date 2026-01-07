/**
 * Sanitization utilities for PocketBase and general input handling.
 */

/**
 * Escapes quotes and special characters for safe use in PocketBase filter strings.
 */
export function sanitizeForPocketbaseFilter(value: string): string {
  if (!value) return '';

  // Remove SQL injection patterns
  const sqlPatterns = [
    /\b(or|and)\s+\d+\s*=\s*\d+/gi,
    /\b(drop|delete|insert|update|exec|declare|create|alter)\b/gi,
    /--/g,
    /;/g,
    /\bunion\s+select\b/gi
  ];

  let cleaned = value;
  for (const pattern of sqlPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Escape special characters
  cleaned = cleaned
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');

  // Validate against allowlist of safe characters
  const allowlistRegex = /[^\w\s\-_.@/:.,!?()\[\]{}]/g;
  cleaned = cleaned.replace(allowlistRegex, '');

  return cleaned.trim();
}

/**
 * Validates if a string matches the PocketBase record ID format.
 * PocketBase IDs are typically 15 characters of alphanumeric text.
 */
export function validatePocketbaseId(id: string): boolean {
  if (!id) return false;
  const regex = /^[a-z0-9]{15}$/;
  return regex.test(id);
}

/**
 * Performs basic email sanitization.
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  let cleaned = email.trim().toLowerCase();

  // Remove invalid characters
  const invalidChars = /[^a-z0-9.@_\-+]/g;
  cleaned = cleaned.replace(invalidChars, '');

  // Prevent multiple @ signs
  const parts = cleaned.split('@');
  if (parts.length > 2) {
    cleaned = `${parts[0]}@${parts[parts.length - 1]}`;
  }

  return cleaned;
}

/**
 * Validates and clamps pagination parameters.
 */
export function clampPagination(
  page: number,
  limit: number,
  maxLimit = 100
): { page: number; limit: number } {
  const numPage = Number(page);
  const numLimit = Number(limit);

  const sanitizedPage = isNaN(numPage) || numPage < 1 ? 1 : Math.floor(numPage);
  const sanitizedLimit = isNaN(numLimit) ? 20 : Math.min(maxLimit, Math.max(1, Math.floor(numLimit)));

  return {
    page: sanitizedPage,
    limit: sanitizedLimit
  };
}

/**
 * Validates password strength.
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
