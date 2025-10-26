import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SYSTEM_PROMPT = `You are a helpful flight booking assistant for Last Seat Ticket, a discount flight booking service. Your role is to:

- Help customers find the best flight deals
- Answer questions about destinations, prices, and booking
- Guide them through the booking process
- Provide information about our services
- Be friendly, professional, and concise

Key information:
- Company phone: 888-602-6667 (available 24/7)
- We specialize in finding last-minute deals and discounted flights
- We offer personalized service with live agents
- We can help with round-trip, one-way, and multi-city bookings

If a customer has complex questions or wants to book, encourage them to call 888-602-6667 for personalized assistance and exclusive deals.

Keep responses brief and conversational. Use emojis occasionally to be friendly.`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          response: "I'm currently in training mode. For immediate assistance with bookings and personalized deals, please call our expert team at 888-602-6667. They're available 24/7 to help you find the best flights!",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((msg: any) => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm having trouble responding right now. Please call 888-602-6667 for immediate assistance!";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({
        response: "I apologize, but I'm having technical difficulties. For immediate assistance, please call our team at 888-602-6667. We're here to help 24/7!",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});