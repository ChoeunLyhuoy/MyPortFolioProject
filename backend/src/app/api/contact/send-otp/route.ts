import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { otpCache } from '@/lib/otpCache';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry: 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let dbSuccess = false;

    if (process.env.DATABASE_URL) {
      try {
        // Delete any previous OTPs for this email to prevent spam/duplication
        await prisma.otpVerification.deleteMany({
          where: { email },
        });

        // Store in database
        await prisma.otpVerification.create({
          data: {
            email,
            code: otpCode,
            expiresAt,
          },
        });
        dbSuccess = true;
      } catch (dbError) {
        console.warn('Database connection failed! Falling back to in-memory OTP storage.', dbError);
        dbSuccess = false;
      }
    }

    if (!dbSuccess) {
      otpCache.set(email, otpCode, expiresAt);
    }

    // Check credentials
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const isMockSmtp = !smtpUser || !smtpPass || smtpPass === 'your-gmail-app-password-here';

    if (isMockSmtp) {
      console.warn('SMTP credentials are mock/placeholder or missing! Logging OTP code for local debugging:', otpCode);
      
      // Local development fallback
      return NextResponse.json({
        success: true,
        message: 'OTP generated in local debug mode (check server logs for the code)',
        debugOtp: otpCode,
      });
    }

    // Configure Nodemailer transporter (Gmail service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Choeun Portfolio Virtual IQ" <${smtpUser}>`,
      to: email,
      subject: '🔒 Email Verification Code - Choeun Lyhuoy Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 24px;">Email Verification</h2>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">Thank you for reaching out via my portfolio. Please use the following 6-digit One-Time Password (OTP) to verify your email and complete your message submission:</p>
          
          <div style="background-color: #f8fafc; border: 1.5px dashed #2563eb; border-radius: 8px; padding: 18px; text-align: center; margin: 28px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 6px; font-family: monospace;">${otpCode}</span>
          </div>
          
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">Note: This verification code is valid for <b>5 minutes</b>. Please do not share this code with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">&copy; 2026 Choeun Lyhuoy Portfolio. All rights reserved.</p>
        </div>
      `,
    };

    // Send Mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Verification OTP sent successfully via Gmail SMTP',
    });

  } catch (error: any) {
    console.error('Send OTP API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
