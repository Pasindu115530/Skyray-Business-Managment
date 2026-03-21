import * as nodemailer from "nodemailer";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";

// සිංගප්පූරු Region එක භාවිතා කිරීම (ලංකාවට වේගවත්ම Region එක)
setGlobalOptions({ region: "asia-southeast1" });

/**
 * ඊමේල් යැවීම සඳහා අවශ්‍ය Transporter එක සකස් කිරීම.
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

// 1. සාමාන්‍ය Contact Us පණිවිඩ සඳහා (Admin ට පමණි)
export const sendContactEmail = onDocumentCreated({
  document: "messages/{messageId}",
  // Secrets භාවිතා කිරීමට අවසර ලබා දීම
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD", "NEXT_ADMIN_MAIL"]
}, async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const transporter = getTransporter();

  const mailOptions = {
    from: `"Skyray Admin" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: process.env.NEXT_ADMIN_MAIL,
    subject: `New Contact Message: ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h3 style="color: #8B1538;">New Contact Message Details</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone || 'N/A'}</p>
        <p><b>Subject:</b> ${data.subject}</p>
        <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
          <b>Message:</b><br/>${data.message}
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent to Admin: ${process.env.NEXT_ADMIN_MAIL}`);
  } catch (error) {
    console.error("Error sending contact email:", error);
  }
});

// 2. Quotation Requests සඳහා (Admin ට සහ Customer ට යන දෙන්නාටම)
export const sendQuotationEmail = onDocumentCreated({
  document: "quotations/{quoteId}",
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD", "NEXT_ADMIN_MAIL"]
}, async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const transporter = getTransporter();

  const adminMailOptions = {
    from: `"Skyray Quotations" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: process.env.NEXT_ADMIN_MAIL,
    subject: `New Quotation Request from ${data.name}`,
    html: `
      <h3 style="color: #D4AF37;">New Quotation Request Details</h3>
      <p><b>Customer Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p>Please log in to the Admin Dashboard to review requested items.</p>
    `,
  };

  const customerMailOptions = {
    from: `"Skyray Engineering Solutions" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
    to: data.email,
    subject: "Quotation Request Received - Skyray Engineering",
    html: `
      <div style="font-family: sans-serif;">
        <h3>Hello ${data.name},</h3>
        <p>Thank you for requesting a quotation from <b>Skyray Engineering Solutions</b>.</p>
        <p>We have received your request and will get back to you shortly.</p>
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
    console.log(`Quotation emails sent for doc: ${event.params.quoteId}`);
  } catch (error) {
    console.error("Error sending quotation emails:", error);
  }
});

// 3. Admin Reply කළ විට Customer ට PDF එක යැවීම
export const onQuotationReply = onDocumentUpdated({
  document: "quotations/{quoteId}",
  secrets: ["NEXT_PUBLIC_SENDER_MAIL", "NEXT_PUBLIC_SENDER_MAIL_PASSWORD"]
}, async (event) => {
  const change = event.data;
  if (!change) return;

  const newData = change.after.data();
  const previousData = change.before.data();

  if (previousData.status !== 'replied' && newData.status === 'replied') {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Skyray Engineering" <${process.env.NEXT_PUBLIC_SENDER_MAIL}>`,
      to: newData.email,
      subject: "Your Official Quotation - Skyray Engineering",
      html: `
        <div style="font-family: sans-serif;">
          <h3>Hello ${newData.name},</h3>
          <p>${newData.reply_message || 'Please find the attached quotation.'}</p>
          <br/>
          <p>Best Regards,<br/>Skyray Engineering Solutions</p>
        </div>
      `,
      attachments: newData.reply_pdf_url ? [{
        filename: 'Quotation_Skyray.pdf',
        path: newData.reply_pdf_url
      }] : []
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Reply email sent to: ${newData.email}`);
    } catch (error) {
      console.error("Error sending reply email:", error);
    }
  }
});