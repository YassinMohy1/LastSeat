import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!stripeSecretKey || !webhookSecret) {
      throw new Error('Stripe configuration missing');
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature provided');
    }

    const body = await req.text();
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureParts = signature.split(',').reduce((acc: any, part) => {
      const [key, value] = part.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const timestamp = signatureParts.t;
    const signedPayload = `${timestamp}.${body}`;
    const expectedSignature = signatureParts.v1;

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBytes(expectedSignature),
      encoder.encode(signedPayload)
    );

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const event = JSON.parse(body);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          payment_status: 'paid',
          payment_method: 'visa',
          paid_at: new Date().toISOString(),
        })
        .eq('payment_link', paymentIntent.metadata?.payment_link);

      if (updateError) {
        console.error('Error updating invoice:', updateError);
      }

      const { data: invoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('payment_link', paymentIntent.metadata?.payment_link)
        .maybeSingle();

      if (invoice) {
        await supabase.from('payments').insert({
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: 'succeeded',
          payment_method: 'visa',
          customer_email: paymentIntent.receipt_email,
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