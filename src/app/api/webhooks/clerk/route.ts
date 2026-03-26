import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('CLERK_WEBHOOK_SECRET is not set');
        return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Get Svix headers for verification
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new NextResponse('Missing svix headers', { status: 400 });
    }

    const body = await request.text();

    // Verify the webhook signature
    let event: any;
    try {
        const wh = new Webhook(webhookSecret);
        event = wh.verify(body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        });
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new NextResponse('Invalid webhook signature', { status: 400 });
    }

    // Only handle user.created events
    if (event.type !== 'user.created') {
        return NextResponse.json({ received: true });
    }

    const { id, email_addresses, first_name, last_name, created_at } = event.data;
    const email = email_addresses?.[0]?.email_address || 'Unknown';
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Unknown';
    const signupDate = new Date(created_at).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/Denver',
    });

    // Send notification email
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.ZOHO_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: `🚲 New CrankSmith signup — ${email}`,
            text: `New user signed up on CrankSmith.\n\nName: ${name}\nEmail: ${email}\nClerk ID: ${id}\nDate: ${signupDate}`,
            html: `
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
  <h2 style="color: #06b6d4; margin-bottom: 4px;">🚲 New CrankSmith Signup</h2>
  <p style="color: #888; margin-top: 0; font-size: 14px;">${signupDate}</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr>
      <td style="padding: 10px; background: #f5f5f5; font-weight: bold; width: 80px;">Name</td>
      <td style="padding: 10px; background: #fafafa;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">Email</td>
      <td style="padding: 10px; background: #fafafa;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">Clerk ID</td>
      <td style="padding: 10px; background: #fafafa; font-size: 12px; color: #888;">${id}</td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
    Sent automatically by CrankSmith · <a href="https://cranksmith.com" style="color: #06b6d4;">cranksmith.com</a>
  </p>
</div>
            `,
        });
    } catch (err) {
        console.error('Failed to send signup notification email:', err);
        // Don't return an error — Clerk would retry the webhook unnecessarily
    }

    return NextResponse.json({ received: true });
}
