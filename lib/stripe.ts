import Stripe from 'stripe';

/**
 * Initialize Stripe with secret key from environment variables.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

/**
 * Create a Stripe Checkout Session.
 */
export async function createCheckoutSession(
  priceId: string,
  metadata: Record<string, string>,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
}

/**
 * Create a one-time payment session for a course or event.
 */
export async function createPaymentSession(params: {
  amount: number;
  currency: string;
  productName: string;
  productDescription?: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'fpx'], // FPX for Malaysian payments
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: params.productName,
              description: params.productDescription,
            },
            unit_amount: params.amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });

    return session;
  } catch (error) {
    console.error('Error creating payment session:', error);
    throw error;
  }
}
