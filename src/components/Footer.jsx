import { Link } from 'react-router-dom';
import './Footer.css';

const LinkedinIcon = ({ size = 22, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 22, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 22, strokeWidth = 1.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export function Footer() {

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <span className="footer-logo-text">Trampo Fácil</span>
            <p className="footer-tagline">A plataforma de vagas mais direta do mercado. Sem frescura, focada no que importa.</p>
            <div className="footer-ai-badge">
              <div className="ai-dot"></div>
              <span>Powered by Trampo IA</span>
            </div>
          </div>
          
          {/* Candidatos Col */}
          <div className="footer-col">
            <h4 className="footer-heading">Candidatos</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Buscar Vagas</Link>
              <Link to="#" className="footer-link">Alerta de Vagas</Link>
              <Link to="#" className="footer-link">Dicas de Carreira</Link>
            </div>
          </div>

          {/* Empresas Col */}
          <div className="footer-col">
            <h4 className="footer-heading">Empresas</h4>
            <div className="footer-links">
              <Link to="/publicar" className="footer-link">Publicar Vaga</Link>
              <Link to="/editar" className="footer-link">Gerenciar Vagas</Link>
              <Link to="/sobre" className="footer-link">Sobre nós</Link>
              <Link to="/contato" className="footer-link">Contato</Link>
            </div>
          </div>

          {/* Suporte Col */}
          <div className="footer-col">
            <h4 className="footer-heading">Suporte</h4>
            <div className="footer-links">
              <Link to="/legal/ajuda" className="footer-link">FAQ / Ajuda</Link>
              <Link to="/legal/seguranca" className="footer-link">Segurança</Link>
              <Link to="/legal/termos" className="footer-link">Termos de Uso</Link>
              <Link to="/legal/privacidade" className="footer-link">Privacidade</Link>
            </div>
          </div>

          {/* Social / Siga-nos */}
          <div className="footer-col">
            <h4 className="footer-heading">Siga-nos</h4>
            <div className="footer-social-links">
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <LinkedinIcon size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <InstagramIcon size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <TwitterIcon size={22} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p className="footer-copy">© {new Date().getFullYear()} Trampo Fácil. Todos os direitos reservados.</p>
          <div className="footer-legal-links">
            <Link to="/legal/seguranca">Segurança</Link>
            <Link to="/legal/privacidade">Privacidade</Link>
            <Link to="/legal/termos">Termos</Link>
            <Link to="/legal/ajuda">Ajuda/FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
