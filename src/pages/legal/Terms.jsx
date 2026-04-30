/**
 * COMPONENTE: TermsContent
 * OBJETIVO: Apresentar os Termos de Uso e condições da plataforma.
 * POR QUE: Define as responsabilidades legais entre a plataforma, empresas e candidatos,
 * protegendo o ecossistema contra uso indevido.
 */
import React from 'react';
import { FileText, Scale, ShieldCheck, Users, Building2 } from 'lucide-react';

export function TermsContent() {
  return (
    <section className="legal-section animate-fade-in">
      <div className="section-header">
        <div className="header-icon-box"><FileText size={32} /></div>
        <div className="header-text-group">
          <h2>Termos de Uso</h2>
          <div className="legal-badges">
            <span className="badge-legal"><Scale size={12} /> Compliance v2.1</span>
            <span className="badge-legal success"><ShieldCheck size={12} /> Atualizado Abril 2026</span>
          </div>
        </div>
      </div>

      <div className="formal-content">
        <div className="privacy-item">
          <h3>1. Aceitação dos Termos</h3>
          <p>Ao acessar o Trampo Fácil, você concorda integralmente com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com qualquer disposição, solicitamos que não utilize a plataforma.</p>
        </div>

        <div className="privacy-item">
          <h3>2. Natureza do Serviço</h3>
          <p>O Trampo Fácil atua exclusivamente como um hub de divulgação de vagas, conectando candidatos e empresas. Não intermediamos processos seletivos, contratações ou relações trabalhistas.</p>
        </div>

        <div className="content-grid">
          <div className="info-block">
            <h3><Users size={20} className="text-primary" /> Para Usuários</h3>
            <ul>
              <li>Acesso livre sem necessidade de cadastro.</li>
              <li>Responsabilidade pela veracidade das informações enviadas.</li>
              <li>Uso estritamente pessoal e profissional.</li>
            </ul>
          </div>
          <div className="info-block">
            <h3><Building2 size={20} className="text-primary" /> Para Empresas</h3>
            <ul>
              <li>Proibição de anúncios fraudulentos ou discriminatórios.</li>
              <li>Responsabilidade pelo conteúdo e links publicados.</li>
              <li>Gestão de vagas via Token de Edição.</li>
            </ul>
          </div>
        </div>

        <div className="privacy-item">
          <h3>3. Modelo Accountless & Tokens</h3>
          <p>Utilizamos um modelo de acesso sem conta. Cada vaga gera um Token de Edição único enviado por e-mail. A guarda e o uso desse token são de responsabilidade exclusiva da empresa anunciante.</p>
        </div>

        <div className="legal-notice">
          <h4>Limitação de Responsabilidade</h4>
          <p className="mt-2 text-sm text-muted">A plataforma não se responsabiliza por acordos, promessas ou interações ocorridas fora de seu domínio técnico. Recomendamos cautela em todas as interações profissionais.</p>
        </div>
      </div>
    </section>
  );
}
