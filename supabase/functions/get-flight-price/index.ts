import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PriceRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabin: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get('AMADEUS_API_KEY');
    const apiSecret = Deno.env.get('AMADEUS_API_SECRET');

    if (!apiKey || !apiSecret) {
      console.log('Amadeus credentials not found, using fallback pricing');
      const body = await req.json() as PriceRequest;
      return new Response(
        JSON.stringify({
          price: calculateFallbackPrice(
            body.origin,
            body.destination,
            body.adults,
            body.cabin,
            !!body.returnDate
          ),
          currency: 'USD',
          source: 'estimated',
          message: 'Using estimated pricing'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { origin, destination, departureDate, returnDate, adults, cabin } = await req.json() as PriceRequest;

    if (!origin || !destination || !departureDate || !adults) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get Amadeus access token
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to authenticate with Amadeus');
      return new Response(
        JSON.stringify({
          price: calculateFallbackPrice(origin, destination, adults, cabin, !!returnDate),
          currency: 'USD',
          source: 'estimated',
          message: 'Using estimated pricing'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Build flight search parameters
    const searchParams = new URLSearchParams({
      originLocationCode: origin.substring(0, 3).toUpperCase(),
      destinationLocationCode: destination.substring(0, 3).toUpperCase(),
      departureDate: departureDate,
      adults: adults.toString(),
      travelClass: cabin,
      currencyCode: 'USD',
      max: '5',
    });

    if (returnDate) {
      searchParams.append('returnDate', returnDate);
    }

    // Search for flight offers
    const flightResponse = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!flightResponse.ok) {
      const errorData = await flightResponse.text();
      console.error('Amadeus API error:', errorData);

      return new Response(
        JSON.stringify({
          price: calculateFallbackPrice(origin, destination, adults, cabin, !!returnDate),
          currency: 'USD',
          source: 'estimated',
          message: 'Using estimated pricing'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const flightData = await flightResponse.json();

    if (!flightData.data || flightData.data.length === 0) {
      return new Response(
        JSON.stringify({
          price: calculateFallbackPrice(origin, destination, adults, cabin, !!returnDate),
          currency: 'USD',
          source: 'estimated',
          message: 'No flights found, showing estimated price'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the cheapest offer
    const cheapestOffer = flightData.data.reduce((min: any, offer: any) => {
      const price = parseFloat(offer.price.total);
      const minPrice = parseFloat(min.price.total);
      return price < minPrice ? offer : min;
    });

    const totalPrice = parseFloat(cheapestOffer.price.total);
    const pricePerPerson = totalPrice / adults;

    return new Response(
      JSON.stringify({
        price: Math.round(totalPrice),
        pricePerPerson: Math.round(pricePerPerson),
        currency: cheapestOffer.price.currency,
        source: 'amadeus',
        numberOfBookableSeats: cheapestOffer.numberOfBookableSeats || 0,
        validatingAirline: cheapestOffer.validatingAirlineCodes?.[0] || 'Multiple',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching flight price:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch flight price',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateFallbackPrice(
  origin: string,
  destination: string,
  adults: number,
  cabin: string,
  isRoundtrip: boolean
): number {
  let basePrice = 350;

  if (cabin === 'BUSINESS') basePrice *= 2.5;
  if (cabin === 'FIRST') basePrice *= 4;

  if (isRoundtrip) basePrice *= 1.8;

  const fromUpper = origin.toUpperCase();
  const toUpper = destination.toUpperCase();

  const isInternational = fromUpper.length >= 3 && toUpper.length >= 3 &&
                          fromUpper.substring(0, 2) !== toUpper.substring(0, 2);

  if (isInternational) {
    basePrice *= 1.3;
  }

  return Math.round(basePrice * adults);
}
