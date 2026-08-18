/** Generate URL-safe slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/** Generate property slug: "123-main-street-id-abc123" */
export function propertySlug(address: string, id: string): string {
  return `${slugify(address)}-id${id.slice(0, 8)}`;
}

/** Extract property ID from slug: "123-main-street-id-abc123" -> "abc123..." */
export function extractIdFromSlug(slug: string): string | null {
  const match = slug.match(/-id([a-f0-9-]+)$/);
  return match ? match[1] : null;
}
