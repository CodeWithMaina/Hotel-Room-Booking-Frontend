// useStripePayment.ts

import { useCreateCheckoutSessionMutation } from "../features/api/stripeApi";
import type { StripeError } from "../types/stripeTypes";

type UseStripePaymentReturn = {
  initiatePayment: (bookingId: number, amount: number) => Promise<string | null>;
  isLoading: boolean;
  error: StripeError | null;
  checkoutUrl: string | undefined;
};

export const useStripePayment = (): UseStripePaymentReturn => {
  const [createCheckoutSession, { isLoading, error, data }] = useCreateCheckoutSessionMutation();

  const initiatePayment = async (bookingId: number, amount: number): Promise<string | null> => {
    try {
      const result = await createCheckoutSession({ bookingId, amount });
      if ('data' in result) {
        return result.data?.url ?? null;
      }
      return null;
    } catch (err) {
      console.error('Payment initiation failed:', err);
      return null;
    }
  };

  return {
    initiatePayment,
    isLoading,
    error: error as StripeError | null,
    checkoutUrl: data?.url,
  };
};