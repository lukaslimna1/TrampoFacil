import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  try {
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
    } else {
      // Fallback para quando o segredo não está configurado (apenas para teste inicial)
      event = JSON.parse(body)
    }

    console.log(`🔔 Evento recebido: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const jobId = session.client_reference_id

      if (!jobId) {
        console.error('❌ client_reference_id (jobId) não encontrado na sessão')
        return new Response('Missing client_reference_id', { status: 400 })
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      )

      console.log(`🚀 Ativando vaga ID: ${jobId}`)

      const { error } = await supabase
        .from('jobs')
        .update({ 
          payment_status: 'paid',
          is_active: true 
        })
        .eq('id', jobId)

      if (error) {
        console.error(`❌ Erro ao atualizar banco: ${error.message}`)
        throw error
      }
      
      console.log(`✅ Vaga ${jobId} publicada com sucesso!`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`❌ Erro no processamento: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
