// Example Supabase client initialization
// Install with: npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase variables not set. See .env.example for guidance.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
