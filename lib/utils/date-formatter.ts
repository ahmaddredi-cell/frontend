/**
 * Date Formatter Utility
 * 
 * This utility ensures consistent date formatting between server and client
 * to prevent React hydration errors and provide localized date display.
 */

// Cache for date formatters to improve performance
const formatterCache: Record<string, Intl.DateTimeFormat> = {};

/**
 * Get a cached DateTimeFormat instance with specific options
 */
function getFormatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}-${JSON.stringify(options)}`;
  
  if (!formatterCache[key]) {
    formatterCache[key] = new Intl.DateTimeFormat(locale, options);
  }
  
  return formatterCache[key];
}

/**
 * Format a date as a string with consistent output on server and client
 * 
 * @param date Date to format (Date object or ISO string)
 * @param format Format style to use
 * @param locale Locale to use for formatting (defaults to 'ar-SA' for Arabic)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale = 'ar-SA'
): string {
  // Convert to Date object if string or number
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Define formatting options based on format style
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      break;
    case 'medium':
      options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      break;
    case 'long':
      options = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'full':
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;
  }
  
  // Get cached formatter and format the date
  const formatter = getFormatter(locale, options);
  return formatter.format(dateObj);
}

/**
 * Format a time as a string with consistent output on server and client
 * 
 * @param date Date to format (Date object or ISO string)
 * @param format Format style to use
 * @param locale Locale to use for formatting (defaults to 'ar-SA' for Arabic)
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'short',
  locale = 'ar-SA'
): string {
  // Convert to Date object if string or number
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Define formatting options based on format style
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { hour: '2-digit', minute: '2-digit', hour12: true };
      break;
    case 'medium':
      options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      break;
    case 'long':
      options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short' };
      break;
  }
  
  // Get cached formatter and format the time
  const formatter = getFormatter(locale, options);
  return formatter.format(dateObj);
}

/**
 * Format a datetime as a string with consistent output on server and client
 * 
 * @param date Date to format (Date object or ISO string)
 * @param format Format style to use
 * @param locale Locale to use for formatting (defaults to 'ar-SA' for Arabic)
 * @returns Formatted datetime string
 */
export function formatDateTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale = 'ar-SA'
): string {
  // Convert to Date object if string or number
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Define formatting options based on format style
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
      };
      break;
    case 'medium':
      options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
      };
      break;
    case 'long':
      options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      };
      break;
  }
  
  // Get cached formatter and format the datetime
  const formatter = getFormatter(locale, options);
  return formatter.format(dateObj);
}

/**
 * Format a date in a custom format (YYYY/MM/DD)
 * This is useful for displaying dates in a specific format consistently
 */
export function formatDateToYMD(date: Date | string | number, locale = 'ar-SA'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

/**
 * Format a date to relative time (like "5 minutes ago", "2 days ago", etc.)
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale = 'ar-SA'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  // Use Intl.RelativeTimeFormat for proper localization
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffSec < 60) {
    return rtf.format(-diffSec, 'second');
  } else if (diffMin < 60) {
    return rtf.format(-diffMin, 'minute');
  } else if (diffHour < 24) {
    return rtf.format(-diffHour, 'hour');
  } else if (diffDay < 30) {
    return rtf.format(-diffDay, 'day');
  } else {
    // Fall back to regular date for older dates
    return formatDate(dateObj, 'medium', locale);
  }
}

/**
 * Format a date for display in data tables
 * 
 * This function ensures consistent formatting for server and client rendering
 * to avoid hydration mismatches in Next.js applications
 */
export function formatTableDate(date: Date | string | number, locale = 'ar-SA'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // For tables, use a simple, consistent format: YYYY/MM/DD
  return formatDateToYMD(dateObj, locale);
}

/**
 * Format a time for display in data tables
 */
export function formatTableTime(date: Date | string | number, locale = 'ar-SA'): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Use fixed formatting options to ensure consistency
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const formatter = getFormatter(locale, options);
  return formatter.format(dateObj);
}

// We'll create a separate React component for client-side formatting in another file
