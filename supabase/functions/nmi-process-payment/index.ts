import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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

  try {
    const nmiSecurityKey = Deno.env.get('NMI_PRIVATE_KEY');

    if (!nmiSecurityKey) {
      return new Response(
        JSON.stringify({
          error: 'NMI Payment Gateway is not configured.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { paymentToken, amount, currency, invoiceNumber, customerEmail } = await req.json();

    if (!paymentToken || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const transactionData = new URLSearchParams({
      security_key: nmiSecurityKey,
      payment_token: paymentToken,
      amount: amount.toFixed(2),
      currency: (currency || 'USD').toUpperCase(),
      orderid: invoiceNumber || '',
      order_description: `Flight Booking - ${invoiceNumber}`,
      email: customerEmail || '',
      type: 'sale',
    });

    console.log('Processing NMI payment with token:', paymentToken);

    const response = await fetch('https://secure.nmi.com/api/transact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: transactionData.toString(),
    });

    const responseText = await response.text();
    console.log('NMI Response:', responseText);

    const params = new URLSearchParams(responseText);
    const responseCode = params.get('response');
    const responseText2 = params.get('responsetext');
    const transactionId = params.get('transactionid');

    if (responseCode === '1') {
      console.log('Payment successful:', { transactionId, invoiceNumber });
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: transactionId,
          message: 'Payment processed successfully',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      const errorMessage = responseText2 || 'Payment declined';
      console.error('Payment failed:', {
        responseCode,
        responseText: responseText2,
        rawResponse: responseText.substring(0, 500)
      });
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('NMI Payment processing error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Payment processing failed',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});