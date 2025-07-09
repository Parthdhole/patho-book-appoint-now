
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  patientName: string;
  patientEmail: string;
  testName: string;
  appointmentDate: string;
  appointmentTime: string;
  labName?: string;
  sampleType: string;
  address?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      bookingId,
      patientName,
      patientEmail,
      testName,
      appointmentDate,
      appointmentTime,
      labName,
      sampleType,
      address
    }: BookingConfirmationRequest = await req.json();

    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 24px;">✅ Booking Confirmed!</h1>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${patientName},</h2>
          <p style="color: #666; line-height: 1.6;">
            Your diagnostic test appointment has been successfully booked. Here are your booking details:
          </p>
        </div>

        <div style="background-color: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #3b82f6; margin-top: 0;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Booking ID:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Test Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${testName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Date:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Time:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Collection Type:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${sampleType === 'home' ? 'Home Collection' : 'Visit Lab'}</td>
            </tr>
            ${labName ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Lab:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${labName}</td>
            </tr>
            ` : ''}
            ${address && sampleType === 'home' ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Address:</td>
              <td style="padding: 10px 0;">${address}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">📋 Important Instructions</h3>
          <ul style="color: #856404; padding-left: 20px;">
            <li>Please arrive 15 minutes before your scheduled appointment time</li>
            <li>Bring a valid photo ID for verification</li>
            <li>Fast for 8-12 hours if required for your test</li>
            <li>Save this booking ID: <strong>${bookingId}</strong></li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666;">
            For any questions or to reschedule, contact us at:<br>
            📞 1800-123-4567 | 📧 support@drpatho.com
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Dr. Patho <onboarding@resend.dev>",
      to: [patientEmail],
      subject: `Booking Confirmed - ${testName} Appointment`,
      html: emailHtml,
    });

    console.log("Booking confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
