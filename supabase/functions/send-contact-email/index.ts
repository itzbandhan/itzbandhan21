// Supabase Edge Function: send-contact-email
// Uses Brevo (Sendinblue) SMTP API
//
// Deploy in Supabase Dashboard > Edge Functions
// Add these secrets:
//   BREVO_API_KEY = your Brevo API key
//   NOTIFY_EMAIL = codewithbandhan@gmail.com

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, email, message } = await req.json()

        const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
        const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') || 'codewithbandhan@gmail.com'

        if (!BREVO_API_KEY) {
            throw new Error('BREVO_API_KEY not configured')
        }

        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1; margin-bottom: 20px;">📬 New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #6366f1;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
          <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          Sent from itzbandhan.tech contact form
        </p>
      </div>
    `

        // 1. Send Notification to Bandhan
        const notificationEmail = fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'itzbandhan.tech', email: 'noreply@itzbandhan.tech' },
                to: [{ email: NOTIFY_EMAIL, name: 'Bandhan Pokhrel' }],
                replyTo: { email: email, name: name },
                subject: `📬 New Contact: ${name}`,
                htmlContent: emailHtml
            })
        })

        // 2. Send Auto-Reply to User
        const autoReplyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1;">Message Received!</h2>
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. I have received your message and will get back to you as soon as possible.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Bandhan Pokhrel</strong></p>
        <p style="color: #6b7280; font-size: 12px;">Full-Stack Developer & Creative Technologist</p>
      </div>
    `

        const autoReplyEmail = fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'Bandhan Pokhrel', email: 'noreply@itzbandhan.tech' },
                to: [{ email: email, name: name }],
                subject: `Message Received - Bandhan Pokhrel`,
                htmlContent: autoReplyHtml
            })
        })

        // Send both emails in parallel
        const [notifRes, replyRes] = await Promise.all([notificationEmail, autoReplyEmail])

        if (!notifRes.ok) {
            const errorData = await notifRes.text()
            console.error('Notification failed:', errorData)
        }

        if (!replyRes.ok) {
            const errorData = await replyRes.text()
            console.error('Auto-reply failed:', errorData)
        }

        if (!notifRes.ok && !replyRes.ok) {
            throw new Error('Failed to send emails')
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Email sent!' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
