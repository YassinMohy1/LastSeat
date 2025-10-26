import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AmadeusTokenResponse {
  access_token: string;
  expires_in: number;
}

interface AmadeusAirport {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

async function getAmadeusToken(): Promise<string> {
  const apiKey = Deno.env.get('AMADEUS_API_KEY');
  const apiSecret = Deno.env.get('AMADEUS_API_SECRET');

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
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

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to get Amadeus access token: ${errorData}`);
  }

  const data: AmadeusTokenResponse = await response.json();
  return data.access_token;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least 2 characters' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const token = await getAmadeusToken();

    const searchResponse = await fetch(
      `https://api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!searchResponse.ok) {
      const errorData = await searchResponse.text();
      throw new Error(`Failed to search airports: ${errorData}`);
    }

    const searchData = await searchResponse.json();
    const airports = searchData.data || [];

    const formattedAirports = airports.map((airport: AmadeusAirport) => ({
      code: airport.iataCode,
      name: airport.name,
      city: airport.address?.cityName || '',
      country: airport.address?.countryName || '',
      displayName: `${airport.name} (${airport.iataCode})`,
      fullName: `${airport.address?.cityName || ''}, ${airport.address?.countryName || ''} - ${airport.name} (${airport.iataCode})`,
    }));

    return new Response(
      JSON.stringify({ airports: formattedAirports }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Airport search error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to search airports',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});