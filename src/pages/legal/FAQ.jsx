/**
 * COMPONENTE: FAQContent
 * OBJETIVO: Resolver dúvidas comuns de candidatos e empresas de forma rápida.
 * POR QUE: Reduz a carga de suporte e melhora a experiência do usuário, 
 * fornecendo respostas imediatas sobre o funcionamento da plataforma.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, Zap, CheckCircle2, Users, Building2, 
  UserPlus, Smartphone, Send, Edit3, MessageSquare 
} from 'lucide-react';
import { AccordionItem } from './AccordionItem';

export function FAQContent() {
  return (
    <section className="legal-section animate-fade-in">
      <div className="section-header">
        <div className="header-icon-box"><HelpCircle size={32} /></div>
        <div className="header-text-group">
          <h2>FAQ & Guia de Uso</h2>
          <div className="legal-badges">
            <span className="badge-legal"><Zap size={12} /> Simples & Direto</span>
            <span className="badge-legal success"><CheckCircle2 size={12} /> Sem Burocracia</span>
          </div>
        </div>
      </div>

      <div className="lead-text">
        O Trampo Fácil foi desenhado para eliminar fricção. Sem cadastros obrigatórios ou formulários intermináveis — conectamos você diretamente à oportunidade.
      </div>

      <div className="formal-content">
        <div className="help-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3><Users size={20} className="text-primary" /> Para Candidatos</h3>
            <p className="text-sm text-muted">Encontre a vaga, analise os requisitos e fale diretamente com o recrutador via WhatsApp ou e-mail.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h3><Building2 size={20} className="text-primary" /> Para Empresas</h3>
            <p className="text-sm text-muted">Publique sua vaga em segundos e gerencie tudo através do seu Token de Edição exclusivo.</p>
          </div>
        </div>

        <div className="faq-main-wrapper">
          <div className="faq-group-header">
            <UserPlus size={18} />
            <span>Candidatos</span>
          </div>
          <div className="accordion-group">
            <AccordionItem title="Preciso criar conta?" icon={Smartphone}>
              <p>Não. O Trampo Fácil é 100% accountless. Você pode buscar e se candidatar a qualquer vaga sem necessidade de login ou senhas.</p>
            </AccordionItem>
            <AccordionItem title="Como me candidato?" icon={Send}>
              <p>Cada vaga exibe os canais de contato escolhidos pela empresa (WhatsApp, E-mail ou Link). O processo ocorre de forma externa e direta.</p>
            </AccordionItem>
          </div>

          <div className="faq-group-header mt-5">
            <Building2 size={18} />
            <span>Empresas</span>
          </div>
          <div className="accordion-group">
            <AccordionItem title="Como edito minha vaga?" icon={Edit3}>
              <p>Ao publicar, você recebe um e-mail com o link de gerenciamento. Esse link contém o seu Token de Edição, sua chave única para atualizar ou remover a vaga.</p>
            </AccordionItem>
            <AccordionItem title="Qual o custo de publicação?" icon={Zap}>
              <p>Atualmente, a publicação de vagas básicas é gratuita. Oferecemos visibilidade imediata para conectar sua empresa aos melhores talentos.</p>
            </AccordionItem>
          </div>
        </div>

        <div className="legal-notice">
          <h4 className="d-flex align-items-center gap-2">
            <MessageSquare size={20} /> Ainda com dúvidas?
          </h4>
          <p className="mt-2">Nossa equipe de suporte técnico está à disposição para ajudar com qualquer questão sobre a plataforma.</p>
          <Link to="/contato" className="btn-legal-action">Abrir Ticket de Suporte</Link>
        </div>
      </div>
    </section>
  );
}
