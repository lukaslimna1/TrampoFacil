/**
 * COMPONENTE: SecurityContent
 * OBJETIVO: Orientar o usuário sobre práticas seguras e proteção contra fraudes.
 * POR QUE: Como uma plataforma aberta, a educação do usuário é a primeira camada
 * de defesa contra golpes e vagas falsas.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, ShieldAlert, Database } from 'lucide-react';

export function SecurityContent() {
  return (
    <section className="legal-section animate-fade-in">
      <div className="section-header">
        <div className="header-icon-box"><ShieldCheck size={32} /></div>
        <div className="header-text-group">
          <h2>Segurança e Proteção</h2>
          <div className="legal-badges">
            <span className="badge-legal"><ShieldCheck size={12} /> Proteção de Dados</span>
            <span className="badge-legal success"><Lock size={12} /> Criptografia Ponta-a-Ponta</span>
          </div>
        </div>
      </div>
      
      <div className="lead-text">
        No Trampo Fácil, a segurança não é um detalhe — é a base de toda a experiência. Nosso objetivo é garantir que você encontre oportunidades reais com a máxima proteção digital.
      </div>

      <div className="content-grid">
        <div className="info-block border-warning">
          <h3><AlertTriangle size={24} className="text-warning" /> Sinais Suspeitos</h3>
          <ul>
            <li>Cobrança de taxas para contratação ou uniformes.</li>
            <li>Promessas de ganhos irreais ou acima do mercado.</li>
            <li>Falta de informações claras sobre a empresa contratante.</li>
            <li>Erros graves de escrita ou mensagens muito genéricas.</li>
          </ul>
        </div>
        
        <div className="info-block border-success">
          <h3><ShieldCheck size={24} className="text-success" /> Boas Práticas</h3>
          <ul>
            <li>Nunca compartilhar senhas ou dados bancários por chat.</li>
            <li>Desconfiar de processos que pulam etapas básicas.</li>
            <li>Pesquisar sobre a empresa antes de comparecer a entrevistas.</li>
            <li>Utilizar canais oficiais de comunicação.</li>
          </ul>
        </div>
      </div>

      <div className="info-block mb-5">
        <h3><Database size={24} className="text-primary" /> Como Protegemos Seus Dados</h3>
        <p className="mb-4 text-muted">Mesmo operando sem contas tradicionais, aplicamos camadas rigorosas de proteção para garantir a integridade da plataforma:</p>
        <div className="privacy-grid">
          <div className="privacy-item">
            <h4 className="text-white mb-2">Token de Edição</h4>
            <p className="text-sm">Links únicos gerados para empresas, eliminando a necessidade de senhas estáticas.</p>
          </div>
          <div className="privacy-item">
            <h4 className="text-white mb-2">Expiração Automática</h4>
            <p className="text-sm">Vagas são removidas após 30 dias, reduzindo a exposição de dados de contato.</p>
          </div>
        </div>
      </div>

      <div className="legal-notice warning">
        <h4 className="d-flex align-items-center gap-2">
          <ShieldAlert size={20} /> Viu algo suspeito?
        </h4>
        <p className="mt-2">Não hesite em denunciar. Nossa equipe analisa 100% das denúncias em menos de 24 horas para manter a comunidade segura.</p>
        <Link to="/contato" className="btn-legal-action">Denunciar Agora</Link>
      </div>
    </section>
  );
}
