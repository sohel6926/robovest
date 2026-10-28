import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupRealtime() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

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

    for (const t of tables) {
      try {
        await client.query(`ALTER TABLE ${t} REPLICA IDENTITY FULL;`);
        console.log(`[SUCCESS] Set REPLICA IDENTITY FULL on ${t}.`);
      } catch (e) {
        console.log(`[INFO] REPLICA IDENTITY on ${t}: ${e.message}`);
      }

      try {
        await client.query(`ALTER PUBLICATION supabase_realtime ADD TABLE ${t};`);
        console.log(`[SUCCESS] Added ${t} to supabase_realtime publication.`);
      } catch (e) {
        // Already in publication
      }
    }

    await client.query("NOTIFY pgrst, 'reload schema';");
    await client.query("NOTIFY pgrst, 'reload config';");
    console.log('Notified PostgREST schema reload.');

    const res = await client.query("SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';");
    console.log('\n--- VERIFIED SUPABASE REALTIME TABLES ---');
    console.log(res.rows.map(r => r.tablename));
    console.log('-----------------------------------------\n');

  } catch (err) {
    console.error('Realtime setup error:', err);
  } finally {
    await client.end();
  }
}

setupRealtime();
