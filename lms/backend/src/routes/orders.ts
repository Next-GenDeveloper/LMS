import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendOrderNotification } from '../utils/emailService.ts';

const router = Router();

// Handle new order and send email notification
router.post('/create', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      customerInfo,
      items,
      subtotal,
      deliveryCharges,
      discount,
      total,
      paymentMethod,
    } = req.body;

    // Prepare email data
    const emailData = {
      orderId,
      customerName: customerInfo.fullName,
      customerEmail: customerInfo.email || '',
      customerPhone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      postalCode: customerInfo.postalCode,
      items,
      subtotal,
      deliveryCharges,
      discount: discount || 0,
      total,
      paymentMethod,
      notes: customerInfo.notes || '',
      orderDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    // Send email notification
    const emailResult = await sendOrderNotification(emailData);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Order created and notification sent',
        orderId,
      });
    } else {
      // Order created but email failed
      res.status(200).json({
        success: true,
        message: 'Order created but email notification failed',
        orderId,
        emailError: true,
      });
    }
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

export default router;
