import transporter from "../config/mailer.js";

const sendMailerConfirm = async (name, email, date, start_time, end_time) => {
  const mailOptions = {
    from: `Cal.com:${process.env.EMAIL_USER}`,
    to: email,
    subject: "Booking Confirmation",
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Booking Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
  
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
  
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
  
            <!-- Header -->
            <tr>
              <td style="background:#2d89ef; color:#fff; padding:20px; text-align:center;">
                <h2 style="margin:0;">Booking Confirmed</h2>
                <p style="margin:5px 0 0; font-size:14px;">Your slot has been successfully booked</p>
              </td>
            </tr>
  
            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333;">
                
                <p>Hello <strong>${name}</strong>,</p>
  
                <p>Your booking is confirmed. Below are your booking details:</p>
  
                <!-- Details Table -->
                <table width="100%" cellpadding="10" cellspacing="0" style="margin:20px 0; border:1px solid #eee; border-radius:6px;">
  
                  <tr style="background:#f9f9f9;">
                    <td><strong>Email</strong></td>
                    <td>${email}</td>
                  </tr>
  
                  <tr>
                    <td><strong>Date</strong></td>
                    <td>${date}</td>
                  </tr>
  
                  <tr style="background:#f9f9f9;">
                    <td><strong>Start Time</strong></td>
                    <td>${start_time}</td>
                  </tr>
  
                  <tr>
                    <td><strong>End Time</strong></td>
                    <td>${end_time}</td>
                  </tr>
  
                </table>
  
                <!-- Highlight -->
                <div style="background:#e8f5e9; padding:12px; border-radius:6px; text-align:center; margin:20px 0;">
                  <strong style="color:#2e7d32;">
                    Please join at your scheduled time
                  </strong>
                </div>
  
                <p style="margin-bottom:0;">
                  Regards,<br/>
                  <strong style="color:#2d89ef;">Cal.com Team</strong>
                </p>
  
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#888;">
                © 2026 Cal.com. All rights reserved.
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  
  </body>
  </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendMailerCancel = async (name, email, date, start_time, end_time) => {
  const mailOptions = {
    from: `Cal.com:${process.env.EMAIL_USER}`,
    to: email,
    subject: "Booking Cancellation",
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Booking Cancellation</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
  
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
  
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
  
            <!-- Header -->
            <tr>
              <td style="background:#2d89ef; color:#fff; padding:20px; text-align:center;">
                <h2 style="margin:0;">Booking Cancelled</h2>
                <p style="margin:5px 0 0; font-size:14px;">Your slot has been Cancelled successfully</p>
              </td>
            </tr>
  
            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333;">
                
                <p>Hello <strong>${name}</strong>,</p>
  
                <p>Your booking is Cancelled. Below are your Cancellation details:</p>
  
                <!-- Details Table -->
                <table width="100%" cellpadding="10" cellspacing="0" style="margin:20px 0; border:1px solid #eee; border-radius:6px;">
  
                  <tr style="background:#f9f9f9;">
                    <td><strong>Email</strong></td>
                    <td>${email}</td>
                  </tr>
  
                  <tr>
                    <td><strong>Date</strong></td>
                    <td>${date}</td>
                  </tr>
  
                  <tr style="background:#f9f9f9;">
                    <td><strong>Start Time</strong></td>
                    <td>${start_time}</td>
                  </tr>
  
                  <tr>
                    <td><strong>End Time</strong></td>
                    <td>${end_time}</td>
                  </tr>
  
                </table>
  
                <!-- Highlight -->
                <div style="background:#e8f5e9; padding:12px; border-radius:6px; text-align:center; margin:20px 0;">
                  <strong style="color:#2e7d32;">
                    Please feel free to schedule a booking again.
                  </strong>
                </div>
  
                <p style="margin-bottom:0;">
                  Regards,<br/>
                  <strong style="color:#2d89ef;">Cal.com Team</strong>
                </p>
  
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#888;">
                © 2026 Cal.com. All rights reserved.
              </td>
            </tr>
  
          </table>
  
        </td>
      </tr>
    </table>
  
  </body>
  </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendMailerConfirm, sendMailerCancel };