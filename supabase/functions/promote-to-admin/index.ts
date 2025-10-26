import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PromoteRequest {
  customerId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminUser || adminUser.role !== "admin" || !adminUser.is_active) {
      throw new Error("Only active admins can promote users");
    }

    const { customerId }: PromoteRequest = await req.json();

    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .maybeSingle();

    if (customerError || !customer) {
      throw new Error("Customer not found");
    }

    const { error: insertError } = await supabase
      .from("admin_users")
      .insert({
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        full_name: customer.full_name,
        phone: customer.phone,
        city: customer.city,
        role: "admin",
        is_active: true,
      });

    if (insertError) {
      throw insertError;
    }

    const { error: deleteError } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Customer promoted to admin successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to promote customer",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});