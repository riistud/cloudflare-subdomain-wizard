import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Domain to Zone ID mapping
const ZONE_MAP: Record<string, string> = {
  "riicode.my.id": "efd675db96cf23e8bdad098a644036fd", // User needs to replace with actual Zone ID
  "riistore-vvip.my.id": "8f1df1a638ec92208b0b5b453159eec6", // User needs to replace with actual Zone ID
};

interface DnsRecordRequest {
  domain: string;
  alias: string;
  target: string;
  type: "A" | "AAAA" | "CNAME" | "TXT";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain, alias, target, type }: DnsRecordRequest = await req.json();

    // Validate input
    if (!domain || !alias || !target || !type) {
      throw new Error("Missing required fields");
    }

    // Get Zone ID for the domain
    const zoneId = ZONE_MAP[domain];
    if (!zoneId || zoneId.startsWith("YOUR_ZONE_ID")) {
      throw new Error(`Zone ID not configured for domain: ${domain}. Please contact administrator.`);
    }

    // Get Cloudflare API token from environment
    const apiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');
    if (!apiToken) {
      throw new Error('Cloudflare API token not configured');
    }

    // Create full subdomain name
    const fullDomain = `${alias}.${domain}`;

    console.log(`Creating DNS record: ${fullDomain} -> ${target} (${type})`);

    // Prepare DNS record data
    const dnsRecordData: any = {
      type,
      name: fullDomain,
      content: target,
      ttl: 1, // Auto TTL
      proxied: false,
    };

    // For CNAME records, ensure target doesn't end with a dot unless necessary
    if (type === "CNAME" && !target.endsWith('.')) {
      dnsRecordData.content = target;
    }

    // Call Cloudflare API to create DNS record
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dnsRecordData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Cloudflare API error:', result);
      throw new Error(result.errors?.[0]?.message || 'Failed to create DNS record');
    }

    console.log('DNS record created successfully:', result);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.result,
        message: `Successfully created ${type} record for ${fullDomain}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-subdomain function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
