import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiAlertCircle } from 'react-icons/fi';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code-wrapper">
          <h1 className="error-code">404</h1>
          <div className="error-blur-glow"></div>
        </div>
        
        <div className="error-card">
          <FiAlertCircle className="error-icon" />
          <h2>Página não encontrada</h2>
          <p>
            Opa! Parece que essa vaga ou página expirou ou nunca existiu. 
            Não se preocupe, o caminho para o seu próximo trampo continua por aqui.
          </p>
          
          <div className="error-actions">
            <Link to="/" className="btn-primary">
              <FiHome /> Voltar ao Início
            </Link>
            <Link to="/" className="btn-secondary">
              <FiSearch /> Buscar Vagas
            </Link>
          </div>
        </div>
        
        <div className="not-found-footer">
          <p>© 2026 Trampo Fácil — Conectando Talentos com Estilo.</p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
    </div>
  );
};

export default NotFound;
