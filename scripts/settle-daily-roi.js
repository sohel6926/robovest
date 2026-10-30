import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export function getCycleDateKey(date, resetTimeStr = '00:30') {
  const [resetH, resetM] = (resetTimeStr || '00:30').split(':').map(Number);
  const d = new Date(date);
  if (d.getHours() < resetH || (d.getHours() === resetH && d.getMinutes() < (resetM || 0))) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().split('T')[0];
}

export function getInvestmentEligibleCycles(inv, currentDate = new Date(), resetTimeStr = '00:30') {
  if (inv.status !== 'ACTIVE') return Number(inv.days_elapsed || inv.daysElapsed || 0);

  const pDateInput = inv.purchase_timestamp || inv.purchaseTimestamp || inv.created_at;
  const pDate = new Date(Number(pDateInput) || pDateInput);
  if (isNaN(pDate.getTime())) {
    return Math.max(1, Number(inv.days_elapsed || inv.daysElapsed || 0) + 1);
  }

  const purchaseCycleKey = getCycleDateKey(pDate, resetTimeStr);
  const currentCycleKey = getCycleDateKey(currentDate, resetTimeStr);

  const pParts = purchaseCycleKey.split('-').map(Number);
  const cParts = currentCycleKey.split('-').map(Number);

  const pUtc = Date.UTC(pParts[0], pParts[1] - 1, pParts[2]);
  const cUtc = Date.UTC(cParts[0], cParts[1] - 1, cParts[2]);

  const diffDays = Math.max(0, Math.round((cUtc - pUtc) / (1000 * 60 * 60 * 24)));
  const cycles = diffDays + 1; // Purchase cycle is Cycle 1
  return Math.min(cycles, 150);
}

export async function processAllActiveDailyRoi() {
  console.log(`[${new Date().toISOString()}] Starting automated Daily ROI settlement...`);
  
  // 1. Fetch platform settings for reset time
  const { data: settings } = await supabase
    .from('platform_settings')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  const resetTimeStr = settings?.daily_withdrawal_window_start || '00:30';
  const now = new Date();
  const currentCycleKey = getCycleDateKey(now, resetTimeStr);

  // 2. Fetch all active investments
  const { data: activeInvestments, error: invErr } = await supabase
    .from('user_investments')
    .select('*')
    .eq('status', 'ACTIVE');

  if (invErr || !activeInvestments || activeInvestments.length === 0) {
    console.log('No active investments found to process.');
    return { success: true, processedCount: 0, totalDistributed: 0 };
  }

  console.log(`Found ${activeInvestments.length} active contracts.`);
  let totalDistributed = 0;
  let processedContracts = 0;

  // Group by user_id
  const userMap = {};
  for (const inv of activeInvestments) {
    if (!userMap[inv.user_id]) userMap[inv.user_id] = [];
    userMap[inv.user_id].push(inv);
  }

  for (const [userId, invs] of Object.entries(userMap)) {
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!userProfile) continue;

    const { data: existingTxns } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    let userAddedRoi = 0;

    for (const inv of invs) {
      const dailyIncome = Number(inv.daily_income) || 0;
      if (dailyIncome <= 0) continue;

      const eligibleCycles = getInvestmentEligibleCycles(inv, now, resetTimeStr);

      // Determine how many cycles were already credited
      const planRoiTxns = (existingTxns || []).filter(t => 
        t.type === 'DAILY_RETURN' && 
        Number(t.amount) > 0 &&
        (t.reference_id?.includes(inv.id) || t.description?.includes(inv.product_name) || (t.reference_id?.startsWith('ROI-') && t.reference_id?.includes(inv.id.slice(-6))))
      );

      const alreadyCreditedCycles = Math.max(
        planRoiTxns.length,
        Math.floor(Number(inv.total_earned || 0) / dailyIncome)
      );

      const dueCycles = Math.max(0, eligibleCycles - alreadyCreditedCycles);

      if (dueCycles > 0) {
        const dueAmount = dueCycles * dailyIncome;
        userAddedRoi += dueAmount;
        totalDistributed += dueAmount;
        processedContracts++;

        const newDaysElapsed = eligibleCycles;
        const newTotalEarned = alreadyCreditedCycles * dailyIncome + dueAmount;
        const isCompleted = newDaysElapsed >= 150 || newTotalEarned >= (Number(inv.total_invested) * 2);

        console.log(`User ${userProfile.email || userId}: Plan ${inv.product_name} due ${dueCycles} cycle(s) = ₹${dueAmount}`);

        // Insert transaction for each missing day
        for (let d = 1; d <= dueCycles; d++) {
          const cycleNumber = alreadyCreditedCycles + d;
          const roiTxn = {
            id: `TXN-ROI-${inv.id.slice(-6)}-C${cycleNumber}-${Date.now().toString().slice(-4)}`,
            user_id: userId,
            type: 'DAILY_RETURN',
            amount: dailyIncome,
            status: 'COMPLETED',
            timestamp: Date.now() - (dueCycles - d) * 1000,
            formatted_time: new Date().toLocaleString(),
            description: `Daily Return (Cycle ${cycleNumber}) for ${inv.product_name}`,
            reference_id: `ROI-${inv.id}-C${cycleNumber}`
          };
          await supabase.from('transactions').insert(roiTxn);
        }

        // Update investment
        await supabase
          .from('user_investments')
          .update({
            days_elapsed: newDaysElapsed,
            total_earned: newTotalEarned,
            status: isCompleted ? 'COMPLETED' : 'ACTIVE',
            updated_at: new Date().toISOString()
          })
          .eq('id', inv.id);
      }
    }

    if (userAddedRoi > 0) {
      const newAvail = Number(userProfile.available_balance || 0) + userAddedRoi;
      const newWithdr = Number(userProfile.withdrawable_balance || 0) + userAddedRoi;
      const newIncome = Number(userProfile.total_income || 0) + userAddedRoi;

      await supabase
        .from('user_profiles')
        .update({
          available_balance: newAvail,
          withdrawable_balance: newWithdr,
          total_income: newIncome,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      console.log(`User ${userProfile.email || userId} balance updated: ₹${userProfile.available_balance} -> ₹${newAvail}`);
    }
  }

  console.log(`[${new Date().toISOString()}] Succeeded. Processed ${processedContracts} contracts, distributed ₹${totalDistributed}.`);
  return { success: true, processedContracts, totalDistributed };
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('settle-daily-roi.js')) {
  processAllActiveDailyRoi().then(() => process.exit(0)).catch(err => {
    console.error('Settlement error:', err);
    process.exit(1);
  });
}
