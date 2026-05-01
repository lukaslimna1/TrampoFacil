/**
 * PÁGINA: ForCompanies (Para Empresas)
 * OBJETIVO: Landing page focada em conversão para recrutadores e empresas.
 * POR QUE: Centraliza a proposta de valor para quem contrata, destacando a
 * simplicidade do modelo accountless e as opções de monetização (vagas premium).
 */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Shield, Target, Briefcase, BarChart3, 
  MousePointer2, CheckCircle, MessageSquare, 
  ArrowRight, Sparkles, Flame, Gem, CreditCard 
} from 'lucide-react';
import './ForCompanies.css';

export default function ForCompanies() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="for-companies-premium">
      {/* 1. HERO SECTION */}
      <section className="fc-hero">
        <div className="tech-glow-orb-fc"></div>
        <div className="container">
          <div className="fc-hero-content">
            <div className="fc-badge-top">
              <Sparkles size={14} />
              <span>Para Recrutadores de Alta Performance</span>
            </div>
            <h1 className="fc-title">
              Contrate mais rápido. <br />
              <span className="text-gradient">Sem burocracia.</span>
            </h1>
            <p className="fc-subtitle">
              Publique sua vaga em segundos e receba candidatos direto no seu WhatsApp ou e-mail. 
              Sem login obrigatório, sem sistemas complicados.
            </p>
            
            <div className="fc-hero-points">
              <div className="fc-point">
                <Zap size={20} className="text-primary" />
                <span>Publicação em &lt; 1 min</span>
              </div>
              <div className="fc-point">
                <Shield size={20} className="text-primary" />
                <span>Link seguro para edição</span>
              </div>
              <div className="fc-point">
                <MessageSquare size={20} className="text-primary" />
                <span>Candidatura direta</span>
              </div>
            </div>

            <div className="fc-hero-actions">
              <Link to="/publicar" className="btn-fc-primary">
                Publicar vaga grátis <ArrowRight size={18} />
              </Link>
              <button className="btn-fc-outline" onClick={() => document.getElementById('monetization').scrollIntoView({ behavior: 'smooth' })}>
                Destacar minha vaga
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA */}
      <section className="fc-how-it-works">
        <div className="container">
          <div className="fc-section-header">
            <h2 className="fc-section-title">Simples, direto e eficiente</h2>
            <p className="fc-section-subtitle">O processo que respeita o seu tempo.</p>
          </div>

          <div className="fc-steps-grid">
            <div className="fc-step-card">
              <div className="fc-step-number">01</div>
              <div className="fc-step-icon"><Zap /></div>
              <h3>Publique</h3>
              <p>Preencha o formulário em poucos segundos com os detalhes da vaga.</p>
            </div>
            <div className="fc-step-card">
              <div className="fc-step-number">02</div>
              <div className="fc-step-icon"><Shield /></div>
              <h3>Receba seu link</h3>
              <p>Você recebe um link com Token de Edição exclusivo. Sem senhas, 100% seguro.</p>
            </div>
            <div className="fc-step-card">
              <div className="fc-step-number">03</div>
              <div className="fc-step-icon"><MessageSquare /></div>
              <h3>Receba candidatos</h3>
              <p>Os candidatos entram em contato direto com você via WhatsApp ou E-mail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIFERENCIAL REAL */}
      <section className="fc-differentials">
        <div className="container">
          <div className="fc-split-layout">
            <div className="fc-split-info">
              <h2 className="fc-section-title">Menos sistema.<br /><span className="text-gradient">Mais resultado.</span></h2>
              <p className="fc-section-subtitle">Eliminamos as barreiras que travam o recrutamento moderno.</p>
              
              <div className="fc-diff-list">
                <div className="fc-diff-item">
                  <div className="fc-diff-check"><CheckCircle size={20} /></div>
                  <div>
                    <h4>Sem cadastro obrigatório</h4>
                    <p>Você não perde tempo criando conta para publicar uma vaga urgente.</p>
                  </div>
                </div>
                <div className="fc-diff-item">
                  <div className="fc-diff-check"><CheckCircle size={20} /></div>
                  <div>
                    <h4>Contato direto</h4>
                    <p>Nada de plataformas intermediárias travando o fluxo de conversa.</p>
                  </div>
                </div>
                <div className="fc-diff-item">
                  <div className="fc-diff-check"><CheckCircle size={20} /></div>
                  <div>
                    <h4>Publicação imediata</h4>
                    <p>Sua vaga aparece no sistema em tempo real, pronta para ser descoberta.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fc-split-visual">
              <div className="fc-glass-mockup">
                <div className="mockup-header">
                  <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                </div>
                <div className="mockup-body">
                  <div className="mockup-line-large"></div>
                  <div className="mockup-line-medium"></div>
                  <div className="mockup-grid">
                    <div className="mockup-item"></div>
                    <div className="mockup-item"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IA INTELIGÊNCIA */}
      <section className="fc-ia-features">
        <div className="container">
          <div className="fc-ia-card">
            <div className="fc-ia-badge">
              <Sparkles size={16} />
              <span>Trampo IA</span>
            </div>
            <h2 className="fc-ia-title">Inteligência aplicada na prática</h2>
            
            <div className="fc-ia-grid">
              <div className="fc-ia-item">
                <BarChart3 className="text-primary" />
                <h4>Score de atratividade</h4>
                <p>Analisamos a descrição e benefícios para indicar o quão atrativa sua vaga está para o mercado.</p>
              </div>
              <div className="fc-ia-item">
                <Target className="text-primary" />
                <h4>Destaque Inteligente</h4>
                <p>Vagas mais completas ganham relevância natural e são sugeridas prioritariamente.</p>
              </div>
              <div className="fc-ia-item">
                <MousePointer2 className="text-primary" />
                <h4>Interpretação de Busca</h4>
                <p>Nossa IA entende a intenção do candidato e conecta com os termos reais da sua vaga.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISIBILIDADE (MONETIZAÇÃO) */}
      <section id="monetization" className="fc-pricing">
        <div className="container">
          <div className="fc-section-header">
            <h2 className="fc-section-title">Acelere sua contratação</h2>
            <p className="fc-section-subtitle">Destaques pensados para quem precisa de resultados ontem.</p>
          </div>

          <div className="fc-pricing-grid">
            <div className="fc-price-card">
              <div className="fc-price-badge-urgent">
                <Flame size={14} color="#F59E0B" fill="#F59E0B" /> <span>VAGA URGENTE</span>
              </div>
              <h3 className="fc-plan-title">Vaga Urgente</h3>
              <div className="fc-plan-price">R$ 9,90</div>
              <p className="fc-plan-desc">Para quem precisa contratar rápido</p>
              <ul className="fc-price-list">
                <li><CheckCircle size={16} /> Destaque visual no feed</li>
                <li><CheckCircle size={16} /> Prioridade nas listagens</li>
                <li><CheckCircle size={16} /> Maior volume de visualizações</li>
              </ul>
              <div className="fc-price-footer">
                <Link to="/publicar" state={{ plan: 'urgent' }} className="btn-price-primary">Destacar agora</Link>
              </div>
            </div>

            <div className="fc-price-card featured">
              <div className="fc-price-badge-premium">
                <Gem size={14} fill="#F59E0B" color="#F59E0B" /> <span>DESTAQUE PREMIUM</span>
              </div>
              <h3 className="fc-plan-title text-white">Destaque Premium</h3>
              <div className="fc-plan-price text-white">R$ 29,90</div>
              <p className="fc-plan-desc text-white">Máxima visibilidade na plataforma</p>
              <ul className="fc-price-list text-white">
                <li><CheckCircle size={16} /> Vaga fixada no topo</li>
                <li><CheckCircle size={16} /> Destaque visual completo (VIP)</li>
                <li><CheckCircle size={16} /> Maior taxa de cliques e conversão</li>
              </ul>
              <div className="fc-price-footer">
                <Link to="/publicar" state={{ plan: 'premium' }} className="btn-price-vip">Seja destaque VIP</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMO FUNCIONA O PAGAMENTO */}
      <section className="fc-payment">
        <div className="container">
          <div className="fc-payment-box">
            <div className="fc-payment-info">
              <CreditCard size={32} className="text-primary" />
              <h3>Ativação instantânea via Stripe</h3>
              <p>Segurança total no pagamento e ativação automática do destaque.</p>
            </div>
            <div className="fc-payment-steps">
              <div className="ps-item"><span>1</span> Escolha o plano</div>
              <div className="ps-item"><span>2</span> Checkout Seguro</div>
              <div className="ps-item"><span>3</span> Vaga Ativa</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ROADMAP */}
      <section className="fc-roadmap">
        <div className="container">
          <div className="fc-roadmap-card">
            <div className="fc-roadmap-header">
              <div className="fc-roadmap-badge">Evolução Constante</div>
              <h2>O que estamos construindo para você</h2>
            </div>
            <div className="fc-roadmap-grid">
              <div className="roadmap-item">
                <BarChart3 size={20} />
                <span>Dashboard de métricas reais</span>
              </div>
              <div className="roadmap-item">
                <Sparkles size={20} />
                <span>Sugestões automáticas via IA</span>
              </div>
              <div className="roadmap-item">
                <Target size={20} />
                <span>Match Inteligente Candidato/Vaga</span>
              </div>
              <div className="roadmap-item">
                <CheckCircle size={20} />
                <span>Gestão opcional via Contas</span>
              </div>
            </div>
            <div className="fc-roadmap-footer">
              <p>A simplicidade do modelo sem cadastro continuará existindo como base.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONFIANÇA */}
      <section className="fc-trust">
        <div className="container">
          <div className="fc-trust-grid">
            <div className="trust-item"><CheckCircle size={18} /> Publicação gratuita</div>
            <div className="trust-item"><CheckCircle size={18} /> Sem taxas para candidatos</div>
            <div className="trust-item"><CheckCircle size={18} /> Controle via Link Seguro</div>
            <div className="trust-item"><CheckCircle size={18} /> Suporte e Denúncia Ativos</div>
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="fc-cta-final">
        <div className="container">
          <div className="fc-cta-card">
            <h2>Pronto para encontrar seu próximo talento?</h2>
            <p>Publique agora gratuitamente e comece a receber candidatos hoje mesmo.</p>
            <div className="fc-cta-actions">
              <Link to="/publicar" className="btn-fc-primary">
                Publicar vaga grátis
              </Link>
              <button className="btn-fc-outline-white" onClick={() => document.getElementById('monetization').scrollIntoView({ behavior: 'smooth' })}>
                Conhecer destaques
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
