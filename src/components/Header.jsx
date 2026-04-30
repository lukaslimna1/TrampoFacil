/**
 * COMPONENTE: Header
 * OBJETIVO: Cabeçalho unificado da aplicação com efeito de scroll e saudações IA.
 * POR QUE: Centraliza a identidade visual e navegação principal, integrando
 * o motor de saudações contextuais 'AIGreeting' para humanizar a interface.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AIGreeting } from './AIGreeting';
import './Header.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-top-bar">
        <div className="container">
          <AIGreeting variant="global" />
        </div>
      </div>
      <div className="container header-container">
        <Link to="/" className="logo-wrapper">
          <img src="/logo.png" alt="Trampo Fácil" className="logo-image" />
        </Link>
        
        <nav className="nav-links">
          <Link to="/sobre" className="nav-link hidden-mobile">Sobre</Link>
          <Link to="/para-empresas" className="nav-link hidden-mobile">Para Empresas</Link>
          <Link to="/contato" className="nav-link hidden-mobile">Contato</Link>
          <Link to="/publicar" className="btn-header-publish">
            Anunciar Vaga
            <div className="btn-shine"></div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
