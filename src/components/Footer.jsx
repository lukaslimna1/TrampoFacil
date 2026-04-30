import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p className="footer-copy">© {new Date().getFullYear()} Trampo Fácil. "Sem cadastro. Sem enrolação. Só vaga."</p>
        <div className="footer-links">
          <Link to="/sobre" className="footer-link">Sobre</Link>
          <Link to="#" className="footer-link">Termos</Link>
          <Link to="#" className="footer-link">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
