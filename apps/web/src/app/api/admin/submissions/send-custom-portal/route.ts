import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, requirements, sendEmail = true } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique portal token
    const portalToken = crypto.randomUUID();

    // Update submission with custom requirements in metadata
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        portal_token: portalToken,
        metadata: {
          field_requirements: requirements,
          custom_portal: true,
          portal_link_sent_at: new Date().toISOString(),
        },
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw updateError;
    }

    // Get submission data for email
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('owner_email, owner_name, business_name')
      .eq('id', submissionId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
    }

    let emailResult = null;
    if (sendEmail && submission?.owner_email) {
      const portalLink = `${process.env.NEXT_PUBLIC_APP_URL}/portal/verify?token=${portalToken}`;

      // TODO: Integrate with your email sending (Resend, SendGrid, etc.)
      // For now, log the email details
      console.log('=== CUSTOM PORTAL LINK EMAIL ===');
      console.log('To:', submission.owner_email);
      console.log('Name:', submission.owner_name || submission.business_name);
      console.log('Link:', portalLink);
      console.log('Requirements:', requirements);
      console.log('=================================');

      emailResult = {
        to: submission.owner_email,
        link: portalLink,
      };
    }

    return NextResponse.json({
      success: true,
      portalToken,
      email: submission?.owner_email,
      emailSent: !!emailResult,
    });
  } catch (error) {
    console.error('Error sending custom portal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send portal link' },
      { status: 500 }
    );
  }
}