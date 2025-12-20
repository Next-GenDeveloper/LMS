import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ENV } from '../config/env.ts';

dotenv.config();

function createTransporter() {
  // NOTE: We keep gmail defaults for this project.
  // For production, consider providing full SMTP host/port configuration.
  return nodemailer.createTransport({
    service: ENV.EMAIL_SERVICE || 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASSWORD,
    },
  });
}

function assertEmailConfigured() {
  if (!ENV.EMAIL_USER || !ENV.EMAIL_PASSWORD) {
    throw new Error('Email is not configured. Please set EMAIL_USER and EMAIL_PASSWORD in backend .env');
  }
}

const transporter = createTransporter();

// Verify transporter configuration (non-fatal)
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter not ready:', error?.message || error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function sendOtpEmail(opts: { to: string; fullName?: string; otp: string; expiresMinutes: number }) {
  assertEmailConfigured();

  const { to, fullName, otp, expiresMinutes } = opts;
  const safeName = fullName?.trim() ? fullName.trim() : 'there';

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
    <h2 style="margin:0 0 12px 0;">Verify your email</h2>
    <p style="margin:0 0 16px 0;">Hi ${safeName},</p>
    <p style="margin:0 0 16px 0;">Your OTP code is:</p>
    <div style="font-size: 28px; letter-spacing: 6px; font-weight: 700; padding: 12px 16px; background:#f3f4f6; border-radius: 10px; display:inline-block;">${otp}</div>
    <p style="margin:16px 0 0 0; color:#6b7280;">This code will expire in ${expiresMinutes} minutes.</p>
    <p style="margin:16px 0 0 0; color:#6b7280;">If you did not request this, you can ignore this email.</p>
  </div>
  `;

  const mailOptions = {
    from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.EMAIL_FROM}>`,
    to,
    subject: 'Your OTP code - 9Tangle',
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  orderDate: string;
}

export async function sendOrderNotification(orderData: OrderEmailData) {
  try {
    const itemsHtml = orderData.items
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${index + 1}. ${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">x${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `
      )
      .join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🎉 New Order Received!</h1>
      <p style="color: #fff3e0; margin: 10px 0 0 0; font-size: 16px;">A customer has placed a new order</p>
    </div>

    <!-- Order ID -->
    <div style="background-color: #fef3c7; border-left: 5px solid #f59e0b; padding: 20px 30px; margin: 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">ORDER ID</p>
      <p style="margin: 5px 0 0 0; color: #92400e; font-size: 24px; font-weight: bold;">${orderData.orderId}</p>
      <p style="margin: 5px 0 0 0; color: #78350f; font-size: 13px;">📅 ${orderData.orderDate}</p>
    </div>

    <!-- Customer Details -->
    <div style="padding: 30px; background-color: #ffffff;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 3px solid #f97316; padding-bottom: 10px;">👤 Customer Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #6b7280; font-weight: 600; width: 140px;">Name:</td>
          <td style="padding: 10px 0; color: #1f2937; font-weight: bold;">${orderData.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Phone:</td>
          <td style="padding: 10px 0; color: #1f2937; font-weight: bold;">📱 ${orderData.customerPhone}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Email:</td>
          <td style="padding: 10px 0; color: #1f2937;">📧 ${orderData.customerEmail || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Address:</td>
          <td style="padding: 10px 0; color: #1f2937;">
            📍 ${orderData.address}<br>
            ${orderData.city}${orderData.postalCode ? ', ' + orderData.postalCode : ''}
          </td>
        </tr>
      </table>
    </div>

    <!-- Order Items -->
    <div style="padding: 0 30px 30px 30px; background-color: #ffffff;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 3px solid #f97316; padding-bottom: 10px;">🛍️ Order Items</h2>
      
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Product</th>
            <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Payment Summary -->
    <div style="padding: 0 30px 30px 30px; background-color: #ffffff;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; border-bottom: 3px solid #f97316; padding-bottom: 10px;">💰 Payment Summary</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
          <td style="padding: 8px 0; text-align: right; color: #1f2937; font-weight: 600;">Rs. ${orderData.subtotal.toLocaleString()}</td>
        </tr>
        ${
          orderData.discount && orderData.discount > 0
            ? `
        <tr style="background-color: #dcfce7;">
          <td style="padding: 8px 0; color: #15803d; font-weight: 600;">Discount:</td>
          <td style="padding: 8px 0; text-align: right; color: #15803d; font-weight: bold;">- Rs. ${orderData.discount.toLocaleString()}</td>
        </tr>
        `
            : ''
        }
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Delivery Charges:</td>
          <td style="padding: 8px 0; text-align: right; color: ${orderData.deliveryCharges === 0 ? '#10b981' : '#1f2937'}; font-weight: 600;">
            ${orderData.deliveryCharges === 0 ? 'FREE' : 'Rs. ' + orderData.deliveryCharges.toLocaleString()}
          </td>
        </tr>
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="padding: 15px 0 8px 0; color: #1f2937; font-size: 18px; font-weight: bold;">TOTAL:</td>
          <td style="padding: 15px 0 8px 0; text-align: right; color: #f97316; font-size: 24px; font-weight: bold;">Rs. ${orderData.total.toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 0;">
            <div style="background-color: #fef3c7; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: 600;">💳 Payment Method: ${orderData.paymentMethod}</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    ${
      orderData.notes
        ? `
    <!-- Customer Notes -->
    <div style="padding: 0 30px 30px 30px; background-color: #ffffff;">
      <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; border-bottom: 3px solid #f97316; padding-bottom: 10px;">📝 Customer Notes</h2>
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-style: italic;">${orderData.notes}</p>
      </div>
    </div>
    `
        : ''
    }

    <!-- Call to Action -->
    <div style="background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); padding: 30px; text-align: center;">
      <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 20px;">⚡ Next Steps</h3>
      <p style="color: #fff3e0; margin: 0 0 20px 0; font-size: 14px;">Contact the customer to confirm and process this order</p>
      <div style="background-color: rgba(255, 255, 255, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #ffffff; font-size: 16px;">
          <strong>📞 Call:</strong> ${orderData.customerPhone}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 20px 30px; text-align: center;">
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This is an automated notification from your LMS website<br>
        Order placed at ${orderData.orderDate}
      </p>
    </div>

  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"9Tangle LMS" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to your own email
      subject: `🎉 New Order #${orderData.orderId} - Rs. ${orderData.total.toLocaleString()}`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order notification email:', error);
    return { success: false, error };
  }
}
