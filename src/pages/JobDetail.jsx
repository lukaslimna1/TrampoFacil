import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { getIconForJobTitle } from '../utils/iconMap';
import { calculateJobScore } from '../utils/trampoAI';
import './JobDetail.css';

import { 
  Zap, Bookmark, Eye, Flame, Banknote, Briefcase, MapPin, Clock, Star, 
  Users, BarChart, Utensils, Laptop, TrendingUp, HeartPulse, GraduationCap, 
  Gift, Baby, ShieldCheck, Building2, FileText, Mail, MessageCircle, ExternalLink, ArrowLeft,
  ListChecks, Target, Award, ClipboardList, Share2, Sparkles
} from 'lucide-react';

// Mapeamento de Lucide Icons para benefícios (Sincronizado com JobCard)
const BENEFIT_ICONS = {
  vr: <Utensils size={18} />,
  va: <Utensils size={18} />,
  vt: <MapPin size={18} />,
  saude: <HeartPulse size={18} />,
  odonto: <HeartPulse size={18} />,
  gympass: <HeartPulse size={18} />,
  homeoffice: <Laptop size={18} />,
  internet: <Laptop size={18} />,
  educacao: <GraduationCap size={18} />,
  seguro: <ShieldCheck size={18} />,
  plr: <TrendingUp size={18} />,
  bonus: <TrendingUp size={18} />,
  cultura: <Gift size={18} />,
  dayoff: <Gift size={18} />,
  flexivel: <Clock size={18} />,
  remoto: <MapPin size={18} />,
  refeicao_local: <Utensils size={18} />,
  deficiencia: <Users size={18} />
};
export function JobDetail({ inlineJobId }) {
  const params = useParams();
  const id = inlineJobId || params.id;
  const isInline = !!inlineJobId;
  const { getJobById, isLoading, isJobSaved, toggleSavedJob } = useJobs();
  const [job, setJob] = useState(null);
  const [activeTab, setActiveTab] = useState('vaga');

  useEffect(() => {
    if (!isLoading) {
      setJob(getJobById(id));
    }
  }, [id, getJobById, isLoading]);

  if (isLoading) return <div className="container" style={{ padding: '2rem' }}>Carregando...</div>;
  if (!job) return <div className="container" style={{ padding: '2rem' }}><h3>Vaga não encontrada ou expirada.</h3><Link to="/">Voltar ao início</Link></div>;

  const JobAreaIcon = getIconForJobTitle(job.titulo);

  const aiAnalysis = calculateJobScore(job);
  const jobScore = aiAnalysis.total;
  const salaryEval = aiAnalysis.salaryEval;

  const isSaved = isJobSaved ? isJobSaved(job.id) : false;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.titulo,
        text: `Vaga para ${job.titulo} na ${job.empresa || 'Empresa Confidencial'}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleCandidatarClick = () => {
    document.getElementById('candidatura-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const empresaNome = job.empresa || 'Empresa Confidencial';
  const mensagemProfissional = `Olá! Tenho muito interesse na vaga de *${job.titulo}* na ${empresaNome}, que encontrei no site Trampo Fácil.\n\nSegue meu currículo para avaliação.\nFico à disposição para uma entrevista!`;
  const mensagemProfissionalEmail = `Olá!\n\nTenho muito interesse na vaga de ${job.titulo} na ${empresaNome}, que encontrei no site Trampo Fácil.\n\nSegue meu currículo em anexo para avaliação.\nFico à disposição para uma entrevista.\n\nAtenciosamente,`;
  
  const getWhatsAppLink = (phone) => {
    if (!phone) return '';
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = `55${cleanPhone}`; // Adiciona o DDI do Brasil automaticamente
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagemProfissional)}`;
  };

  const getEmailLink = (email) => {
    if (!email) return '';
    return `mailto:${email}?subject=${encodeURIComponent(`Candidatura: ${job.titulo} - Trampo Fácil`)}&body=${encodeURIComponent(mensagemProfissionalEmail)}`;
  };

  return (
    <div className={`container job-detail-page ${isInline ? 'inline-mode' : ''}`}>
      {!isInline && (
        <div className="back-link-wrapper">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Voltar para vagas
          </Link>
        </div>
      )}

      <div className="job-detail-layout">
        {/* Main Content Linear 100% */}
        <div className="job-detail-main">
          
          {/* Header 2026: Imersivo Topo */}
          <div className="job-detail-header">
            <div className="job-detail-icon-app">
              {job.logo_url ? (
                <img src={job.logo_url} alt={job.empresa} className="jd-company-logo-main" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <JobAreaIcon size={36} />
              )}
            </div>
            <div className="job-header-text">
              <div className="jd-header-badges">
                {job.is_featured && <span className="jd-badge-vip"><Star size={12} fill="currentColor" /> Premium</span>}
                {job.is_urgent && <span className="jd-badge-urgent"><Flame size={12} /> Urgente</span>}
                <div className="jd-score-display-premium" style={{'--score-color': salaryEval.color}}>
                  <div className="jd-score-circle">
                    <svg viewBox="0 0 36 36" className="jd-circular-chart">
                      <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle-progress" strokeDasharray={`${jobScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="jd-score-value">{jobScore}%</span>
                  </div>
                  <div className="jd-score-info">
                    <span className="jd-ai-label"><Sparkles size={12} /> Trampo AI</span>
                    <span className="jd-market-label">{salaryEval.label}</span>
                  </div>
                </div>
              </div>
              <h1 className="job-title-large">{job.titulo}</h1>
              <div className="job-company-row">
                <span className="info-item"><Building2 size={16} /> {job.empresa || 'Empresa Confidencial'}</span>
                <span className="info-item"><MapPin size={16} /> {job.cidade}</span>
              </div>
            </div>
          </div>

          {/* Ações Primárias (Estilo Infojobs Premium) */}
          <div className="jd-primary-actions-bar mt-4">
            <button className="btn-candidatar-huge" onClick={handleCandidatarClick}>
              CANDIDATAR-SE
            </button>
            <button className="btn-icon-circular" title="Compartilhar" onClick={handleShare}>
              <Share2 size={20} />
            </button>
            <button className={`btn-icon-circular ${isSaved ? 'saved' : ''}`} title="Salvar Vaga" onClick={() => toggleSavedJob && toggleSavedJob(job.id)}>
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Abas Navegacionais */}
          <div className="jd-tabs-container">
            <button className={`jd-tab ${activeTab === 'vaga' ? 'active' : ''}`} onClick={() => setActiveTab('vaga')}>
              VAGA
            </button>
            <button className={`jd-tab ${activeTab === 'beneficios' ? 'active' : ''}`} onClick={() => setActiveTab('beneficios')}>
              BENEFÍCIOS
            </button>
            <button className={`jd-tab ${activeTab === 'empresa' ? 'active' : ''}`} onClick={() => setActiveTab('empresa')}>
              EMPRESA
            </button>
          </div>

          {/* Bloco Unificado: Informações da Vaga (Aparece em todas as abas) */}
          <div className="jd-main-info-grid">
              <div className="jd-hero-meta">
                <div className="jd-hero-item">
                  <div className="jd-item-icon"><MapPin size={18} /></div>
                  <div className="jd-item-text">
                    <span className="jd-item-label">Local</span>
                    <span className="jd-item-value">{job.modalidade_trabalho}</span>
                  </div>
                </div>
                <div className="jd-hero-item">
                  <div className="jd-item-icon"><Briefcase size={18} /></div>
                  <div className="jd-item-text">
                    <span className="jd-item-label">Contrato</span>
                    <span className="jd-item-value">{job.modalidade_contrato || 'CLT'}</span>
                  </div>
                </div>
                <div className="jd-hero-item">
                  <div className="jd-item-icon"><BarChart size={18} /></div>
                  <div className="jd-item-text">
                    <span className="jd-item-label">Nível</span>
                    <span className="jd-item-value">{job.nivel || 'Não informado'}</span>
                  </div>
                </div>
                <div className="jd-hero-item highlight">
                  <div className="jd-item-icon"><Banknote size={18} /></div>
                  <div className="jd-item-text">
                    <span className="jd-item-label">Salário</span>
                    <span className="jd-item-value">{job.salario || 'A combinar'}</span>
                  </div>
                </div>
                {job.num_vagas && parseInt(job.num_vagas) > 1 && (
                  <div className="jd-hero-item">
                    <div className="jd-item-icon"><Users size={18} /></div>
                    <div className="jd-item-text">
                      <span className="jd-item-label">Vagas</span>
                      <span className="jd-item-value">{job.num_vagas} abertas</span>
                    </div>
                  </div>
                )}
                {job.horario && (
                   <div className="jd-hero-item">
                    <div className="jd-item-icon"><Clock size={18} /></div>
                    <div className="jd-item-text">
                      <span className="jd-item-label">Horário</span>
                      <span className="jd-item-value">{job.horario}</span>
                    </div>
                  </div>
                )}
              </div>


          </div>

          <div className="job-blocks mt-4" style={{paddingBottom: '80px'}}>
              {/* Mostra as seções baseado na aba ativa */}
              
              {activeTab === 'vaga' && (
                <>
                  <div className="job-block block-premium">
                    <h2 className="block-title-icon"><FileText size={22} className="block-icon" /> Sobre a vaga</h2>
                    <p className="whitespace-pre-line block-text-premium">{job.descricao}</p>
                  </div>

                  {job.atividades && (
                    <div className="job-block block-premium">
                      <h2 className="block-title-icon"><Target size={22} className="block-icon" /> Responsabilidades e Atividades</h2>
                      <p className="whitespace-pre-line block-text-premium">{job.atividades}</p>
                    </div>
                  )}

                  {job.requisitos && (
                    <div className="job-block block-premium">
                      <h2 className="block-title-icon"><ListChecks size={22} className="block-icon" /> Requisitos</h2>
                      <p className="whitespace-pre-line block-text-premium">{job.requisitos}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'beneficios' && (
                <>
                  {job.diferenciais && (
                    <div className="job-block block-premium">
                      <h2 className="block-title-icon"><Award size={22} className="block-icon" /> Diferenciais</h2>
                      <p className="whitespace-pre-line block-text-premium">{job.diferenciais}</p>
                    </div>
                  )}
                  
                  {(job.beneficios_lista?.length > 0 || job.beneficios) && (
                    <div className="job-block block-premium">
                      <h2 className="block-title-icon"><Gift size={22} className="block-icon" /> Benefícios</h2>
                      {job.beneficios_lista && job.beneficios_lista.length > 0 && (
                        <div className="benefits-grid-large mt-3">
                          {job.beneficios_lista.map(b => (
                            <div key={b.id} className="bf-card">
                              <div className="bf-icon">{BENEFIT_ICONS[b.id] || <Gift size={18} />}</div>
                              <div className="bf-content">
                                <span className="bf-text">{b.label}</span>
                                {b.valor && <span className="bf-val">{b.valor}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {job.beneficios && (
                        <div className="benefits-extra">
                          <strong>Outros benefícios:</strong>
                          <p className="whitespace-pre-line block-text-premium mt-2">{job.beneficios}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Diversidade transferida para Cultura/Benefícios para economizar espaço */}
                  {(job.pcd || job.afirmativa?.mulheres || job.afirmativa?.negros || job.afirmativa?.lgbt || job.afirmativa?.senior || job.afirmativa?.vulnerabilidade) && (
                    <div className="jd-diversity-band-integrated" style={{marginBottom: 0}}>
                      <span className="div-title">✨ Compromisso Social</span>
                      <div className="job-badges-rich">
                        {job.pcd && <span className="jc-tag tag-pcd">Vaga PcD</span>}
                        {job.afirmativa?.mulheres && <span className="jc-tag tag-women">Mulheres</span>}
                        {job.afirmativa?.negros && <span className="jc-tag tag-black">Pessoas Negras</span>}
                        {job.afirmativa?.lgbt && <span className="jc-tag tag-pride">LGBTQIA+</span>}
                        {job.afirmativa?.senior && <span className="jc-tag tag-senior">Profissionais 50+</span>}
                        {job.afirmativa?.vulnerabilidade && <span className="jc-tag tag-social">Inclusão Social</span>}
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'empresa' && (
                <>
                  {job.descricao_empresa ? (
                    <div className="job-block block-premium">
                      <h2 className="block-title-icon"><Building2 size={22} className="block-icon" /> Sobre a empresa</h2>
                      <p className="whitespace-pre-line block-text-premium">{job.descricao_empresa}</p>
                    </div>
                  ) : (
                    <div className="job-block block-premium text-center">
                      <Building2 size={48} className="block-icon mx-auto mb-3 opacity-50" />
                      <p className="block-text-premium">A empresa não forneceu uma descrição detalhada.</p>
                    </div>
                  )}
                </>
              )}
          </div>

          {/* Área de Candidatura */}
          <div id="candidatura-section" className="job-block block-premium mt-4">
             <h2 className="block-title-icon"><Target size={22} className="block-icon" /> Enviar Candidatura</h2>
             <p className="block-text-premium mb-4">Escolha a melhor forma de se candidatar para esta vaga. Lembre-se de mencionar que encontrou a vaga no Trampo Fácil!</p>
             <div className="jd-quick-actions">
              {job.contato?.whatsapp && (
                <a href={getWhatsAppLink(job.contato.whatsapp)} target="_blank" rel="noreferrer" className="btn btn-whatsapp action-fluid">
                  <MessageCircle size={20} /> Candidatar-se via WhatsApp
                </a>
              )}
              <div className="jd-secondary-actions mt-3">
                {job.contato?.email && (
                  <a href={getEmailLink(job.contato.email)} className="btn btn-mail action-fluid">
                    <Mail size={18} /> Enviar E-mail
                  </a>
                )}
                {job.contato?.link && (
                  <a href={job.contato.link.startsWith('http') ? job.contato.link : `https://${job.contato.link}`} target="_blank" rel="noreferrer" className="btn btn-primary action-fluid">
                    <ExternalLink size={18} /> Formulário Externo
                  </a>
                )}
              </div>
              {job.contato?.endereco && (
                <div className="presencial-info-sticky mt-3 justify-center">
                  <MapPin size={18} /> <span>Envio Presencial: {job.contato.endereco}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Mobile Bar -> Reduzida já que botão enorme existe */}
          <div className="sticky-action-bar mobile-only">
             <button className="btn btn-primary action-fluid" onClick={handleCandidatarClick}>
               CANDIDATAR-SE
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
