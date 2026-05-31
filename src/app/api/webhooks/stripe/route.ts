import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as any;
        await prisma.subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELLED',
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any;
        await prisma.payment.create({
          data: {
            amount: invoice.amount_paid / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'COMPLETED',
            paymentMethod: 'STRIPE',
            transactionId: invoice.id,
            userId: (await prisma.subscription.findFirst({
              where: { stripeId: invoice.subscription },
            }))?.userId!,
          },
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    );
  }
}
