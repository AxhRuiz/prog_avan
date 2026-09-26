import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    const requiredVariables = [
      'STRIPE_SECRET',
      'STRIPE_SUCCESS_URL',
      'STRIPE_CANCEL_UR',
      'STRIPE_ENDPOINT_SECRET',
    ];

    for (const variable of requiredVariables) {
      if (!process.env[variable]) {
        throw new Error(
          `${variable} environment variable is required`,
        );
      }
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET!);
  }

  async createPaymentSession(
    createPaymentSessionDto: CreatePaymentSessionDto,
  ) {
    const { orderId, currency, items } = createPaymentSessionDto;

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: items.map((item) => ({
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },

      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_UR!,
    });

    return {
      id: session.id,
      url: session.url,
    };
  }

  handleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (error) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${
          error instanceof Error
            ? error.message
            : 'Unknown error'
        }`,
      );
    }

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;

      const orderId = charge.metadata?.orderId;

      console.log('Payment successful');
      console.log('orderId:', orderId);
    } else {
      console.log(`Unhandled event: ${event.type}`);
    }

    return {
      received: true,
    };
  }
}