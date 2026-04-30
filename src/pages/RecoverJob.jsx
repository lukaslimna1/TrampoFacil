import { useState } from 'react';
import { useToast } from '../context/ToastContextCore';
import { useJobs } from '../context/JobContext';
import { Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RecoverJob.css';

export function RecoverJob() {
  const { showToast } = useToast();
  const { getJobsByEmail } = useJobs();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const jobs = await getJobsByEmail(email);

      if (jobs.length > 0) {
        // Simulação de envio de e-mail (Já que não temos SMTP configurado ainda)
        console.log("Vagas encontradas para o e-mail:", jobs);
        setStatus('success');
        setMessage(`Encontramos ${jobs.length} vaga(s) vinculada(s) ao seu e-mail. Um código de acesso foi enviado.`);
        showToast('Código de acesso enviado com sucesso!', 'success');
      } else {
        setStatus('error');
        const errorMsg = 'Não encontramos nenhuma vaga ativa para este e-mail.';
        setMessage(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch {
      setStatus('error');
      const errorMsg = 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
      setMessage(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="recover-page-container">
      <div className="recover-card-glass animate-in">
        <div className="recover-header">
          <div className="icon-badge-gold">
            <ShieldCheck size={32} />
          </div>
          <h1>Recuperar Acesso</h1>
          <p>Esqueceu seu token de edição? Informe o e-mail que você usou ao publicar a vaga.</p>
        </div>

        {status === 'success' ? (
          <div className="success-state animate-in">
            <CheckCircle2 size={64} className="text-success-glow" />
            <h3>E-mail Enviado!</h3>
            <p>{message}</p>
            <div className="info-box-light">
              <AlertCircle size={18} />
              <span>Verifique sua caixa de entrada e spam.</span>
            </div>
            <Link to="/editar" className="btn-primary-glow mt-4">
              Ir para tela de Edição <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="recover-form">
            <div className="form-group-modern">
              <label><Mail size={16} /> Seu E-mail de Gestão</label>
              <input
                required
                type="email"
                placeholder="exemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
              />
            </div>

            {/* Toasts globais substituem o alerta inline */}
            {/* {status === 'error' && (
              <div className="error-alert animate-in">
                <AlertCircle size={18} />
                <span>{message}</span>
              </div>
            )} */}

            <button
              type="submit"
              className={`btn-primary-glow ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Verificando...' : 'Solicitar Acesso'}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div className="recover-footer">
          <p>Lembrou o código? <Link to="/editar">Clique aqui para editar</Link></p>
        </div>
      </div>
    </div>
  );
}
