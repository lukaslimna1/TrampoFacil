import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

/**
 * SERVIÇO: StripeService
 * OBJETIVO: Gerenciar a integração com Stripe Checkout.
 * NOTA: A criação da sessão deve ocorrer no Backend (Supabase Edge Functions)
 * para segurança das chaves secretas.
 */
export const stripeService = {
  /**
   * Redireciona para o checkout do Stripe
   * @param {string} sessionId ID da sessão retornada pelo backend
   */
  redirectToCheckout: async (sessionId) => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error("Erro no redirect do Stripe:", error);
      throw error;
    }
  },

  /**
   * Cria uma sessão de checkout dinâmica via Edge Function (Opção Pro)
   * @param {string} planType Tipo do plano (urgente, premium, combo)
   * @param {string} jobId ID da vaga
   */
  createDynamicCheckout: async (planType, jobId) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          plan_type: planType, 
          job_id: jobId 
        }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error("Erro ao criar sessão dinâmica:", error);
      throw error;
    }
  }
};
