import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ShieldCheck, CreditCard, Sparkles, Flame, Gem } from 'lucide-react';
import './PaymentModal.css';

export function PaymentModal({ isOpen, onClose, plan, checkoutUrl, jobId }) {
  if (!isOpen) return null;

    // Determine plan details and UI strings
  const isUrgent = plan === 'urgente' || plan === 'combo';
  const isPremium = plan === 'premium' || plan === 'combo';
  let planName = '';
  let planIcon = null;
  let planPrice = '';
  let title = '';
  let subtitle = '';

  if (plan === 'combo') {
    planName = 'Combo Urgente + Destaque Premium';
    // Golden flame for combo
    planIcon = <Flame size={24} color="#F59E0B" fill="#F59E0B" />;
    planPrice = 'R$ 39,80';
    title = 'Finalize seu Combo';
    subtitle = 'Vaga Urgente + Destaque Premium';
  } else if (isUrgent) {
    planName = 'Vaga Urgente';
    // Golden flame for individual urgent too
    planIcon = <Flame size={24} color="#F59E0B" fill="#F59E0B" />;
    planPrice = 'R$ 9,90';
    title = `Finalize seu ${planName}`;
    subtitle = planName;
  } else {
    planName = 'Destaque Premium';
    // Detailed diamond (Gem) for premium - Golden
    planIcon = <Gem size={24} color="#F59E0B" fill="#F59E0B" />;
    planPrice = 'R$ 29,90';
    title = `Finalize seu ${planName}`;
    subtitle = planName;
  }

  const handleGoToStripe = () => {
    window.open(checkoutUrl, '_blank');
  };

  return createPortal(
    <div className="pm-overlay">
      <div className="pm-container">
        <button className="pm-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="pm-content">
          <div className={`pm-icon-badge ${isUrgent ? 'urgent' : isPremium ? 'premium' : ''}`}>
            {planIcon}
          </div>
          
          <h2 className="pm-title">{title}</h2>
          {subtitle && <h3 className="pm-subtitle">{subtitle}</h3>}
          <p className="pm-subtitle">
            Sua vaga está salva como rascunho. Para que ela seja publicada com destaque no feed, conclua o pagamento de <strong>{planPrice}</strong>.
          </p>

          <div className="pm-card-details">
            <div className="pm-detail-item">
              <ShieldCheck size={18} className="text-primary" />
              <span>Pagamento Seguro via Stripe</span>
            </div>
            <div className="pm-detail-item">
              <CreditCard size={18} className="text-primary" />
              <span>Cartão de Crédito ou PIX</span>
            </div>
            <div className="pm-detail-item">
              <Sparkles size={18} className="text-primary" />
              <span>Destaque imediato após aprovação</span>
            </div>
          </div>

          <button className="pm-btn-primary" onClick={handleGoToStripe}>
            Pagar com Stripe <ExternalLink size={18} />
          </button>

          <button className="pm-btn-success" onClick={() => window.location.href = `/vaga/${jobId}`}>
            Já paguei, ver minha vaga <Sparkles size={18} />
          </button>

          <p className="pm-footer-info">
            Ao clicar em pagar, uma nova aba será aberta.
            <br />
            <strong>Após concluir</strong>, clique no botão acima para ver sua vaga.
          </p>

          <button className="pm-btn-secondary" onClick={onClose}>
            Pagar depois (Salvar como rascunho)
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
