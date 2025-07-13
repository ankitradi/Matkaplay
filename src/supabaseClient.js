import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqayakkxhfzatqwguwhm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYXlha2t4aGZ6YXRxd2d1d2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjU4NTEsImV4cCI6MjA2Nzg0MTg1MX0.mV9aF84egQAWwGZkHAiiLPBuiJiYCrJpsFZxSqktRB8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
