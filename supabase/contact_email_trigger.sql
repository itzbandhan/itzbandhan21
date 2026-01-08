-- Run this in Supabase SQL Editor
-- This creates a trigger that sends you an email when someone submits the contact form

-- First, enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create the email notification function
CREATE OR REPLACE FUNCTION notify_contact_submission()
RETURNS TRIGGER AS $$
DECLARE
  email_body TEXT;
BEGIN
  -- Build email body
  email_body := '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' ||
    '<h2 style="color: #6366f1;">New Contact Form Submission</h2>' ||
    '<hr style="border: 1px solid #e5e7eb;">' ||
    '<p><strong>Name:</strong> ' || NEW.name || '</p>' ||
    '<p><strong>Email:</strong> <a href="mailto:' || NEW.email || '">' || NEW.email || '</a></p>' ||
    '<p><strong>Message:</strong></p>' ||
    '<div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">' || 
    REPLACE(NEW.message, E'\n', '<br>') || 
    '</div>' ||
    '<hr style="border: 1px solid #e5e7eb; margin-top: 20px;">' ||
    '<p style="color: #6b7280; font-size: 12px;">Sent from itzbandhan.tech contact form at ' || 
    TO_CHAR(NEW.submitted_at, 'YYYY-MM-DD HH24:MI:SS') || '</p></div>';

  -- Send email using Supabase's auth.email() or your SMTP
  -- This uses the SMTP configured in your Supabase project
  PERFORM net.http_post(
    url := 'https://wcryldcvnqziilneabca.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := jsonb_build_object(
      'to', 'codewithbandhan@gmail.com',
      'subject', 'New Contact: ' || NEW.name,
      'html', email_body,
      'replyTo', NEW.email
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Email notification failed: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on contact_submissions table
DROP TRIGGER IF EXISTS on_contact_submission ON contact_submissions;
CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_submission();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres;
GRANT EXECUTE ON FUNCTION net.http_post TO postgres;
