import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runTest() {
  console.log('Subscribing to realtime transactions channel...');
  
  let received = false;
  const testId = 'RT_TEST_' + Date.now();

  const channel = supabase.channel('realtime-test-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
      console.log('>>> SUCCESS! REALTIME EVENT RECEIVED FROM SUPABASE! <<<');
      console.log('Event Type:', payload.eventType);
      console.log('New Record ID:', payload.new?.id);
      received = true;
    })
    .subscribe(async (status) => {
      console.log('Channel status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('Inserting test transaction into database...');
        const { error } = await supabase.from('transactions').insert({
          id: testId,
          user_id: 'User5294',
          type: 'TEST_PING',
          amount: 5,
          status: 'COMPLETED',
          timestamp: Date.now(),
          formatted_time: new Date().toISOString(),
          description: 'Live Realtime Ping'
        });

        if (error) {
          console.error('Insert failed:', error.message);
        } else {
          console.log('Record inserted successfully, awaiting websocket message...');
        }

        setTimeout(async () => {
          await supabase.from('transactions').delete().eq('id', testId);
          if (received) {
            console.log('Verified: Supabase Realtime is 100% active and working!');
          } else {
            console.log('Warning: No event received within timeout.');
          }
          process.exit(0);
        }, 3500);
      }
    });
}

runTest();
