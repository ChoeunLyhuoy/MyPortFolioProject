import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { otpCache } from '@/lib/otpCache';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string | null;
    const lastName = formData.get('lastName') as string | null;
    const email = formData.get('email') as string | null;
    const service = formData.get('service') as string | null;
    const message = formData.get('message') as string | null;
    const otpCode = formData.get('otpCode') as string | null;
    const file = formData.get('file') as File | null;

    // Validate parameters
    if (!firstName || !lastName || !email || !message || !otpCode) {
      return NextResponse.json(
        { error: 'Missing required text fields or verification OTP code' },
        { status: 400 }
      );
    }

    // ── OTP VERIFICATION STEP ──
    let verified = false;
    let verificationError = '';
    let dbOtpChecked = false;

    if (process.env.DATABASE_URL) {
      try {
        const otpRecord = await prisma.otpVerification.findFirst({
          where: { email },
          orderBy: { createdAt: 'desc' },
        });

        dbOtpChecked = true;
        if (!otpRecord) {
          verificationError = 'No verification code found for this email address. Please send code first.';
        } else if (otpRecord.code !== otpCode.trim()) {
          verificationError = 'Invalid verification code. Please check and try again.';
        } else if (new Date() > otpRecord.expiresAt) {
          verificationError = 'Verification code has expired. Please request a new code.';
        } else {
          verified = true;
          // Clean up OTP database record upon successful verification
          await prisma.otpVerification.delete({
            where: { id: otpRecord.id },
          });
        }
      } catch (dbError) {
        console.warn('Database connection failed! Verification falling back to local memory.', dbError);
        dbOtpChecked = false;
      }
    }

    if (!dbOtpChecked) {
      console.warn('Verifying OTP from local file-based cache fallback.');
      const record = otpCache.get(email);
      if (!record) {
        verificationError = 'No verification code found for this email address. Please send code first.';
      } else if (record.code !== otpCode.trim()) {
        verificationError = 'Invalid verification code. Please check and try again.';
      } else if (new Date() > record.expiresAt) {
        verificationError = 'Verification code has expired. Please request a new code.';
      } else {
        verified = true;
        otpCache.delete(email);
      }
    }

    if (!verified) {
      return NextResponse.json(
        { error: verificationError || 'Verification failed. Please request a new code.' },
        { status: 400 }
      );
    }

    let attachmentUrl: string | null = null;

    // Handle Cloudinary upload if a file attachment exists
    if (file && file.size > 0) {
      const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      if (hasCloudinary) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'portfolio_attachments',
                resource_type: 'auto', // Automatically detect PDF, zip, image, etc.
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });

          attachmentUrl = uploadResult.secure_url;
        } catch (uploadError: any) {
          console.error('Cloudinary Upload Error:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload attachment file to Cloudinary', details: uploadError.message },
            { status: 500 }
          );
        }
      } else {
        console.warn('Cloudinary credentials are not configured! Using mock file upload URL.');
        attachmentUrl = `https://mock-file-upload.local/${file.name}`;
      }
    }

    // Save database record (will point to Supabase URL if database is present)
    let newMessage;
    let dbSaved = false;
    if (process.env.DATABASE_URL) {
      try {
        newMessage = await prisma.contactMessage.create({
          data: {
            firstName,
            lastName,
            email,
            service: service || 'Not Specified',
            message,
            attachmentUrl,
          },
        });
        dbSaved = true;
      } catch (dbError) {
        console.warn('Database save failed! Saving mock contact message.', dbError);
        dbSaved = false;
      }
    }

    if (!dbSaved) {
      console.warn('Mocking database save for contact message.');
      newMessage = {
        id: 'mock-uuid',
        firstName,
        lastName,
        email,
        service: service || 'Not Specified',
        message,
        attachmentUrl,
        createdAt: new Date(),
      };
    }

    // Send Telegram Bot notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        const telegramText = `
<b>📩 New Verified Portfolio Submission!</b>

<b>Name:</b> ${firstName} ${lastName}
<b>Email:</b> ${email}
<b>Service:</b> ${service || 'Not Specified'}

<b>Message:</b>
<i>${message}</i>

${attachmentUrl ? `📎 <b>Attachment:</b> <a href="${attachmentUrl}">Download Attached File</a>` : '❌ <b>No attachment uploaded.</b>'}
`;

        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText.trim(),
            parse_mode: 'HTML',
          }),
        });

        if (!telegramRes.ok) {
          const resText = await telegramRes.text();
          console.error('Telegram notification failed response:', resText);
        }
      } catch (tgError) {
        console.error('Telegram bot notification error:', tgError);
      }
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'choeunlyhuoy@gmail.com';
    const isMockSmtp = !smtpUser || !smtpPass || smtpPass === 'your-gmail-app-password-here';

    if (!isMockSmtp && notificationEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"Choeun Portfolio Alert" <${smtpUser}>`,
          to: notificationEmail,
          subject: `📩 New Verified Message from ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #2563eb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px;">New Contact Message Alert</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Service:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${service || 'Not Specified'}</td>
                </tr>
              </table>
              
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-weight: bold; color: #475569; margin-bottom: 8px;">Message:</p>
                <p style="margin: 0; color: #334155; line-height: 1.6; font-style: italic;">"${message}"</p>
              </div>

              ${attachmentUrl ? `
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; margin-bottom: 24px;">
                  <span style="font-weight: bold; color: #1e40af;">📎 Attachment Link:</span> <a href="${attachmentUrl}" style="color: #2563eb; text-decoration: underline;">Download Attached File</a>
                </div>
              ` : ''}

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This email alert was automatically generated by Choeun's Portfolio Backend.</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error('Email alert notification error:', emailErr);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', data: newMessage },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
