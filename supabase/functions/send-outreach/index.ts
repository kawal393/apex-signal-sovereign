import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SENDER_EMAIL = "apexinfrastructure369@gmail.com";
const SENDER_NAME = "APEX Infrastructure";

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  ndis: {
    subject: "Compliance Intelligence for NDIS Providers — APEX Infrastructure",
    body: `Dear {{contact_name}},

I'm reaching out from APEX Infrastructure — we provide structured compliance intelligence for NDIS providers.

Our system monitors NDIS Commission enforcement actions, banning orders, and compliance notices in real-time across all Australian jurisdictions. We've identified patterns that directly impact providers in {{state}}.

What we offer:
• Real-time NDIS enforcement monitoring (free Watchtower access)
• Structured Verdict Briefs for specific compliance decisions ($249)
• Audit-ready compliance evidence chains

You can view our live intelligence feed at: https://apex-signal-sovereign.lovable.app/ndis-watchtower

Would a 15-minute call be useful to discuss how this applies to {{company_name}}?

Best regards,
APEX Infrastructure
Regulatory Compliance Intelligence
https://apex-signal-sovereign.lovable.app`,
  },
  mining: {
    subject: "Mining Regulatory Intelligence — APEX Infrastructure",
    body: `Dear {{contact_name}},

APEX Infrastructure monitors mining safety violations, environmental enforcement actions, and regulatory changes across all Australian states.

Our Mining Watchtower tracks real-time enforcement data that impacts operators in {{state}}.

What we provide:
• Live mining enforcement monitoring (free access)
• Structured risk verdicts for operational decisions ($249)
• Cross-jurisdictional compliance analysis

View our live feed: https://apex-signal-sovereign.lovable.app/mining-watchtower

Would it be worth a brief conversation about how {{company_name}} could use this intelligence?

Best regards,
APEX Infrastructure
https://apex-signal-sovereign.lovable.app`,
  },
  pharma: {
    subject: "TGA & Pharmaceutical Regulatory Intelligence — APEX",
    body: `Dear {{contact_name}},

APEX Infrastructure provides real-time monitoring of TGA recalls, safety alerts, and ARTG changes that affect pharmaceutical and biotech companies.

Our intelligence system tracks regulatory signals across Australia and global markets — helping compliance teams stay ahead of enforcement trends.

Services:
• Live TGA enforcement monitoring
• Structured Verdict Briefs for regulatory decisions ($249)
• Cross-market compliance intelligence

Would a conversation about how this applies to {{company_name}} be valuable?

Best regards,
APEX Infrastructure
https://apex-signal-sovereign.lovable.app`,
  },
  legal: {
    subject: "Regulatory Compliance Intelligence for Legal Teams — APEX",
    body: `Dear {{contact_name}},

APEX Infrastructure provides structured compliance intelligence across NDIS, mining, pharma, and corporate sectors — the kind of intelligence that informs legal strategy.

Our Verdict Briefs deliver structured risk assessments with clear advance/hold/drop recommendations, backed by real enforcement data.

For law firms and compliance advisors:
• Cross-sector regulatory monitoring
• Verdict Briefs for client advisory ($249 standard / $999 complex)
• Partner program with 50% referral commission

Would it be worth discussing how APEX could support {{company_name}}'s advisory work?

Best regards,
APEX Infrastructure
https://apex-signal-sovereign.lovable.app`,
  },
};

function personalizeEmail(template: { subject: string; body: string }, lead: any): { subject: string; body: string } {
  const contactName = lead.contact_name || "Team";
  const companyName = lead.company_name || "your organization";
  const state = lead.state || "Australia";

  return {
    subject: template.subject
      .replace(/\{\{contact_name\}\}/g, contactName)
      .replace(/\{\{company_name\}\}/g, companyName)
      .replace(/\{\{state\}\}/g, state),
    body: template.body
      .replace(/\{\{contact_name\}\}/g, contactName)
      .replace(/\{\{company_name\}\}/g, companyName)
      .replace(/\{\{state\}\}/g, state),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sector = "ndis", limit = 5, dry_run = false } = await req.json();

    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!gmailPassword) throw new Error("GMAIL_APP_PASSWORD not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get leads that haven't been contacted yet
    const { data: leads, error: leadsError } = await supabase
      .from("outreach_leads")
      .select("*")
      .eq("sector", sector)
      .eq("status", "new")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (leadsError) throw leadsError;
    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No new leads to contact", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const template = EMAIL_TEMPLATES[sector] || EMAIL_TEMPLATES.ndis;
    let sent = 0;
    const errors: string[] = [];

    if (!dry_run) {
      // Connect to Gmail SMTP
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: SENDER_EMAIL,
            password: gmailPassword,
          },
        },
      });

      for (const lead of leads) {
        try {
          const personalized = personalizeEmail(template, lead);

          await client.send({
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            to: lead.email,
            subject: personalized.subject,
            content: personalized.body,
          });

          // Log the email
          await supabase.from("outreach_emails").insert({
            lead_id: lead.id,
            subject: personalized.subject,
            body_preview: personalized.body.slice(0, 300),
            status: "sent",
            sent_at: new Date().toISOString(),
            template_used: sector,
          });

          // Update lead status
          await supabase
            .from("outreach_leads")
            .update({
              status: "contacted",
              last_contacted_at: new Date().toISOString(),
            })
            .eq("id", lead.id);

          sent++;
          console.log(`Email sent to: ${lead.email}`);

          // Rate limit: wait 3 seconds between emails
          await new Promise((r) => setTimeout(r, 3000));
        } catch (emailErr) {
          const errMsg = `Failed to email ${lead.email}: ${emailErr.message}`;
          console.error(errMsg);
          errors.push(errMsg);

          await supabase.from("outreach_emails").insert({
            lead_id: lead.id,
            subject: personalizeEmail(template, lead).subject,
            status: "failed",
            error_message: emailErr.message,
            template_used: sector,
          });
        }
      }

      await client.close();
    } else {
      // Dry run — just preview
      sent = leads.length;
    }

    // Log the run
    await supabase.from("scraper_runs").insert({
      scraper_name: `send-outreach-${sector}`,
      records_found: leads.length,
      records_inserted: sent,
      duration_ms: 0,
      status: errors.length > 0 ? "partial" : "completed",
      errors: errors.length > 0 ? errors : null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        sector,
        leads_found: leads.length,
        emails_sent: sent,
        errors: errors.length,
        dry_run,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Outreach error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
