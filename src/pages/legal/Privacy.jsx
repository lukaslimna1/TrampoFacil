/**
 * COMPONENTE: PrivacyContent
 * OBJETIVO: Exibir a Política de Privacidade de forma clara e estruturada.
 * POR QUE: Essencial para conformidade com a LGPD e para garantir a transparência
 * no tratamento de dados da plataforma accountless do Trampo Fácil.
 */
/**
 * COMPONENTE: PrivacyContent
 * OBJETIVO: Exibir a Política de Privacidade de forma clara e estruturada.
 * POR QUE: Essencial para conformidade com a LGPD e para garantir a transparência
 * no tratamento de dados da plataforma accountless do Trampo Fácil.
 */
import React from 'react';
import { Lock, Share2, ShieldCheck, Database, Eye } from 'lucide-react';

export function PrivacyContent() {
  return (
    <section className="legal-section animate-fade-in">
      <div className="section-header">
        <div className="header-icon-box"><Lock size={32} /></div>
        <div className="header-text-group">
          <h2>Política de Privacidade</h2>
          <div className="legal-badges">
            <span className="badge-legal"><Share2 size={12} /> LGPD Brasil</span>
            <span className="badge-legal success"><ShieldCheck size={12} /> Data Privacy</span>
          </div>
        </div>
      </div>

      <div className="formal-content">
        <div className="privacy-item">
          <h3>Visão Geral</h3>
          <p>Sua privacidade é nossa prioridade. No Trampo Fácil, operamos sob o princípio do **Mínimo Dado Necessário**. Não criamos perfis de rastreamento nem vendemos suas informações para terceiros.</p>
        </div>

        <div className="content-grid">
          <div className="info-block">
            <h3><Database size={24} className="text-primary" /> Dados Coletados</h3>
            <ul>
              <li><strong>Empresas:</strong> E-mail e dados de contato profissional.</li>
              <li><strong>Candidatos:</strong> Não coletamos dados de currículos.</li>
              <li><strong>Técnicos:</strong> IP e metadados para segurança.</li>
            </ul>
          </div>
          <div className="info-block">
            <h3><Eye size={24} className="text-primary" /> Uso das Informações</h3>
            <ul>
              <li>Exibição pública das vagas publicadas.</li>
              <li>Envio do Token de Edição para empresas.</li>
              <li>Prevenção de fraudes e ataques técnicos.</li>
            </ul>
          </div>
        </div>

        <div className="privacy-item">
          <h3>Cookies e Armazenamento</h3>
          <p>Utilizamos cookies estritamente funcionais e o **LocalStorage** do seu navegador para salvar suas vagas favoritas e preferências de filtro. Nenhum cookie de marketing de terceiros é utilizado.</p>
        </div>

        <div className="legal-notice">
          <h4>Seus Direitos (LGPD)</h4>
          <p className="mt-2">Você tem direito ao acesso, retificação e exclusão de seus dados. Para exercer esses direitos, entre em contato através de **privacidade@trampofacil.com**.</p>
        </div>
      </div>
    </section>
  );
}
