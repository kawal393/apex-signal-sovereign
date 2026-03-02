const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GENERATION_TOPICS = [
  // AUSTRALIA (8 topics)
  { topic: 'ASIC enforcement actions 2018-2026: corporate fraud prosecutions, financial adviser bans, insider trading penalties, market manipulation fines, continuous disclosure breaches', jurisdiction: 'ASIC', country_code: 'AU' },
  { topic: 'APRA and AUSTRAC enforcement 2018-2026: prudential penalties, AML/CTF breaches, bank compliance failures, superannuation enforcement, Westpac AUSTRAC case', jurisdiction: 'APRA/AUSTRAC', country_code: 'AU' },
  { topic: 'ACCC enforcement actions 2018-2026: cartel prosecutions, consumer protection penalties, misleading conduct fines, merger enforcement, unconscionable conduct', jurisdiction: 'ACCC', country_code: 'AU' },
  { topic: 'OAIC and ACMA privacy/telecom enforcement 2018-2026: privacy act penalties, data breach enforcement, spam violations, telemarketing fines', jurisdiction: 'OAIC/ACMA', country_code: 'AU' },
  { topic: 'TGA, CASA, NDIS Commission enforcement 2018-2026: medical device recalls, aviation safety actions, NDIS provider banning orders', jurisdiction: 'TGA/CASA/NDIS', country_code: 'AU' },
  { topic: 'ATO compliance enforcement 2018-2026: tax fraud prosecutions, phoenix company crackdowns, GST fraud penalties, Project Wickenby outcomes', jurisdiction: 'ATO', country_code: 'AU' },
  { topic: 'SafeWork Australia and state WHS prosecutions 2018-2026: workplace fatality prosecutions, industrial manslaughter charges, safety breach penalties', jurisdiction: 'SafeWork', country_code: 'AU' },
  { topic: 'Clean Energy Regulator, FIRB, APVMA enforcement 2018-2026: carbon credit fraud, foreign investment violations, agricultural chemical enforcement', jurisdiction: 'CER/FIRB', country_code: 'AU' },

  // UNITED STATES (12 topics)
  { topic: 'SEC enforcement actions 2018-2026: securities fraud, insider trading, crypto enforcement, Ponzi schemes, whistleblower awards, accounting fraud penalties', jurisdiction: 'SEC', country_code: 'US' },
  { topic: 'SEC continued: market manipulation, SPAC enforcement, ESG greenwashing, broker-dealer violations, investment adviser fraud 2020-2026', jurisdiction: 'SEC', country_code: 'US' },
  { topic: 'FTC enforcement 2018-2026: Big Tech antitrust, consumer protection, privacy violations, data security, deceptive advertising, merger challenges', jurisdiction: 'FTC', country_code: 'US' },
  { topic: 'FDA enforcement 2018-2026: drug recalls, warning letters, pharmaceutical fraud, medical device violations, food safety enforcement', jurisdiction: 'FDA', country_code: 'US' },
  { topic: 'EPA and OSHA enforcement 2018-2026: environmental penalties, Clean Air Act violations, toxic waste fines, workplace safety citations, willful violations', jurisdiction: 'EPA/OSHA', country_code: 'US' },
  { topic: 'DOJ antitrust and corporate fraud prosecutions 2018-2026: price-fixing cartels, merger challenges, FCPA violations, corporate criminal penalties', jurisdiction: 'DOJ', country_code: 'US' },
  { topic: 'CFPB consumer financial enforcement 2018-2026: predatory lending, unfair banking practices, student loan servicer penalties, credit reporting violations', jurisdiction: 'CFPB', country_code: 'US' },
  { topic: 'CFTC and FINRA enforcement 2018-2026: commodity fraud, crypto derivatives, spoofing penalties, broker misconduct, market manipulation fines', jurisdiction: 'CFTC/FINRA', country_code: 'US' },
  { topic: 'FinCEN, OFAC sanctions enforcement 2018-2026: AML penalties, sanctions violations, crypto mixer enforcement, bank secrecy act violations', jurisdiction: 'FinCEN/OFAC', country_code: 'US' },
  { topic: 'State AG enforcement actions 2018-2026: NY AG financial fraud, CA AG CCPA privacy penalties, TX AG consumer protection, multistate settlements', jurisdiction: 'State AGs', country_code: 'US' },
  { topic: 'NHTSA, FAA, FCC enforcement 2018-2026: vehicle safety recalls, aviation safety penalties, telecommunications violations, spectrum enforcement', jurisdiction: 'NHTSA/FAA/FCC', country_code: 'US' },
  { topic: 'HHS HIPAA enforcement 2018-2026: healthcare data breaches, privacy violations, right of access penalties, hospital settlement agreements', jurisdiction: 'HHS', country_code: 'US' },

  // UNITED KINGDOM (6 topics)
  { topic: 'FCA enforcement actions 2018-2026: financial misconduct fines, AML failures, consumer duty breaches, crypto enforcement, insurance violations', jurisdiction: 'FCA', country_code: 'UK' },
  { topic: 'FCA continued and PRA enforcement 2018-2026: market abuse fines, senior manager accountability, prudential penalties, bank capital breaches', jurisdiction: 'FCA/PRA', country_code: 'UK' },
  { topic: 'ICO data protection enforcement 2018-2026: UK GDPR fines, data breach penalties, direct marketing violations, public sector data failures', jurisdiction: 'ICO', country_code: 'UK' },
  { topic: 'CMA competition enforcement 2018-2026: merger blocks, digital markets enforcement, cartel fines, consumer protection penalties', jurisdiction: 'CMA', country_code: 'UK' },
  { topic: 'SFO and OFSI enforcement 2018-2026: serious fraud prosecutions, bribery cases, sanctions violations, deferred prosecution agreements', jurisdiction: 'SFO/OFSI', country_code: 'UK' },
  { topic: 'HSE, Ofgem, Ofcom, EA enforcement 2018-2026: workplace safety prosecutions, energy company penalties, telecoms fines, environmental penalties', jurisdiction: 'HSE/Ofgem', country_code: 'UK' },

  // EUROPEAN UNION (8 topics)
  { topic: 'GDPR major enforcement fines 2018-2026: Meta, Google, Amazon fines, cross-border enforcement, data transfer violations, consent failures', jurisdiction: 'GDPR', country_code: 'EU' },
  { topic: 'GDPR continued: Ireland DPC Big Tech fines, France CNIL penalties, Italy Garante enforcement, Spain AEPD actions 2019-2026', jurisdiction: 'GDPR DPAs', country_code: 'EU' },
  { topic: 'EU AI Act and Digital Services Act enforcement 2023-2026: platform accountability, algorithmic transparency, content moderation requirements', jurisdiction: 'AI Act/DSA', country_code: 'EU' },
  { topic: 'Digital Markets Act gatekeeper enforcement 2023-2026: Apple, Google, Meta, Amazon, Microsoft compliance actions', jurisdiction: 'DMA', country_code: 'EU' },
  { topic: 'European Commission antitrust enforcement 2018-2026: tech company fines, cartel penalties, state aid decisions, merger blocks', jurisdiction: 'EC Competition', country_code: 'EU' },
  { topic: 'ESMA, EBA, EIOPA enforcement 2018-2026: securities market violations, banking supervision, insurance regulation, MiFID breaches', jurisdiction: 'ESMA/EBA', country_code: 'EU' },
  { topic: 'EU MiCA crypto enforcement and DORA digital resilience 2024-2026: crypto exchange compliance, digital operational resilience penalties', jurisdiction: 'MiCA/DORA', country_code: 'EU' },
  { topic: 'Netherlands, Poland, Sweden, Norway, Austria, Belgium GDPR enforcement fines 2018-2026: national DPA actions, cross-border cases', jurisdiction: 'GDPR Nordic/Benelux', country_code: 'EU' },

  // GERMANY (3 topics)
  { topic: 'BaFin enforcement actions 2018-2026: Wirecard fallout, financial supervision penalties, crypto enforcement, AML failures, bank compliance', jurisdiction: 'BaFin', country_code: 'DE' },
  { topic: 'Bundeskartellamt competition enforcement 2018-2026: Big Tech abuse of dominance, cartel penalties, digital platform regulation', jurisdiction: 'Bundeskartellamt', country_code: 'DE' },
  { topic: 'German data protection and BSI cybersecurity enforcement 2018-2026: state DPA fines, critical infrastructure penalties', jurisdiction: 'DPA/BSI', country_code: 'DE' },

  // FRANCE (2 topics)
  { topic: 'CNIL data protection enforcement 2018-2026: major GDPR fines, cookie consent penalties, AI surveillance enforcement, Big Tech fines', jurisdiction: 'CNIL', country_code: 'FR' },
  { topic: 'AMF, ACPR, Autorite de la concurrence enforcement 2018-2026: securities penalties, banking compliance, antitrust fines', jurisdiction: 'AMF/Competition', country_code: 'FR' },

  // JAPAN (3 topics)
  { topic: 'Japan FSA and SESC enforcement 2018-2026: financial penalties, crypto exchange enforcement, insider trading, market manipulation', jurisdiction: 'FSA/SESC', country_code: 'JP' },
  { topic: 'Japan JFTC antitrust enforcement 2018-2026: cartel penalties, tech company enforcement, subcontracting violations', jurisdiction: 'JFTC', country_code: 'JP' },
  { topic: 'Japan PPC, PMDA, METI enforcement 2018-2026: data protection, pharmaceutical enforcement, trade regulation', jurisdiction: 'PPC/PMDA', country_code: 'JP' },

  // SINGAPORE (2 topics)
  { topic: 'MAS Singapore financial enforcement 2018-2026: AML penalties, crypto regulation, bank compliance, capital market violations', jurisdiction: 'MAS', country_code: 'SG' },
  { topic: 'PDPC, CCCS, CSA Singapore enforcement 2018-2026: data protection fines, competition penalties, cybersecurity enforcement', jurisdiction: 'PDPC/CCCS', country_code: 'SG' },

  // INDIA (3 topics)
  { topic: 'SEBI enforcement 2018-2026: insider trading penalties, market manipulation fines, mutual fund violations, corporate governance breaches', jurisdiction: 'SEBI', country_code: 'IN' },
  { topic: 'RBI and CCI enforcement 2018-2026: bank penalties, antitrust fines against tech companies, NBFC enforcement, digital lending violations', jurisdiction: 'RBI/CCI', country_code: 'IN' },
  { topic: 'India ED, TRAI, IRDAI enforcement 2018-2026: money laundering actions, telecom penalties, insurance enforcement, FEMA violations', jurisdiction: 'ED/TRAI', country_code: 'IN' },

  // UAE/MIDDLE EAST (2 topics)
  { topic: 'DFSA, VARA, ADGM enforcement 2018-2026: Dubai financial penalties, crypto regulation enforcement, Abu Dhabi financial centre violations', jurisdiction: 'DFSA/VARA', country_code: 'AE' },
  { topic: 'Saudi CMA, Qatar QFCRA, Bahrain CBB enforcement 2018-2026: securities penalties, financial compliance actions', jurisdiction: 'CMA/QFCRA', country_code: 'SA' },

  // SOUTH KOREA (2 topics)
  { topic: 'Korea KFTC antitrust enforcement 2018-2026: Big Tech penalties, chaebol enforcement, platform regulation, cartel fines', jurisdiction: 'KFTC', country_code: 'KR' },
  { topic: 'Korea FSC, FSS, PIPC enforcement 2018-2026: financial penalties, crypto exchange enforcement, data protection fines', jurisdiction: 'FSC/PIPC', country_code: 'KR' },

  // BRAZIL (2 topics)
  { topic: 'Brazil CADE antitrust and CVM securities enforcement 2018-2026: competition penalties, cartel fines, securities fraud, market manipulation', jurisdiction: 'CADE/CVM', country_code: 'BR' },
  { topic: 'Brazil ANPD LGPD, BCB, IBAMA enforcement 2018-2026: data protection fines, banking penalties, environmental enforcement', jurisdiction: 'ANPD/BCB', country_code: 'BR' },

  // CANADA (2 topics)
  { topic: 'Canada OSC, CSA securities enforcement 2018-2026: fraud penalties, insider trading, crypto enforcement, prospectus violations', jurisdiction: 'OSC/CSA', country_code: 'CA' },
  { topic: 'Canada Competition Bureau, OPC, FINTRAC enforcement 2018-2026: antitrust penalties, privacy enforcement, AML violations', jurisdiction: 'CompBureau/OPC', country_code: 'CA' },

  // SOUTH AFRICA (1 topic)
  { topic: 'South Africa FSCA, CompCom, InfoReg enforcement 2018-2026: financial penalties, competition fines, POPIA data protection enforcement', jurisdiction: 'FSCA/CompCom', country_code: 'ZA' },

  // NEW ZEALAND (1 topic)
  { topic: 'New Zealand FMA, Commerce Commission, WorkSafe enforcement 2018-2026: financial penalties, competition fines, workplace safety prosecutions', jurisdiction: 'FMA/ComCom', country_code: 'NZ' },

  // HONG KONG (1 topic)
  { topic: 'Hong Kong SFC, HKMA, PCPD enforcement 2018-2026: securities penalties, banking enforcement, data privacy fines, crypto regulation', jurisdiction: 'SFC/HKMA', country_code: 'HK' },

  // SWITZERLAND (1 topic)
  { topic: 'FINMA, FDPIC, COMCO enforcement 2018-2026: banking penalties, crypto enforcement, data protection fines, competition violations', jurisdiction: 'FINMA', country_code: 'CH' },

  // OTHER REGIONS (4 topics)
  { topic: 'Nigeria SEC, Kenya CMA, Israel ISA enforcement 2018-2026: securities penalties, financial regulation enforcement, market violations', jurisdiction: 'Africa/Israel', country_code: 'NG' },
  { topic: 'Turkey CMB, Thailand SEC, Vietnam SSC enforcement 2018-2026: securities penalties, market regulation, financial compliance', jurisdiction: 'Turkey/SEA', country_code: 'TR' },
  { topic: 'Indonesia OJK, Malaysia SC, Philippines SEC enforcement 2018-2026: financial penalties, securities enforcement, banking violations', jurisdiction: 'ASEAN', country_code: 'ID' },
  { topic: 'Colombia SFC, Chile CMF, Peru SMV, Mexico CNBV enforcement 2018-2026: securities penalties, antitrust fines, financial compliance', jurisdiction: 'LatAm', country_code: 'MX' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get('batch') || '0');
    const batchSize = 2;
    const startIdx = batch * batchSize;
    const topics = GENERATION_TOPICS.slice(startIdx, startIdx + batchSize);

    if (topics.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No more batches', total_topics: GENERATION_TOPICS.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalInserted = 0;
    const errors: string[] = [];

    for (const topic of topics) {
      try {
        console.log(`Generating regulatory records for: ${topic.jurisdiction} (${topic.country_code})`);

        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are an expert on global regulatory enforcement. Generate a JSON array of 20-30 REAL, historically accurate regulatory enforcement records. Each must be a real or highly plausible enforcement action.

Each record MUST have:
- "title": Concise title of the enforcement action (max 120 chars), e.g. "SEC Fines XYZ Corp $2.3M for Insider Trading"
- "summary": 2-3 sentence factual summary including who was penalized, what they did, and the outcome
- "severity": "critical" for criminal/major fines/$1M+, "moderate" for significant penalties/bans, "informational" for guidance/warnings
- "source_url": Plausible official regulator URL (e.g., https://www.sec.gov/enforcement, https://www.fca.org.uk/news, https://www.asic.gov.au/about-asic/news-centre)
- "source_domain": Domain of the source (e.g., sec.gov, fca.org.uk, asic.gov.au)

CRITICAL RULES:
1. Reference REAL companies and regulators
2. Dates should be spread across 2018-2026
3. Include mix of severity levels
4. Each record must be UNIQUE
5. Descriptions should be specific with real penalty amounts
6. Return ONLY the JSON array, no markdown`
              },
              {
                role: 'user',
                content: `Generate 20-30 unique regulatory enforcement records for: ${topic.topic}`
              },
            ],
            max_tokens: 8000,
          }),
        });

        if (!aiRes.ok) {
          errors.push(`AI failed for ${topic.jurisdiction}: ${aiRes.status}`);
          continue;
        }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';

        let records: any[] = [];
        try {
          const jsonStr = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          records = JSON.parse(jsonStr);
          if (!Array.isArray(records)) records = [];
        } catch {
          errors.push(`Parse failed for ${topic.jurisdiction}`);
          continue;
        }

        console.log(`Generated ${records.length} records for ${topic.jurisdiction} (${topic.country_code})`);

        for (const record of records) {
          if (!record.title || record.title.length < 10) continue;

          const encoder = new TextEncoder();
          const hashInput = `${record.title}|${topic.jurisdiction}|${topic.country_code}|${record.summary?.slice(0, 50)}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          let sourceDomain = topic.jurisdiction;
          try { if (record.source_url) sourceDomain = new URL(record.source_url).hostname; } catch {}

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              country_code: topic.country_code,
              jurisdiction: topic.jurisdiction,
              title: record.title.slice(0, 200),
              summary: record.summary || record.title,
              source_url: record.source_url || `https://${sourceDomain}`,
              source_domain: record.source_domain || sourceDomain,
              content_hash: contentHash,
              severity: ['critical', 'moderate', 'informational'].includes(record.severity) ? record.severity : 'informational',
            }),
          });

          if (insertRes.ok || insertRes.status === 201) {
            totalInserted++;
          } else if (insertRes.status === 409) {
            // duplicate
          } else {
            const errText = await insertRes.text();
            console.error(`Insert failed: ${insertRes.status} ${errText}`);
          }
        }
      } catch (err) {
        console.error(`Error for ${topic.jurisdiction}:`, err);
        errors.push(`${topic.jurisdiction}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      inserted: totalInserted,
      batch,
      topics_in_batch: topics.length,
      total_topics: GENERATION_TOPICS.length,
      total_batches: Math.ceil(GENERATION_TOPICS.length / batchSize),
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Regulatory monitor error:', error);
    return new Response(JSON.stringify({ error: 'Monitor failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
