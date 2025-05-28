/**
 * Utility functions for consistent date handling throughout the app
 */

/**
 * Format a date for display in the UI
 */
export const formatDisplayDate = (date?: string | Date | null): string => {
  if (!date) return 'Not set';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    // Format as readable date (e.g., "Jan 15, 2024")
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a date for form input (YYYY-MM-DD)
 */
export const formatInputDate = (date?: string | Date | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    // Format as YYYY-MM-DD for HTML date input
    return dateObj.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Parse a date string and return a Date object or null
 */
export const parseDate = (dateString?: string | null): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Check if a date is valid
 */
export const isValidDate = (date?: string | Date | null): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Check if a date is overdue (past today)
 */
export const isOverdue = (date?: string | Date | null): boolean => {
  if (!date || !isValidDate(date)) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  return dateObj < today;
};

/**
 * Check if a date is due soon (within next 3 days)
 */
export const isDueSoon = (date?: string | Date | null): boolean => {
  if (!date || !isValidDate(date)) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  today.setHours(0, 0, 0, 0);
  threeDaysFromNow.setHours(23, 59, 59, 999);
  
  return dateObj >= today && dateObj <= threeDaysFromNow;
};

/**
 * Get relative time string (e.g., "3 days ago", "in 2 days")
 */
export const getRelativeTime = (date?: string | Date | null): string => {
  if (!date || !isValidDate(date)) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  
  return '';
};

/**
 * Validate date range (start date should be before end date)
 */
export const validateDateRange = (startDate?: string | Date | null, endDate?: string | Date | null): {
  isValid: boolean;
  error?: string;
} => {
  if (!startDate && !endDate) {
    return { isValid: true };
  }
  
  if (startDate && !isValidDate(startDate)) {
    return { isValid: false, error: 'Start date is invalid' };
  }
  
  if (endDate && !isValidDate(endDate)) {
    return { isValid: false, error: 'End date is invalid' };
  }
  
  if (startDate && endDate) {
    const start = parseDate(typeof startDate === 'string' ? startDate : startDate.toISOString());
    const end = parseDate(typeof endDate === 'string' ? endDate : endDate.toISOString());
    
    if (start && end && start > end) {
      return { isValid: false, error: 'Start date must be before end date' };
    }
  }
  
  return { isValid: true };
};