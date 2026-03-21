import * as nodemailer from "nodemailer";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

const transporter = nodemailer.createTransport({
  host: "mail.sreng.lk",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_MAIL, 
    pass: process.env.SENDER_MAIL_PASSWORD,
  },
});

// 1. සාමාන්‍ය Contact Us පණිවිඩ සඳහා (Admin ට පමණි)
export const sendContactEmail = onDocumentCreated("messages/{messageId}", async (event) => {
    const data = event.data?.data();
    if (!data) {
      console.log("No data found in the event.");
      return;
    }

    const mailOptions = {
      from: '"Skyray Admin" <info@sreng.lk>',
      to: process.env.NEXT_ADMIN_MAIL,
      subject: `New Contact Message: ${data.subject}`,
      html: `
        <h3>New Contact Message Details</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Message:</b> ${data.message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return console.log("Contact email sent to Admin.");
    } catch (error) {
      return console.error("Error sending contact email:", error);
    }
  });

// 2. Quotation Requests සඳහා (Admin ට සහ Customer ට යන දෙන්නාටම)
export const sendQuotationEmail = onDocumentCreated("quotations/{quoteId}", async (event) => {
    const data = event.data?.data();
    if (!data) {
      console.log("No data found in the event.");
      return;
    }

    // Admin ට යන Email එක
    const adminMailOptions = {
      from: '"Skyray Quotations" <info@sreng.lk>',
      to: process.env.NEXT_ADMIN_MAIL,
      subject: `New Quotation Request from ${data.name}`,
      html: `
        <h3>New Quotation Request Details</h3>
        <p><b>Customer Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>Requested Items:</b> ${data.items || 'Check dashboard'}</p>
      `,
    };

    // Customer ට යන ස්වයංක්‍රීය පිළිතුර (Auto-Reply)
    const customerMailOptions = {
      from: '"Skyray Engineering Solutions" <info@sreng.lk>',
      to: data.email, // පාරිභෝගිකයාගේ email එක
      subject: "Acknowledgment: Quotation Request Received",
      html: `
        <h3>Hello ${data.name},</h3>
        <p>Thank you for requesting a quotation from <b>Skyray Engineering Solutions</b>.</p>
        <p>We have received your request and our team is working on it. We will get back to you with the details shortly.</p>
        <br>
        <p>Best Regards,<br>Skyray Sales Team</p>
      `,
    };

    try {
      // Emails දෙකම එකවර යැවීම
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions)
      ]);
      return console.log("Quotation emails sent to Admin and Customer.");
    } catch (error) {
      return console.error("Error sending quotation emails:", error);
    }
  });

export const onQuotationReply = onDocumentUpdated("quotations/{quoteId}", async (event) => {
  const change = event.data;
  if (!change) {
    console.log("No data found in the event.");
    return;
  }

  const newData = change.after.data();
  const previousData = change.before.data();

  if (!newData || !previousData) {
    return;
  }

  // Status එක 'pending' සිට 'replied' වලට වෙනස් වූ විට පමණක් Email යැවීම
  if (previousData.status !== 'replied' && newData.status === 'replied') {
    const mailOptions = {
      from: '"Skyray Engineering" <info@sreng.lk>',
      to: newData.email,
      subject: "Your Quotation from Skyray Engineering",
      html: `<h3>Hello ${newData.name},</h3>
             <p>${newData.reply_message || 'Please find the attached quotation for your request.'}</p>`,
      attachments: newData.reply_pdf_url ? [{
        filename: 'Quotation.pdf',
        path: newData.reply_pdf_url
      }] : []
    };
    
    try {
      await transporter.sendMail(mailOptions);
      return console.log("Quotation reply email sent.");
    } catch (error) {
      return console.error("Error sending quotation reply email:", error);
    }
  }
  return;
});