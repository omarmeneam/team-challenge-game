const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ SUPABASE_URL and SUPABASE_KEY are required in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
// This code initializes a Supabase client using the URL and key from environment variables.
// It throws an error if the required variables are not set, ensuring that the application does not run without proper configuration.