import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Edit } from 'lucide-react';
import './Success.css';

export function Success() {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.id || !state.token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container success-page">
      <div className="success-card">
        <CheckCircle size={64} className="success-icon" />
        <h1>Vaga publicada com sucesso!</h1>
        <p className="success-message">
          Sua vaga já está no ar e disponível para candidatos.
          Guarde o link de edição caso precise alterar algo ou fechar a vaga no futuro.
        </p>

        <div className="success-actions">
          <Link to={`/vaga/${state.id}`} className="btn btn-primary btn-large">
            <ExternalLink size={20} /> Ver a vaga publicada
          </Link>
          
          <div className="edit-link-container">
            <p className="edit-link-title">Link para edição (Guarde com você):</p>
            <div className="edit-link-box">
              <Link to={`/editar/${state.token}`} className="edit-link">
                <Edit size={16} /> tramposfacil.com/editar/{state.token}
              </Link>
            </div>
            <p className="help-text text-center mt-2">
              Se você perder esse link, não será possível editar a vaga depois. A vaga expirará automaticamente em 30 dias.
            </p>
          </div>
        </div>

        <div className="success-footer">
          <Link to="/" className="btn btn-outline">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
