import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Stripe } from "https://esm.sh/stripe@12.1.1?target=deno"

/**
 * EDGE FUNCTION: create-checkout
 * OBJETIVO: Criar sessões dinâmicas do Stripe somando produtos (Opção Pro).
 */

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan_type, job_id, success_url, cancel_url } = await req.json()

    if (!job_id || !plan_type) {
      throw new Error('job_id e plan_type são obrigatórios')
    }

    const line_items = []

    // Mapeamento Pro: Usa os Price IDs reais do seu Stripe
    if (plan_type === 'premium' || plan_type === 'combo') {
      line_items.push({ price: 'price_1TS7mh1YDHXQq5WGljyqgTfq', quantity: 1 }) // Premium (R$ 29,90)
    }
    
    if (plan_type === 'urgente' || plan_type === 'combo') {
      line_items.push({ price: 'price_1TS7mZ1YDHXQq5WGbFdXkf9W', quantity: 1 }) // Urgente (R$ 9,90)
    }

    if (line_items.length === 0) {
      throw new Error('Nenhum item de pagamento selecionado')
    }

    // Criar Sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Você pode adicionar 'pix' aqui se configurado no Stripe
      line_items,
      mode: 'payment',
      client_reference_id: job_id,
      success_url: success_url || `${req.headers.get('origin')}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/publicar`,
      metadata: {
        job_id,
        plan_type
      }
    })

    console.log(`Checkout criado para vaga ${job_id}: ${session.url}`);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Erro ao criar checkout:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
