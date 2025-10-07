const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://vyvgeovymesdtpetpmrl.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5dmdlb3Z5bWVzZHRwZXRwbXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDk4NDMsImV4cCI6MjA3MjMyNTg0M30.ouQ-3z098WQVyG7d2PVLoB4x5eEjSFWdmYniqW98w-I';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
