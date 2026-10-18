import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function verify() {
  const tables = [
    'platform_settings', 
    'investment_products', 
    'user_profiles', 
    'bank_accounts', 
    'transactions', 
    'user_investments', 
    'team_members', 
    'member_plan_holdings', 
    'admin_settings'
  ];

  console.log('Testing Supabase REST queries via Anon Key...');
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*');
    if (error) {
      console.error(`Error on [${t}]:`, error.message);
    } else {
      console.log(`Table [${t}]: successfully fetched ${data.length} records!`);
    }
  }
}

verify();
