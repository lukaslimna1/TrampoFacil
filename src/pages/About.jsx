import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Zap, Sparkles, Target, Users, ShieldCheck, 
  ArrowRight, MessageCircle, BarChart, Building2, Flame,
  CheckCircle2, MousePointer2, Smartphone, Globe, AlertCircle,
  XCircle, CheckCircle, Brain, Search, Send, TrendingUp, Heart,
  ChevronRight, Laptop, Fingerprint, Activity, Layers, Cpu, Eye,
  Command, Terminal, Code, PieChart, LineChart, Star, SearchCode
} from 'lucide-react';
import './About.css';

export function About() {
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal-init');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const iaFeatures = [
    {
      title: "Análise de Benchmark de Mercado",
      desc: "Compara salários e benefícios em tempo real com dados do setor (Tech, Design, Gestão).",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Score de Performance da Vaga",
      desc: "Avalia a atratividade do anúncio e sugere melhorias para aumentar o alcance em até 40%.",
      icon: <Star size={24} />
    },
    {
      title: "IA Assistente de Recrutamento",
      desc: "Identifica potenciais ocultos em candidatos sem o uso de filtros eliminatórios cegos.",
      icon: <Brain size={24} />
    }
  ];

  return (
    <div className="about-page-premium">
      <div className="tech-grid-overlay"></div>

      {/* 1. HERO - THE FUTURE IS ALIVE */}
      <section className="about-hero-v4">
        <div className="container hero-flex-v4">
          <div className="hero-text-side-v4 reveal">
            <div className="hero-status-pill">
              <span className="live-indicator"></span>
              <span className="text-glow">TRAMPO IA v3.0 ENGINE ATIVO</span>
            </div>
            <h1 className="hero-title-v4">
              Recrutamento com <br/>
              <span className="text-gradient-v4">Inteligência Humana.</span>
            </h1>
            <p className="hero-desc-v4">
              O Trampo Fácil não é apenas uma lista de vagas. É um ecossistema inteligente que analisa, conecta e humaniza cada interação entre talentos e empresas.
            </p>
            <div className="hero-actions-v4">
              <Link to="/" className="btn-premium-v4">
                <span>Ver IA em ação</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          <div className="hero-visual-side-v4">
            <div className="floating-ui-container">
               {/* Floating Card 1: AI Score */}
               <div className="floating-ui-card f-card-1">
                  <div className="card-top">
                    <div className="tech-icon"><Star size={18} /></div>
                    <div className="match-score">IA Score: 92</div>
                  </div>
                  <div className="card-content">
                    <div className="mini-bar"><div className="mini-fill" style={{width: '92%'}}></div></div>
                    <p className="mini-text">Vaga com alta atratividade</p>
                  </div>
               </div>

               {/* Floating Card 2: Market Sentiment */}
               <div className="floating-ui-card f-card-2">
                  <div className="chat-header-v4">
                    <TrendingUp size={14} />
                    <span>Market Insight</span>
                  </div>
                  <div className="insight-bubble">Salário 15% acima da média</div>
               </div>

               {/* Central Core Element */}
               <div className="central-tech-core">
                  <div className="core-inner">
                    <Cpu size={40} className="core-brain-icon" />
                  </div>
                  <div className="core-ring r1"></div>
                  <div className="core-ring r2"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRAMPO IA - DEEP DIVE & MOCKUP */}
      <section className="ia-deep-dive-v4 reveal">
        <div className="container">
          <div className="ia-showcase-grid">
            <div className="ia-showcase-text">
              <div className="m-tag-v4">ENGINE CORE</div>
              <h2 className="section-title-v4">Como a Trampo IA <br/><span>revoluciona seu dia.</span></h2>
              
              <div className="ia-feature-list-v4">
                {iaFeatures.map((f, i) => (
                  <div 
                    key={i} 
                    className={`ia-feature-item-v4 ${activeFeature === i ? 'active' : ''}`}
                    onMouseEnter={() => setActiveFeature(i)}
                  >
                    <div className="feature-icon-v4">{f.icon}</div>
                    <div className="feature-info-v4">
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ia-showcase-visual">
               <div className="real-ia-mockup-v4">
                  <div className="mockup-side-v4">
                    <div className="mockup-header-v4">
                      <div className="mockup-dots"><span></span><span></span><span></span></div>
                      <div className="mockup-title-v4">Painel de Inteligência</div>
                    </div>
                    <div className="mockup-body-v4">
                       <div className="ia-analysis-card">
                          <div className="analysis-header">
                             <Activity size={18} />
                             <span>Análise de Vaga: Dev Senior</span>
                          </div>
                          <div className="analysis-score-ring">
                             <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="18" y="20.35" className="percentage">85%</text>
                             </svg>
                          </div>
                          <div className="analysis-insights">
                             <div className="insight-pill-v4 green"><CheckCircle size={12} /> Salário Competitivo</div>
                             <div className="insight-pill-v4 blue"><Zap size={12} /> Descrição Otimizada</div>
                             <div className="insight-pill-v4 yellow"><AlertCircle size={12} /> Adicionar Benefícios</div>
                          </div>
                       </div>

                       <div className="ia-market-graph">
                          <div className="graph-label">Tendência de Candidaturas</div>
                          <div className="graph-bars">
                             <div className="g-bar" style={{height: '40%'}}></div>
                             <div className="g-bar" style={{height: '70%'}}></div>
                             <div className="g-bar highlight" style={{height: '95%'}}></div>
                             <div className="g-bar" style={{height: '60%'}}></div>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div className="mockup-glow-v4"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FUTURE VISION - O QUE VEM POR AÍ */}
      <section className="future-vision-v4 reveal">
        <div className="container">
          <div className="vision-header-v4">
            <h2 className="section-title-v4 center">O Futuro da <span>Trampo IA</span></h2>
            <p className="section-desc-v4 center">Estamos apenas começando. Conheça as tecnologias em laboratório.</p>
          </div>

          <div className="vision-grid-v4">
            <div className="vision-card-v4">
              <div className="v-icon-box"><SearchCode size={32} /></div>
              <h3>Match Preditivo</h3>
              <p>IA que antecipa o sucesso de um candidato na cultura da empresa antes mesmo da primeira entrevista.</p>
              <span className="v-tag">EM P&D</span>
            </div>
            <div className="vision-card-v4">
              <div className="v-icon-box"><Layers size={32} /></div>
              <h3>Auto-Otimização</h3>
              <p>Ajuste dinâmico de descrições de vagas com base no comportamento em tempo real do mercado.</p>
              <span className="v-tag">LABS</span>
            </div>
            <div className="vision-card-v4">
              <div className="v-icon-box"><Globe size={32} /></div>
              <h3>Expansão Global</h3>
              <p>Tradução e adaptação cultural automática para recrutamento internacional sem barreiras.</p>
              <span className="v-tag">ROADMAP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RETENTION - CANDIDATE & COMPANY */}
      <section className="retention-v4 reveal">
        <div className="container">
          <div className="retention-grid-v4">
            {/* Candidate */}
            <div className="ret-card-v4 tech-card">
              <div className="card-glass-glow"></div>
              <div className="card-top-v4">
                <div className="icon-wrap-v4"><Users size={32} /></div>
                <span className="tech-badge">CANDIDATO</span>
              </div>
              <h3>A IA que torce por você.</h3>
              <p className="card-desc-v4">Diferente de outras plataformas, nossa IA busca destacar seus pontos fortes. Ela sugere como melhorar seu perfil e te conecta diretamente com quem decide.</p>
              <Link to="/" className="btn-card-v4">Explorar Agora <ChevronRight size={18} /></Link>
            </div>

            {/* Company */}
            <div className="ret-card-v4 tech-card alt">
              <div className="card-glass-glow"></div>
              <div className="card-top-v4">
                <div className="icon-wrap-v4"><Building2 size={32} /></div>
                <span className="tech-badge">EMPRESA</span>
              </div>
              <h3>Contrate sem a bagunça.</h3>
              <p className="card-desc-v4">Automatize a triagem repetitiva e foque na análise humana. Nossa IA organiza o pipeline e te entrega os insights necessários para uma decisão rápida.</p>
              <Link to="/publicar" className="btn-card-v4">Publicar Agora <ChevronRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="final-cta-v4 reveal">
        <div className="container">
          <div className="cta-premium-card-v4">
            <div className="cta-overlay-v4"></div>
            <h2 className="cta-title-v4">Participe da revolução <br/>do trabalho.</h2>
            <div className="cta-btns-v4">
              <Link to="/" className="btn-v4-main">Encontrar Vaga</Link>
              <Link to="/publicar" className="btn-v4-sub">Publicar Vaga</Link>
            </div>
            <div className="cta-footer-v4">Trampo Fácil: Simples, Direto e Inteligente.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
