/**
 * Generate a unique receipt number
 * Format: JBP-YYYYMMDD-XXXXXX (6 random alphanumeric)
 */
export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JBP-${year}${month}${day}-${random}`;
}

/**
 * Generate a URL-friendly slug from a string
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

