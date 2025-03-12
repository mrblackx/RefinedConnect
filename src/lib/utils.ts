import { format } from 'date-fns';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  } catch (error) {
    return dateString;
  }
}

/**
 * Extract initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Generate a random color based on a string (for avatar backgrounds)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 80%)`; // Using HSL for better readability
} 