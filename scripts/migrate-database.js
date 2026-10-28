import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required to run migrations.');
  process.exit(1);
}

console.log('Connecting to Postgres via:', connectionString.replace(/:[^:]*@/, ':****@'));

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const schemaSQL = `
-- 1. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  min_recharge NUMERIC NOT NULL DEFAULT 520,
  min_withdrawal NUMERIC NOT NULL DEFAULT 150,
  withdrawal_fee_percent NUMERIC NOT NULL DEFAULT 10,
  daily_withdrawal_window_start TEXT NOT NULL DEFAULT '00:30',
  daily_withdrawal_window_end TEXT NOT NULL DEFAULT '17:00',
  enforce_next_day_withdrawal_lock BOOLEAN NOT NULL DEFAULT true,
  telegram_support_url TEXT NOT NULL DEFAULT 'https://t.me/fancode_support',
  telegram_channel_url TEXT NOT NULL DEFAULT 'https://t.me/fancode_official',
  platform_announcement TEXT NOT NULL DEFAULT 'FanCode Official Sports Investment Platform. Daily yields processing 24/7.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVESTMENT PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS investment_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  robot_model TEXT NOT NULL,
  price NUMERIC NOT NULL,
  daily_income NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 150,
  total_return NUMERIC NOT NULL,
  bonus NUMERIC NOT NULL DEFAULT 0,
  min_purchase INTEGER NOT NULL DEFAULT 1,
  max_purchase INTEGER NOT NULL DEFAULT 10,
  requires_prior_investment BOOLEAN NOT NULL DEFAULT false,
  image TEXT NOT NULL,
  image_position TEXT DEFAULT 'object-center',
  badge TEXT,
  tier TEXT NOT NULL DEFAULT 'Standard',
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY DEFAULT 'User5294',
  phone TEXT NOT NULL DEFAULT '+91 98452 77192',
  password TEXT NOT NULL DEFAULT 'password123',
  invite_code TEXT NOT NULL DEFAULT '203C03',
  inviter_code TEXT DEFAULT 'TOP_ADMIN',
  vip_level INTEGER NOT NULL DEFAULT 1,
  available_balance NUMERIC NOT NULL DEFAULT 4000,
  withdrawable_balance NUMERIC NOT NULL DEFAULT 850,
  total_recharge NUMERIC NOT NULL DEFAULT 4000,
  total_income NUMERIC NOT NULL DEFAULT 1357.6,
  is_logged_in BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BANK ACCOUNTS
CREATE TABLE IF NOT EXISTS bank_accounts (
  id TEXT PRIMARY KEY DEFAULT 'bank_main',
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  account_holder TEXT NOT NULL DEFAULT 'Rahul Sharma',
  account_number TEXT NOT NULL DEFAULT '50100492817264',
  ifsc_code TEXT NOT NULL DEFAULT 'HDFC0001234',
  bank_name TEXT NOT NULL DEFAULT 'HDFC Bank',
  upi_id TEXT DEFAULT 'rahul.fancode@okaxis',
  is_bound BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  timestamp BIGINT NOT NULL,
  formatted_time TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  fee NUMERIC DEFAULT 0,
  net_amount NUMERIC DEFAULT 0,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER INVESTMENTS
CREATE TABLE IF NOT EXISTS user_investments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  robot_model TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_invested NUMERIC NOT NULL,
  daily_income NUMERIC NOT NULL,
  bonus_received NUMERIC NOT NULL DEFAULT 0,
  purchase_timestamp BIGINT NOT NULL,
  purchase_date_formatted TEXT NOT NULL,
  days_elapsed INTEGER NOT NULL DEFAULT 0,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  next_payout_countdown TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TEAM MEMBERS (Referral Network)
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  join_date TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  inviter_id TEXT DEFAULT 'User5294 (You)',
  invite_count INTEGER NOT NULL DEFAULT 0,
  recharge_amount NUMERIC NOT NULL DEFAULT 0,
  team_invested NUMERIC NOT NULL DEFAULT 0,
  commission_generated NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEMBER PLAN HOLDINGS
CREATE TABLE IF NOT EXISTS member_plan_holdings (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  robot_model TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_invested NUMERIC NOT NULL,
  daily_yield NUMERIC NOT NULL,
  purchase_date TEXT NOT NULL,
  days_elapsed INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 150,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DAILY WITHDRAWAL LOGS
CREATE TABLE IF NOT EXISTS daily_withdrawal_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  formatted_date TEXT NOT NULL,
  total_requested NUMERIC NOT NULL DEFAULT 0,
  total_fees NUMERIC NOT NULL DEFAULT 0,
  total_net NUMERIC NOT NULL DEFAULT 0,
  total_requests INTEGER NOT NULL DEFAULT 0,
  completed_amount NUMERIC NOT NULL DEFAULT 0,
  processing_amount NUMERIC NOT NULL DEFAULT 0,
  rejected_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ADMIN SETTINGS
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'admin_config',
  admin_pin TEXT NOT NULL DEFAULT 'admin888',
  backup_pins JSONB NOT NULL DEFAULT '["admin", "1234"]'::jsonb,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY & OPEN POLICIES FOR SUPABASE CLIENT ACCESS
DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'platform_settings', 
    'investment_products', 
    'user_profiles', 
    'bank_accounts', 
    'transactions', 
    'user_investments', 
    'team_members', 
    'member_plan_holdings', 
    'daily_withdrawal_logs', 
    'admin_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public access on %s" ON %I;', t, t);
    EXECUTE format('CREATE POLICY "Public access on %s" ON %I FOR ALL USING (true) WITH CHECK (true);', t, t);
    EXECUTE format('GRANT ALL ON TABLE %I TO anon, authenticated, service_role;', t);
  END LOOP;
END $$;
`;

const seedSQL = `
-- SEED PLATFORM SETTINGS
INSERT INTO platform_settings (id, min_recharge, min_withdrawal, withdrawal_fee_percent, daily_withdrawal_window_start, daily_withdrawal_window_end, enforce_next_day_withdrawal_lock, telegram_support_url, telegram_channel_url, platform_announcement)
VALUES ('default', 520, 150, 10, '00:30', '17:00', true, 'https://t.me/fancode_support', 'https://t.me/fancode_official', 'FanCode Official Sports Investment Platform. Daily yields processing 24/7.')
ON CONFLICT (id) DO NOTHING;

-- ADMIN SETTINGS SEED (Preserve Admin Access)

-- SEED ADMIN SETTINGS
INSERT INTO admin_settings (id, admin_pin, backup_pins)
VALUES ('admin_config', 'admin888', '["admin", "1234"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- SEED INVESTMENT PRODUCTS
INSERT INTO investment_products (id, name, tagline, robot_model, price, daily_income, duration_days, total_return, bonus, min_purchase, max_purchase, requires_prior_investment, image, image_position, badge, tier, specs, is_active)
VALUES
('A', 'Product A', 'FanCode Premier League Cricket Tier', 'Cricket Premier League', 5200, 130, 150, 19500, 50, 1, 10, false, '/src/assets/images/fancode_cricket_card.jpg', 'object-center', 'POPULAR', 'Standard', '["Daily Payout ₹130", "150 Days Duration", "Instant ₹50 Bonus"]'::jsonb, true),
('B', 'Product B', 'FanCode Formula 1 Velocity Grand Prix', 'Formula 1 Grand Prix', 2100, 500, 150, 75000, 100, 1, 10, false, '/src/assets/images/fancode_f1_card.jpg', 'object-center', 'BEST VALUE', 'Standard', '["Daily Payout ₹500", "150 Days Duration", "Instant ₹100 Bonus"]'::jsonb, true),
('C', 'Product C', 'FanCode Champions League Striker League', 'Football Champions League', 4000, 950, 150, 142500, 250, 1, 10, false, '/src/assets/images/fancode_football_card.jpg', 'object-center', 'HIGH GROWTH', 'Standard', '["Daily Payout ₹950", "150 Days Duration", "Instant ₹250 Bonus"]'::jsonb, true),
('D', 'Product D', 'FanCode NBA Slam Dunk Arena Championship', 'Basketball NBA Pro Arena', 8200, 2000, 150, 300000, 500, 1, 10, false, '/src/assets/images/fancode_basketball_card.jpg', 'object-center', 'SUPER TIER', 'Standard', '["Daily Payout ₹2,000", "150 Days Duration", "Instant ₹500 Bonus"]'::jsonb, true),
('E', 'Product E', 'FanCode Grand Slam Tennis Masters', 'Tennis Grand Slam Masters', 15500, 3500, 150, 525000, 1200, 1, 10, true, '/src/assets/images/fancode_tennis_card.jpg', 'object-center', 'VIP ELITE', 'Elite', '["Requires Product A, B, C, or D", "Daily Payout ₹3,500", "Instant ₹1,200 Bonus"]'::jsonb, true),
('F', 'Product F', 'FanCode World Badminton Super Series', 'Badminton World Tour Series', 35000, 8000, 150, 1200000, 3000, 1, 10, true, '/src/assets/images/fancode_badminton_card.jpg', 'object-center', 'EXECUTIVE ELITE', 'Elite', '["Requires Product A, B, C, or D", "Daily Payout ₹8,000", "Instant ₹3,000 Bonus"]'::jsonb, true),
('G', 'Product G', 'FanCode Heavyweight Boxing Championship', 'Combat Heavyweight World Title', 75000, 16500, 150, 2475000, 5000, 1, 10, true, '/src/assets/images/fancode_boxing_card.jpg', 'object-center', 'APEX MASTERPIECE', 'Quantum Apex', '["Requires Product A, B, C, or D", "Daily Payout ₹16,500", "Instant ₹5,000 Bonus"]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  robot_model = EXCLUDED.robot_model,
  price = EXCLUDED.price,
  daily_income = EXCLUDED.daily_income,
  total_return = EXCLUDED.total_return,
  bonus = EXCLUDED.bonus,
  specs = EXCLUDED.specs;

-- Clean production schema initialized without dummy seed data
`;

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL via Pooler successfully!');
    
    console.log('Creating database tables and security policies...');
    await client.query(schemaSQL);
    console.log('Tables and RLS policies created successfully!');

    console.log('Seeding initial data...');
    await client.query(seedSQL);
    console.log('Seed data inserted successfully!');

    // Notify PostgREST to reload schema
    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('PostgREST schema reloaded!');

    // Verify row counts
    const tables = [
      'platform_settings', 
      'investment_products', 
      'user_profiles', 
      'bank_accounts', 
      'transactions', 
      'user_investments', 
      'team_members', 
      'member_plan_holdings', 
      'daily_withdrawal_logs', 
      'admin_settings'
    ];

    console.log('\n--- VERIFICATION SUMMARY ---');
    for (const t of tables) {
      const res = await client.query('SELECT COUNT(*) FROM ' + t + ';');
      console.log('Table [' + t + ']: ' + res.rows[0].count + ' rows');
    }
    console.log('--- ALL TABLES CREATED & READY ---\n');

  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
