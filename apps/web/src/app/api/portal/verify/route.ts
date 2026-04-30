/**
 * POST /api/portal/verify
 * Verify a portal token and return submission details
 */
import { checkRateLimit, RATE_LIMITS } from "@repo/queue/rate-limit";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { verifyPortalToken, extractToken } from "@/lib/portal-auth";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (fail-open for availability - allow through if rate limit fails)
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    try {
      const rateLimitResult = await checkRateLimit(
        clientIp,
        "/api/portal/verify",
        RATE_LIMITS.GENERAL_API
      );
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch (rateLimitError) {
      // Rate limiting failed - log but allow request through (fail-open)
      console.error("[portal-verify] Rate limit check failed:", rateLimitError);
    }

    const token = extractToken(request);

    if (!token) {
      console.error("[portal-verify] No token provided in request");
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    let result;
    try {
      result = await verifyPortalToken(token);
    } catch (verifyError) {
      console.error(
        "[portal-verify] Token verification threw:",
        verifyError instanceof Error ? verifyError.message : "Unknown error"
      );
      return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
    }

    if (!result.valid || !result.payload) {
      console.error(`[portal-verify] Token invalid: ${result.error || "Unknown error"}`);
      return NextResponse.json({ error: result.error || "Invalid token" }, { status: 401 });
    }

    // Fetch submission details (non-sensitive only)
    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
    const supabaseServiceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: submission, error } = await supabase
      .from("submissions")
      .select(
        "id, name, email, phone, company, status, created_at, source, " +
          "business_name, business_type, industry, website, years_in_business, " +
          "primary_issue, monthly_volume, monthly_revenue, " +
          "owner_name, owner_email, owner_phone, " +
          "business_address, business_city, business_state, business_zip, " +
          "hardware_needed, bank_name, additional_notes, portal_autosave_data, " +
          "metadata"
      )
      .eq("id", result.payload.sub)
      .single();

    if (error || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Track portal access - update accessed_at timestamp
    // Only update if this is the first access (avoid overwriting on every refresh)
    try {
      const { data: existing, error: existingError } = await supabase
        .from("submissions")
        .select("portal_link_accessed_at")
        .eq("id", result.payload.sub)
        .single();

      if (existingError) {
        console.error("[portal-verify] Failed to check existing access:", existingError);
      } else if (!existing?.portal_link_accessed_at) {
        const { error: updateError } = await supabase
          .from("submissions")
          .update({ portal_link_accessed_at: new Date().toISOString() })
          .eq("id", result.payload.sub);

        if (updateError) {
          console.error("[portal-verify] Failed to update access timestamp:", updateError);
        }
      }
    } catch (trackingError) {
      console.error("[portal-verify] Access tracking failed:", trackingError);
      // Continue - tracking failure shouldn't block portal access
    }

    const sub = submission as unknown as Record<string, unknown> & {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      company: string | null;
      status: string;
      created_at: string;
      source: string | null;
      industry: string | null;
      primary_issue: string | null;
      monthly_volume: string | null;
      business_name: string | null;
      business_type: string | null;
      website: string | null;
      years_in_business: string | null;
      owner_name: string | null;
      owner_email: string | null;
      owner_phone: string | null;
      business_address: string | null;
      business_city: string | null;
      business_state: string | null;
      business_zip: string | null;
      additional_notes: string | null;
      portal_autosave_data: Record<string, unknown> | null;
      metadata: { portal_submitted?: boolean } | null;
    };

    // Fetch existing uploads with error handling
    let uploads: unknown[] = [];
    try {
      const { data: uploadsData, error: uploadsError } = await supabase
        .from("portal_uploads")
        .select("id, original_name, content_type, file_size, created_at")
        .eq("submission_id", result.payload.sub)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (uploadsError) {
        console.error("[portal-verify] Failed to fetch uploads:", uploadsError);
      } else {
        uploads = uploadsData || [];
      }
    } catch (uploadsError) {
      console.error("[portal-verify] Uploads fetch failed:", uploadsError);
    }

    // Fetch messages with error handling
    let messages: unknown[] = [];
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from("portal_messages")
        .select("id, sender, message, created_at")
        .eq("submission_id", result.payload.sub)
        .order("created_at", { ascending: true })
        .limit(50);

      if (messagesError) {
        console.error("[portal-verify] Failed to fetch messages:", messagesError);
      } else {
        messages = messagesData || [];
      }
    } catch (messagesError) {
      console.error("[portal-verify] Messages fetch failed:", messagesError);
    }

    const expDate = new Date(result.payload.exp * 1000);
    const daysLeft = Math.ceil((result.payload.exp - Math.floor(Date.now() / 1000)) / 86400);

    return NextResponse.json(
      {
        valid: true,
        submission: {
          id: sub.id,
          name: sub.name,
          email: sub.email,
          phone: sub.phone || null,
          company: sub.company,
          status: sub.status,
          createdAt: sub.created_at,
          source: sub.source,
          // Quiz pre-fill fields
          industry: sub.industry || null,
          primaryIssue: sub.primary_issue || null,
          monthlyVolume: sub.monthly_volume || null,
          businessName: sub.business_name || sub.company || null,
          // Existing application data
          businessType: sub.business_type || null,
          website: sub.website || null,
          yearsInBusiness: sub.years_in_business || null,
          ownerName: sub.owner_name || null,
          ownerEmail: sub.owner_email || null,
          ownerPhone: sub.owner_phone || null,
          businessAddress: sub.business_address || null,
          businessCity: sub.business_city || null,
          businessState: sub.business_state || null,
          businessZip: sub.business_zip || null,
          additionalNotes: sub.additional_notes || null,
        },
        autosaveData: sub.portal_autosave_data || {},
        uploads: uploads || [],
        messages: messages || [],
        portal: {
          email: result.payload.email,
          expiresAt: expDate.toISOString(),
          daysLeft: Math.max(0, daysLeft),
        },
        isSubmitted: !!sub.metadata?.portal_submitted,
        fieldRequirements: sub.metadata?.field_requirements || null,
      },
      {
        headers: {
          // Set token as httpOnly cookie for subsequent requests
          "Set-Cookie": `portal_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.max(daysLeft * 86400, 1)}`,
        },
      }
    );
  } catch (error) {
    console.error("Portal verify error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
