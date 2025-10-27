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
          error: 'NMI Payment Gateway is not configured. Please contact support.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { amount, currency, description, customerEmail, invoiceNumber, redirectUrl } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const threeStepUrl = 'https://secure.nmi.com/api/v2/three-step';

    const step1Data = new URLSearchParams({
      security_key: nmiSecurityKey,
      amount: amount.toFixed(2),
      currency: (currency || 'USD').toUpperCase(),
      redirect_url: redirectUrl || '',
      order_description: description || 'Flight Booking',
      orderid: invoiceNumber || '',
      email: customerEmail || '',
    });

    console.log('Sending Three-Step request to NMI...');

    const response = await fetch(threeStepUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: step1Data.toString(),
    });

    const responseText = await response.text();
    console.log('NMI Raw Response:', responseText);

    const params = new URLSearchParams(responseText);
    const formUrl = params.get('form-url');
    const tokenId = params.get('token-id');

    if (!formUrl || !tokenId) {
      const errorMessage = params.get('error-message') || 'Payment initialization failed';
      console.error('NMI Error:', {
        error: errorMessage,
        rawResponse: responseText.substring(0, 500)
      });
      throw new Error(errorMessage);
    }

    console.log('Three-Step initialized successfully:', { tokenId, formUrl });

    return new Response(
      JSON.stringify({
        formUrl: formUrl,
        tokenId: tokenId,
        success: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('NMI Payment error:', error);
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