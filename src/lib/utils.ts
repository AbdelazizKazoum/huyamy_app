/**
 * Generates a URL-friendly slug from a string.
 * Replaces spaces with hyphens, converts to lowercase, and removes special characters.
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9-]+/g, "") // Remove all non-alphanumeric chars except Arabic and hyphens
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
