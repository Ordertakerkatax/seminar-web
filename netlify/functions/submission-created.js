// netlify/functions/submission-created.js

// We're using the Resend SDK to send emails
import { Resend } from 'resend';

// The handler function is the entry point for the Netlify Function
exports.handler = async function(event, context) {
  // Get the Resend API key from the environment variables
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Netlify sends form data as a string, so we need to parse it
    const payload = JSON.parse(event.body).payload;
    const formData = payload.data;

    // Extract the data we need from the form submission
    const fullName = formData.fullName;
    const email = formData.email;
    const ticketNameDisplay = formData.ticketNameDisplay; // From your JS
    const displayPrice = parseFloat(formData.displayPrice); // From your JS

    // Log the data for debugging (you can see this in your Netlify function logs)
    console.log("Received submission for:", email);

    // Send the email using Resend
    await resend.emails.send({
      from: 'RAFT Seminar <no-reply@taxspecialista.com>', // IMPORTANT: Use a verified sender from Resend
      to: email, // The email address from the form
      subject: '✅ Your RAFT LoA Seminar Registration is Received! (July 19, 2025)', // Updated subject line
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { font-size: 24px; font-weight: bold; color: #4A00E0; margin-bottom: 20px; }
            .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Registration Confirmation</div>
            <p>Hello ${fullName},</p>
            <p>Thank you for registering for the <strong>RAFT LoA Seminar: BIR Criminal-Grade Investigations</strong>. We have received your preliminary registration details.</p>
            
            <div class="details">
              <p><strong>Ticket Type:</strong> ${ticketNameDisplay}</p>
              <p><strong>Amount Due:</strong> ₱${displayPrice.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (Inclusive of EWT & VAT)</p>
            </div>

            <p><strong>Next Step:</strong> Your spot is reserved pending payment. Please proceed with the payment instructions shown on our website to confirm your seat.</p>
            <p>If you have any questions, contact us at esm.taxconsultant@kataxpayer.com.</p>
            <p>We look forward to seeing you there!</p>
            <p>Best regards,<br>The ETM Tax Specialista Team</p>
          </div>
          <div class="footer">
            You are receiving this email because you registered for the RAFT LoA seminar.
          </div>
        </body>
        </html>
      `,
    });

    // Return a 200 OK status code to Netlify to indicate success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };

  } catch (error) {
    // Log any errors to the Netlify function logs
    console.error('Error sending email:', error);

    // Return an error status code
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' }),
    };
  }
};