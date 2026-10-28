import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateDb() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // 1. Ensure user_profiles has email column and proper indexing
    await client.query("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;");
    await client.query("CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);");
    console.log('[SUCCESS] user_profiles.email column ensured.');

    // 2. Update admin_settings to Sri@2026
    await client.query(`
      INSERT INTO admin_settings (id, admin_pin, backup_pins, is_locked)
      VALUES ('admin_config', 'Sri@2026', '["admin888", "Sri@2026"]'::jsonb, false)
      ON CONFLICT (id) DO UPDATE SET 
        admin_pin = 'Sri@2026', 
        backup_pins = '["admin888", "Sri@2026"]'::jsonb, 
        is_locked = false,
        updated_at = NOW();
    `);
    console.log('[SUCCESS] Admin PIN/password set to Sri@2026.');

    const res = await client.query("SELECT * FROM admin_settings WHERE id = 'admin_config';");
    console.log('Verified Admin Settings:', res.rows[0]);

  } catch (err) {
    console.error('Error updating DB:', err);
  } finally {
    await client.end();
  }
}

updateDb();
