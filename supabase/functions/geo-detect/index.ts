const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Simple in-memory cache (per instance)
const cache = new Map<string, { data: any; expires: number }>();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get visitor IP from headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '';

    // Check cache
    const cached = cache.get(ip);
    if (cached && cached.expires > Date.now()) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call free geolocation API
    const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,currency,timezone`);
    const geoData = await geoRes.json();

    let result;
    if (geoData.status === 'success') {
      result = {
        country: geoData.country,
        countryCode: geoData.countryCode,
        city: geoData.city,
        currency: geoData.currency || 'AUD',
        timezone: geoData.timezone,
      };
    } else {
      // Fallback to AU
      result = {
        country: 'Australia',
        countryCode: 'AU',
        city: 'Sydney',
        currency: 'AUD',
        timezone: 'Australia/Sydney',
      };
    }

    // Cache for 24 hours
    cache.set(ip, { data: result, expires: Date.now() + 86400000 });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Geo-detect error:', error);
    // Fallback
    const fallback = {
      country: 'Australia',
      countryCode: 'AU',
      city: 'Sydney',
      currency: 'AUD',
      timezone: 'Australia/Sydney',
    };
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
