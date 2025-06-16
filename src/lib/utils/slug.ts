/**
 * Converts a string to a URL-friendly slug
 *
 * @param text The text to convert to a slug
 * @returns A slugified version of the input text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with a single hyphen
    .trim();                  // Remove leading/trailing whitespace
}

/**
 * Reverse function to get a readable title from a slug
 * This is approximate and won't perfectly restore the original title
 *
 * @param slug The slug to convert back to a title
 * @returns A readable title from the slug
 */
export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')       // Replace hyphens with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}
