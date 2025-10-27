import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'NMI Webhook endpoint is ready',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const nmiSigningKey = Deno.env.get('NMI_WEBHOOK_SIGNING_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const params = new URLSearchParams(body);

    const signingKey = params.get('$signingkey');
    const nonce = params.get('$nonce');
    const sig = params.get('$sig');

    if (nmiSigningKey && signingKey) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(nmiSigningKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const dataToVerify = `${nonce}|${signingKey}`;
      const expectedSig = await crypto.subtle.verify(
        'HMAC',
        key,
        hexToBytes(sig || ''),
        encoder.encode(dataToVerify)
      );

      if (!expectedSig) {
        throw new Error('Invalid webhook signature');
      }
    }

    const eventType = params.get('event_type');
    const transactionId = params.get('transaction_id');
    const orderId = params.get('orderid');
    const amount = params.get('amount');
    const responseCode = params.get('response_code');
    const responseText = params.get('responsetext');

    console.log('Webhook received:', { eventType, transactionId, orderId, responseCode });

    if (eventType === 'sale' && responseCode === '100') {
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          payment_status: 'paid',
          payment_method: 'card',
          paid_at: new Date().toISOString(),
        })
        .eq('invoice_number', orderId);

      if (updateError) {
        console.error('Error updating invoice:', updateError);
      }

      const { data: invoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('invoice_number', orderId)
        .maybeSingle();

      if (invoice) {
        await supabase.from('payments').insert({
          payment_intent_id: transactionId,
          amount: parseFloat(amount || '0'),
          currency: 'USD',
          status: 'succeeded',
          payment_method: 'card',
          customer_email: params.get('email') || '',
        });
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
