import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://ylervnsmjrtdfkbcmjky.supabase.co';
const supabaseKey = 'sb_publishable_qiZNJW-3OkIfWbT7VuSjoQ_sZBziFzP';

export const supabase = createClient(supabaseUrl, supabaseKey);