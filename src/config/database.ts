
/**
 * Database configuration
 * NOTE: This file should not contain any sensitive credentials in the frontend code.
 * All direct database operations should be handled through Supabase client
 * or through secure backend services.
 */

// Database connection configuration
export const dbConfig = {
  // Reference to Supabase project
  projectId: 'jxqdslpzqcavzchpsrrp',
  
  // Public API endpoint (safe to include in frontend)
  apiUrl: 'https://jxqdslpzqcavzchpsrrp.supabase.co',
  
  // Use environment-specific configuration
  isDevelopment: import.meta.env.DEV,
};

/**
 * Get database connection string for backend services only.
 * This should NEVER be used in frontend code that gets sent to the browser.
 * Only use in secure environments like edge functions.
 */
export const getDatabaseUrl = (password: string): string => {
  if (!password) {
    throw new Error('Database password is required');
  }
  
  return `postgresql://postgres:${password}@db.jxqdslpzqcavzchpsrrp.supabase.co:5432/postgres`;
};
