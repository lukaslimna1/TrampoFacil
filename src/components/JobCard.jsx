import { useState, useEffect, useMemo } from 'react';
import { getIconForJobTitle } from '../utils/iconMap';
import { useJobs } from '../context/JobContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Zap, Bookmark, Eye, Flame, Banknote, Briefcase, MapPin, Clock, Star, 
  Users, BarChart, Utensils, Laptop, TrendingUp, HeartPulse, GraduationCap, 
  Gift, Baby, ShieldCheck, Sparkles
} from 'lucide-react';
import trampoAI from '../utils/trampoAI';
import './JobCard.css';

// Mapeamento de Lucide Icons para benefícios
const BENEFIT_ICONS = {
  vr: <Utensils size={14} />,
  va: <Utensils size={14} />,
  vt: <MapPin size={14} />,
  saude: <HeartPulse size={14} />,
  odonto: <HeartPulse size={14} />,
  gympass: <HeartPulse size={14} />,
  homeoffice: <Laptop size={14} />,
  internet: <Laptop size={14} />,
  educacao: <GraduationCap size={14} />,
  seguro: <ShieldCheck size={14} />,
  plr: <TrendingUp size={14} />,
  bonus: <TrendingUp size={14} />,
  cultura: <Gift size={14} />,
  dayoff: <Gift size={14} />,
  flexivel: <Clock size={14} />,
  remoto: <MapPin size={14} />,
  refeicao_local: <Utensils size={14} />,
  deficiencia: <Users size={14} />
};

export function JobCard({ job, isClickable = true, isSelected = false, onClick }) {
  const { isJobSaved, toggleSavedJob, incrementJobViews, isJobHot, isUrgencyActive } = useJobs();
  const JobAreaIcon = getIconForJobTitle(job.titulo);

  // Estados para Tempo Ago Realtime
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualiza tempo ago a cada minuto
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Visualizações reais (com fallback para simulação hash para as que já existem no sistema mas não têm contador)
  const getSimulatedViewsFallback = (id) => {
    let h = 0;
    for (let i = 0; i < (id || '').length; i++) h = (id || '').charCodeAt(i) + ((h << 5) - h);
    return Math.abs(h % 85) + 5;
  };

  const currentViews = job.views !== undefined ? job.views : getSimulatedViewsFallback(job.id);
  
  const isHot = isJobHot(job); 
  const isUrgentActive = isUrgencyActive(job);
  const isFeatured = job.is_featured; 
  const isSaved = isJobSaved ? isJobSaved(job.id) : false;
  
  // Calcula tempo real baseado no state currentTime para atualizar em tempo real
  let rawDate = new Date(job.criado_em);
  if (isNaN(rawDate.getTime())) rawDate = new Date();
  const timeAgo = formatDistanceToNow(rawDate, { addSuffix: true, locale: ptBR });

  // Sincronização com o motor TRAMPO AI v3.0 (Visão do Candidato)
  const candidateAI = trampoAI.analyzeForCandidate(job);
  const jobScore = candidateAI.attractivenessScore;
  const salaryLabel = candidateAI.marketLabel;
  const salaryColor = candidateAI.marketColor;
  const whyApply = candidateAI.whyApply;

  const cardContent = (
    <div className={`job-card-modern ${!isClickable ? 'non-interactive' : ''} ${isFeatured ? 'is-featured-vip' : ''}`}>
      
      {/* Botão de Salvar Absoluto (Canto Superior Direito) */}
      <div 
        className={`job-card-bookmark ${isSaved ? 'is-saved' : ''}`} 
        onClick={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          if(toggleSavedJob) toggleSavedJob(job.id); 
        }}
      >
        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
      </div>

      {/* Social Header: Avatar + Empresa + Meta Info */}
      <div className="jc-social-header">
        <div className="jc-icon-container">
           {job.logo_url ? (
             <img src={job.logo_url} alt={job.empresa} className="jc-company-logo" onError={(e) => e.target.style.display = 'none'} />
           ) : (
             <div className="jc-icon">
               <JobAreaIcon size={24} />
             </div>
           )}
        </div>
        <div className="jc-header-info">
           <div className="jc-company-name">
              {job.empresa || 'Empresa Confidencial'}
              {isFeatured && (
                <span className="jc-badge-vip-text">
                  <Star size={12} fill="currentColor" /> Vaga VIP
                </span>
              )}
           </div>
           <div className="jc-post-meta">
              <span>{job.cidade}</span>
              <span className="jc-dot">•</span>
              <span>{timeAgo}</span>
           </div>
        </div>
      </div>

      {/* Post Content: Título e Tags inline */}
      <div className="jc-post-content">
         <h3 className="jc-title">
           {job.titulo}
           {isHot && (
             <span className={`badge-hot-inline ${isUrgentActive ? 'is-manual-urgent' : ''}`}>
               <Flame size={12} /> {isUrgentActive ? 'URGENTE' : 'Em Alta'}
             </span>
           )}
         </h3>
      </div>

      {/* Linha 3: Pills Estilizadas (Master Info) */}
      <div className="jc-row-pills">
        <div className="jc-compact-pill pill-salary">
           <div className="jc-p-icon"><Banknote size={14} /></div>
           <span className="jc-p-text">{job.salario || 'A combinar'}</span>
        </div>
        <div className="jc-compact-pill pill-contract">
           <div className="jc-p-icon"><Briefcase size={14} /></div>
           <span className="jc-p-text">{job.modalidade_contrato}</span>
        </div>
        <div className="jc-compact-pill pill-work-mode">
           <div className="jc-p-icon"><MapPin size={14} /></div>
           <span className="jc-p-text">{job.modalidade_trabalho}</span>
        </div>
        {job.nivel && job.nivel !== 'Não informado' && (
          <div className="jc-compact-pill pill-level">
             <div className="jc-p-icon" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                <BarChart size={14} />
             </div>
             <span className="jc-p-text">{job.nivel}</span>
          </div>
        )}
        {job.num_vagas && parseInt(job.num_vagas) > 1 && (
          <div className="jc-compact-pill pill-vagas">
             <div className="jc-p-icon"><Users size={14} /></div>
             <span className="jc-p-text">{job.num_vagas} vagas</span>
          </div>
        )}
        {job.horario && (
          <div className="jc-compact-pill pill-time">
             <div className="jc-p-icon"><Clock size={14} /></div>
             <span className="jc-p-text">{job.horario}</span>
          </div>
        )}
      </div>

      {/* Linha 4: Benefícios com Destaque Total (Estilo Master Pill) */}
      {job.beneficios_lista && job.beneficios_lista.length > 0 && (
        <div className="jc-row-benefits mt-3">
          {job.beneficios_lista.slice(0, 4).map(b => (
            <div key={b.id} className="jc-compact-pill pill-benefit">
              <div className="jc-p-icon">{BENEFIT_ICONS[b.id] || <Gift size={14} />}</div>
              <span className="jc-p-text">{b.label}</span>
            </div>
          ))}
          {job.beneficios_lista.length > 4 && 
            <div className="jc-compact-pill text-muted">
               <span className="jc-p-text">+{job.beneficios_lista.length - 4} Benefícios</span>
            </div>
          }
        </div>
      )}

      {/* Linha 5: Diversidade (Badge Premium) */}
      {(job.pcd || job.exclusiva_pcd || Object.values(job.afirmativa || {}).some(Boolean)) && (
        <div className="jc-row-tags mt-2">
          {job.exclusiva_pcd && <span className="jc-tag-premium tag-pcd">Exclusiva PcD</span>}
          {job.pcd && !job.exclusiva_pcd && <span className="jc-tag-premium tag-pcd">Aceita PcD</span>}
          {job.afirmativa?.mulheres && <span className="jc-tag-premium tag-women">Mulheres</span>}
          {job.afirmativa?.negros && <span className="jc-tag-premium tag-black">Pessoas Negras</span>}
          {job.afirmativa?.lgbt && <span className="jc-tag-premium tag-pride">LGBTQIA+</span>}
          {job.afirmativa?.senior && <span className="jc-tag-premium tag-senior">50+</span>}
          {job.afirmativa?.vulnerabilidade && <span className="jc-tag-premium tag-social">Inclusão Social</span>}
        </div>
      )}

      {/* Footer: Job Score e CTA */}
      <div className="jc-social-footer">
        <div className="jc-footer-stats">
          <div className="jc-social-proof">
             <Eye size={16} className="social-icon" /> <span key={currentViews} className="view-counter-anim">{currentViews}</span> visualizações
          </div>
          <div className="jc-score-display">
             <div className="score-circle-premium" style={{"--score-percent": jobScore, "--score-color": jobScore > 80 ? '#10B981' : jobScore > 60 ? '#F59E0B' : '#EF4444'}}>
                <svg viewBox="0 0 36 36" className="circular-chart-premium">
                  <path className="circle-bg-premium"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle-progress-premium" strokeDasharray={`${jobScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="score-inner-content">
                  <span className="score-number">{jobScore}</span>
                  <span className="score-percent-sign">%</span>
                </div>
             </div>
             <div className="score-texts">
               <span className="score-label-ai"><Sparkles size={10} fill="currentColor" /> Trampo AI</span>
               <span className="score-market-label" style={{ color: salaryColor }}>
                 {salaryLabel}
               </span>
               {whyApply.length > 0 && (
                 <div className="jd-why-apply-mini">
                    {whyApply[0]}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* CTA Button */}
        {isClickable && (
          <div className="jc-actions">
            <div 
              className="btn-quick-apply" 
              style={{ 
                 backgroundColor: isSelected ? '#F1F5F9' : 'transparent', 
                 color: isSelected ? '#475569' : '#2563EB',
                 border: isSelected ? '1px solid transparent' : '1px solid rgba(37, 99, 235, 0.3)',
                 boxShadow: isSelected ? 'none' : 'none'
              }}
            >
              <Zap size={16} fill="currentColor" /> {isSelected ? 'Ocultar' : 'Ver Mais'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Como usamos links do router-dom mas tiramos importacao acima, vou garantir que ele nao quebre,
  // mas o Home lida com o onClick para desktop ou mobile nativo via navigate() lá.
  if (isClickable && onClick) {
      return (
         <div onClick={(e) => { 
            e.preventDefault(); 
            incrementJobViews(job.id); // Conta visualização ao clicar
            onClick(); 
          }} style={{cursor: 'pointer'}}>
           {cardContent}
         </div>
      );
  }

  return cardContent;
}
