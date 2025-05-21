
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { getDatabaseUrl } from '../../src/config/database.ts';

// Get the database password from environment variable
// This is set in the Supabase dashboard under Settings > Functions
const DB_PASSWORD = Deno.env.get('DB_PASSWORD');

serve(async (req) => {
  try {
    // Create a Supabase client (recommended approach for most operations)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // For operations that require direct database access
    // Only use this when the Supabase client doesn't provide the functionality you need
    if (DB_PASSWORD) {
      const pool = new Pool(getDatabaseUrl(DB_PASSWORD), 3);
      const connection = await pool.connect();
      
      try {
        // Example query
        const result = await connection.queryObject`SELECT * FROM salons LIMIT 5`;
        const salons = result.rows;
        
        return new Response(
          JSON.stringify({ data: salons }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } finally {
        // Always release the connection back to the pool
        connection.release();
      }
    } else {
      throw new Error('Database password environment variable not set');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
