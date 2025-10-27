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

    const { paymentToken, amount, currency, invoiceNumber, customerEmail, billingInfo } = await req.json();

    if (!paymentToken || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate unique transaction reference
    const uniqueRef = `${invoiceNumber || 'TXN'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const transactionData = new URLSearchParams({
      security_key: nmiSecurityKey,
      payment_token: paymentToken,
      amount: amount.toFixed(2),
      currency: (currency || 'USD').toUpperCase(),
      orderid: uniqueRef,
      order_description: `Flight Booking - ${invoiceNumber}`,
      email: customerEmail || '',
      type: 'sale',
      three_ds_version: '2',
      three_ds_action: 'authenticate_attempt',
    });

    if (billingInfo) {
      if (billingInfo.firstName) transactionData.append('firstname', billingInfo.firstName);
      if (billingInfo.lastName) transactionData.append('lastname', billingInfo.lastName);
      if (billingInfo.address) transactionData.append('address1', billingInfo.address);
      if (billingInfo.city) transactionData.append('city', billingInfo.city);
      if (billingInfo.state) transactionData.append('state', billingInfo.state);
      if (billingInfo.zip) transactionData.append('zip', billingInfo.zip);
      if (billingInfo.country) transactionData.append('country', billingInfo.country);
      if (billingInfo.phone) transactionData.append('phone', billingInfo.phone);
    }

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
    const threeDsUrl = params.get('three_ds_redirect_url');

    // Check if 3DS authentication is required
    if (responseCode === '2' && threeDsUrl) {
      console.log('3DS authentication required:', { transactionId, threeDsUrl });
      return new Response(
        JSON.stringify({
          success: false,
          requires3DS: true,
          redirectUrl: threeDsUrl,
          transactionId: transactionId,
          message: '3D Secure authentication required',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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
