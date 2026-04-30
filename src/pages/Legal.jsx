/**
 * PÁGINA: Legal (Central de Transparência)
 * OBJETIVO: Orquestrar todos os módulos de documentação e compliance.
 * POR QUE: Centraliza as informações de segurança, termos e privacidade em uma
 * arquitetura modular, facilitando a navegação e manutenção do conteúdo jurídico.
 */
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, HelpCircle, Info } from 'lucide-react';
import './Legal.css';

// Modularized Content Components
import { SecurityContent } from './legal/Security';
import { TermsContent } from './legal/Terms';
import { PrivacyContent } from './legal/Privacy';
import { FAQContent } from './legal/FAQ';

export function Legal() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('seguranca');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['seguranca', 'termos', 'privacidade', 'ajuda'].includes(path)) {
      setActiveSection(path);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const sections = [
    { id: 'seguranca', label: 'Segurança', icon: <ShieldCheck size={20} /> },
    { id: 'termos', label: 'Termos de Uso', icon: <FileText size={20} /> },
    { id: 'privacidade', label: 'Privacidade', icon: <Lock size={20} /> },
    { id: 'ajuda', label: 'FAQ & Guia', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="legal-page-container">
      {/* Decorative Background Elements */}
      <div className="tech-bg-elements">
        <div className="floating-node node-1"></div>
        <div className="floating-node node-2"></div>
        <div className="floating-node node-3"></div>
      </div>

      <div className="legal-hero">
        <div className="tech-glow-legal"></div>
        <div className="legal-container-wide">
          <div className="hero-badge animate-bounce-subtle">
            <ShieldCheck size={14} /> 100% Transparent
          </div>
          <h1 className="legal-title">Central de <span className="text-gradient">Transparência</span></h1>
          <p className="legal-subtitle">A clareza que você merece em uma plataforma construída para o futuro do trabalho.</p>
        </div>
      </div>

      <div className="legal-container-wide legal-content-wrapper">
        <aside className="legal-sidebar">
          <div className="sidebar-glass">
            <div className="sidebar-header">
              <span className="sidebar-label">Documentação</span>
            </div>
            <nav className="legal-nav">
              {sections.map(section => (
                <Link 
                  key={section.id}
                  to={`/legal/${section.id}`}
                  className={`legal-nav-item ${activeSection === section.id ? 'active' : ''}`}
                >
                  <div className="nav-icon-wrapper">
                    {section.icon}
                  </div>
                  <span>{section.label}</span>
                  <div className="active-indicator"></div>
                </Link>
              ))}
            </nav>
            <div className="sidebar-footer">
              <div className="support-card-mini">
                <Info size={14} />
                <span>Precisa de ajuda jurídica?</span>
                <Link to="/contato">Fale conosco</Link>
              </div>
            </div>
          </div>
        </aside>

        <main className="legal-main-content">
          <div className="legal-card premium-glass">
            <div className="card-inner-glow"></div>
            {activeSection === 'seguranca' && <SecurityContent />}
            {activeSection === 'termos' && <TermsContent />}
            {activeSection === 'privacidade' && <PrivacyContent />}
            {activeSection === 'ajuda' && <FAQContent />}
          </div>
        </main>
      </div>
    </div>
  );
}
