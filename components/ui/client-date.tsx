"use client";

import { useEffect, useState } from "react";
import { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  formatRelativeTime, 
  formatTableDate 
} from "@/lib/utils/date-formatter";

// Types for component props
export interface DateProps {
  date: Date | string | number;
  format?: 'short' | 'medium' | 'long' | 'full';
  locale?: string;
  className?: string;
}

/**
 * ClientDate - A client-side only date formatter component
 * 
 * This component prevents React hydration errors by rendering a consistent
 * placeholder during SSR, then updating to the properly formatted date
 * on the client side.
 */
export function ClientDate({ 
  date, 
  format = 'medium', 
  locale = 'ar-SA',
  className = ''
}: DateProps) {
  // For SSR, use a stable placeholder that matches across server and client
  const [isClient, setIsClient] = useState(false);
  
  // The formatted date string that will be displayed
  const [formattedDate, setFormattedDate] = useState(() => {
    // Convert to ISO string for initial render to ensure consistency between server/client
    return typeof date === 'string' ? date : 
           date instanceof Date ? date.toISOString() : 
           new Date(date).toISOString();
  });
  
  // After hydration, update the displayed date
  useEffect(() => {
    setIsClient(true);
    setFormattedDate(formatDate(date, format, locale));
  }, [date, format, locale]);
  
  return (
    <span className={className} data-date-value={formattedDate}>
      {isClient ? formattedDate : formattedDate.split('T')[0]}
    </span>
  );
}

/**
 * ClientTime - A client-side only time formatter component
 */
export function ClientTime({ 
  date, 
  format = 'short', 
  locale = 'ar-SA',
  className = ''
}: DateProps & { format?: 'short' | 'medium' | 'long' }) {
  const [isClient, setIsClient] = useState(false);
  const [formattedTime, setFormattedTime] = useState(() => {
    return typeof date === 'string' ? date : 
           date instanceof Date ? date.toISOString() : 
           new Date(date).toISOString();
  });
  
  useEffect(() => {
    setIsClient(true);
    setFormattedTime(formatTime(date, format, locale));
  }, [date, format, locale]);
  
  return (
    <span className={className} data-time-value={formattedTime}>
      {isClient ? formattedTime : formattedTime.split('T')[1]?.slice(0, 5) || '00:00'}
    </span>
  );
}

/**
 * ClientDateTime - A client-side only datetime formatter component
 */
export function ClientDateTime({ 
  date, 
  format = 'medium', 
  locale = 'ar-SA',
  className = ''
}: DateProps & { format?: 'short' | 'medium' | 'long' }) {
  const [isClient, setIsClient] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState(() => {
    return typeof date === 'string' ? date : 
           date instanceof Date ? date.toISOString() : 
           new Date(date).toISOString();
  });
  
  useEffect(() => {
    setIsClient(true);
    setFormattedDateTime(formatDateTime(date, format, locale));
  }, [date, format, locale]);
  
  // Show a simplified version during SSR
  const serverValue = formattedDateTime.replace('T', ' ').slice(0, 16);
  
  return (
    <span className={className} data-datetime-value={formattedDateTime}>
      {isClient ? formattedDateTime : serverValue}
    </span>
  );
}

/**
 * ClientRelativeTime - A client-side only relative time formatter component
 */
export function ClientRelativeTime({ 
  date, 
  locale = 'ar-SA',
  className = ''
}: Omit<DateProps, 'format'>) {
  const [isClient, setIsClient] = useState(false);
  const [formattedTime, setFormattedTime] = useState(() => {
    return typeof date === 'string' ? date : 
           date instanceof Date ? date.toISOString() : 
           new Date(date).toISOString();
  });
  
  useEffect(() => {
    setIsClient(true);
    setFormattedTime(formatRelativeTime(date, locale));
    
    // Set up an interval to refresh relative time every minute
    const intervalId = setInterval(() => {
      setFormattedTime(formatRelativeTime(date, locale));
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [date, locale]);
  
  return (
    <span className={className} data-relative-time-value={formattedTime}>
      {isClient ? formattedTime : formattedTime.split('T')[0]}
    </span>
  );
}

/**
 * ClientTableDate - A client-side only date formatter component for data tables
 * 
 * This version specifically formats dates for use in data tables, using a
 * format that's consistent and easy to sort.
 */
export function ClientTableDate({ 
  date, 
  locale = 'ar-SA',
  className = ''
}: Omit<DateProps, 'format'>) {
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState(() => {
    // Use a stable ISO-like format for initial render
    const dateObj = typeof date === 'string' ? new Date(date) : 
                    date instanceof Date ? date : 
                    new Date(date);
    
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  });
  
  useEffect(() => {
    setIsClient(true);
    setFormattedDate(formatTableDate(date, locale));
  }, [date, locale]);
  
  return (
    <span className={className} data-table-date-value={formattedDate}>
      {formattedDate}
    </span>
  );
}
