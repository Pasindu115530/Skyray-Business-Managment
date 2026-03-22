import * as nodemailer from "nodemailer";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";

// සිංගප්පූරු Region එක භාවිතා කිරීම (ලංකාවට වේගවත්ම සහ ආසන්නතම Region එක)
setGlobalOptions({ 
  region: "asia-southeast1",
  timeoutSeconds: 60, // කාලය තත්පර 60 දක්වා වැඩි කරන්න
  memory: "256MiB"    // මතකය තරමක් වැඩි කරන්න
});

/**
 * ඊමේල් යැවීම සඳහා අවශ්‍ය Transporter එක සකස් කිරීම.
 * මෙහි credentials (user, pass) Firebase Secrets Manager හරහා ලබා ගනී.
 */
const getTransporter = () => {
  return nodemailer.createTransport({
    host: "mail.sreng.lk",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_SENDER_MAIL,
      pass: process.env.NEXT_PUBLIC_SENDER_MAIL_PASSWORD,
    },
  });
};

// --------------------------------------------------------------------------------
// 1. Contact Us පණිවිඩ සඳහා (Admin ට පමණක් Email එකක් යැවීම)
// --------------------------------------------------------------------------------
export const sendContactEmail = onDocumentCreated({
  document: "contact_messages/{messageId}", // ඔබේ Service එකේ ඇති Collection නම මෙහි ඇත
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD", "NEXT_ADMIN_MAIL"]
}, async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Skyray Contact" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: process.env.NEXT_ADMIN_MAIL,
    subject: `New Web Inquiry: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #8B1538; border-bottom: 2px solid #8B1538; pb-2;">New Contact Message Received</h2>
        <p style="margin-top: 20px;"><b>Customer Name:</b> ${data.name}</p>
        <p><b>Email Address:</b> ${data.email}</p>
        <p><b>Phone Number:</b> ${data.phone || 'Not Provided'}</p>
        <p><b>Subject:</b> ${data.subject}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <b>Message:</b><br/>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">Sent via Skyray Engineering Website</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email successfully sent to Admin for doc: ${event.params.messageId}`);
  } catch (error) {
    console.error("Error sending contact email:", error);
  }
});

// --------------------------------------------------------------------------------
// 2. Quotation Requests සඳහා (Admin සහ Customer දෙදෙනාටම Email යැවීම)
// --------------------------------------------------------------------------------
export const sendQuotationEmail = onDocumentCreated({
  document: "quotations/{quoteId}",
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD", "NEXT_ADMIN_MAIL"]
}, async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const transporter = getTransporter();

  // Admin හට යන විස්තරය
  const adminMailOptions = {
    from: `"Skyray Quotations" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: process.env.NEXT_ADMIN_MAIL,
    subject: `Urgent: New Quotation Request from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #D4AF37;">New Quotation Inquiry</h2>
        <p><b>Customer:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p>Please check the Admin Dashboard for the full item list and respond accordingly.</p>
      </div>
    `,
  };

  // පාරිභෝගිකයාට යන ස්වයංක්‍රීය පිළිතුර
  const customerMailOptions = {
    from: `"Skyray Engineering Solutions" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: data.email,
    subject: "We've Received Your Quotation Request",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3>Dear ${data.name},</h3>
        <p>Thank you for reaching out to <b>Skyray Engineering Solutions</b>.</p>
        <p>Your quotation request has been successfully received. Our technical sales team is currently reviewing your requirements and will provide a detailed quote shortly.</p>
        <p>If you have any urgent queries, please call us on our hotline.</p>
        <br/>
        <p>Best Regards,<br/><b>Skyray Sales Team</b></p>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);
    console.log(`Quotation notification emails sent for doc ID: ${event.params.quoteId}`);
  } catch (error) {
    console.error("Error during quotation email dispatch:", error);
  }
});

// --------------------------------------------------------------------------------
// 3. Admin විසින් රිප්ලයි කළ විට (Replied status) Customer හට PDF එක යැවීම
// --------------------------------------------------------------------------------
export const onQuotationReply = onDocumentUpdated({
  document: "quotations/{quoteId}",
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD"]
}, async (event) => {
  const change = event.data;
  if (!change) return;

  const newData = change.after.data();
  const previousData = change.before.data();

  // 'replied' ස්ටේටස් එකට මාරු වූ විට පමණක් ක්‍රියාත්මක වේ
  if (previousData.status !== 'replied' && newData.status === 'replied') {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Skyray Engineering" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
      to: newData.email,
      subject: "Official Quotation - Skyray Engineering Solutions",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Dear ${newData.name},</h3>
          <p>${newData.reply_message || 'Please find the attached formal quotation as requested.'}</p>
          <p>We look forward to doing business with you.</p>
          <br/>
          <p>Best Regards,<br/>Skyray Engineering Solutions</p>
        </div>
      `,
      attachments: newData.reply_pdf_url ? [{
        filename: 'Skyray_Quotation.pdf',
        path: newData.reply_pdf_url
      }] : []
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Quotation reply PDF sent successfully to: ${newData.email}`);
    } catch (error) {
      console.error("Failed to send quotation reply email:", error);
    }
  }
});