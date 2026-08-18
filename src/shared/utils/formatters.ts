/**
 * Formatting utilities for Rent.ca
 */

/** Format price in cents to display string: $1,500/mo */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

/** Format price range: $1,500 - $2,000 */
export function formatPriceRange(minCents: number, maxCents?: number | null): string {
  if (!maxCents || maxCents === minCents) {
    return formatPrice(minCents);
  }
  return `${formatPrice(minCents)} - ${formatPrice(maxCents)}`;
}

/** Format address from property fields */
export function formatAddress(property: {
  address_street: string;
  city: string;
  province: string;
}): string {
  return `${property.address_street}, ${property.city}, ${property.province}`;
}

/** Format short address (street only) */
export function formatShortAddress(property: {
  address_street: string;
  city: string;
}): string {
  return `${property.address_street}, ${property.city}`;
}

/** Format relative time: "2 hours ago", "3 days ago" */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

/** Format number with commas: 56,859 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-CA').format(num);
}

/** Format square footage: 745 ft² */
export function formatSqft(sqft: number): string {
  return `${formatNumber(sqft)} ft\u00B2`;
}
