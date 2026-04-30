/**
 * PÁGINA: EditJob
 * OBJETIVO: Gerenciamento e edição de uma vaga existente.
 * POR QUE: Permite que o recrutador altere dados da vaga ou a exclua 
 * utilizando o Token de Edição enviado por e-mail, mantendo o fluxo Accountless.
 */
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../context/ToastContextCore';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobForm } from '../components/JobForm';
import { Key, Mail, Trash2, ArrowLeft, Rocket, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import './EditJob.css';

export function EditJob() {
  const { showToast } = useToast();
  const { token: urlToken } = useParams();
  const { getJobByToken, updateJob, deleteJob, getJobsByEmail, isContextLoading } = useJobs();
  const navigate = useNavigate();
  
  // Estados de Navegação Interna
  const [activeTab, setActiveTab] = useState('token'); // 'token' ou 'recover'
  const [tokenInput, setTokenInput] = useState(urlToken || '');
  const [activeToken, setActiveToken] = useState(urlToken || '');
  const [email, setEmail] = useState('');
  
  // Estados de Dados e UI
  const [recoveredJobs, setRecoveredJobs] = useState([]); // Armazena as vagas para o simulador
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deriva a vaga baseada no token ativo
  const job = useMemo(() => {
    if (!activeToken || isContextLoading) return null;
    return getJobByToken(activeToken);
  }, [activeToken, isContextLoading, getJobByToken]);

  // Efeito para validar token da URL ou entrada manual
  useEffect(() => {
    if (activeToken && !isContextLoading && !job) {
      showToast('Token inválido ou não encontrado.', 'error');
    }
  }, [activeToken, isContextLoading, job, showToast]);

  // Ação: Acessar via Token
  const handleTokenAccess = (e, manualToken) => {
    if (e) e.preventDefault();
    const targetToken = manualToken || tokenInput;
    
    setIsLoading(true);
    
    const foundJob = getJobByToken(targetToken);
    if (foundJob) {
      setActiveToken(targetToken);
      setTokenInput(targetToken);
      navigate(`/editar/${targetToken}`, { replace: true });
      showToast('Acesso concedido!', 'success');
    } else {
      showToast('Não encontramos nenhuma vaga com este token.', 'error');
    }
    setIsLoading(false);
  };

  // Ação: Recuperar via E-mail
  const handleRecoverEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setRecoveredJobs([]);

    try {
      const foundJobs = await getJobsByEmail(email);
      if (foundJobs.length > 0) {
        setRecoveredJobs(foundJobs);
        setSuccessMessage(`Encontramos ${foundJobs.length} vaga(s) vinculada(s) ao seu e-mail.`);
        showToast('Vagas localizadas com sucesso!', 'success');
      } else {
        showToast('Não encontramos nenhuma vaga vinculada a este e-mail.', 'warning');
      }
    } catch {
      showToast('Erro ao processar solicitação. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      setIsSubmitting(true);
      await updateJob(activeToken, updatedData);
      showToast('Vaga atualizada com sucesso!', 'success');
      navigate(`/vaga/${job.id}`);
    } catch {
      showToast("Erro ao atualizar vaga.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Excluir esta vaga permanentemente?')) {
      try {
        setIsSubmitting(true);
        await deleteJob(activeToken);
        showToast('Vaga removida com sucesso!', 'info');
        navigate('/');
      } catch {
        showToast("Erro ao excluir vaga.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // --- TELA DE ACESSO (TOKEN OU RECUPERAÇÃO) ---
  if (!job) {
    return (
      <div className="manage-auth-page">
        <div className="auth-card-premium animate-in">
          <div className="auth-card-header">
             <div className="auth-badge">Recruiter Command Center</div>
             <h1>Gerenciar sua Vaga</h1>
             <p>Acesse o painel de controle para editar ou remover seus anúncios.</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'token' ? 'active' : ''}`}
              onClick={() => { setActiveTab('token'); setSuccessMessage(''); setRecoveredJobs([]); }}
            >
              <Key size={18} />
              <span>Token Direto</span>
            </button>
            <button 
              className={`auth-tab ${activeTab === 'recover' ? 'active' : ''}`}
              onClick={() => { setActiveTab('recover'); setSuccessMessage(''); }}
            >
              <Mail size={18} />
              <span>Via E-mail</span>
            </button>
          </div>

          <div className="auth-content">
            {activeTab === 'token' ? (
              <form onSubmit={handleTokenAccess} className="auth-form-fade">
                <div className="form-group-modern">
                  <label>Inserir Token de Acesso</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: 8a2f-b4c1..."
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <button type="submit" className="btn-primary-glow" disabled={isLoading}>
                  {isLoading ? 'Autenticando...' : 'Acessar Painel'}
                  <Rocket size={18} />
                </button>
              </form>
            ) : (
              <div className="auth-form-fade">
                {recoveredJobs.length > 0 ? (
                  <div className="recovery-simulator animate-in">
                    <div className="simulator-header">
                      <CheckCircle2 size={20} className="text-success" />
                      <span>{successMessage}</span>
                    </div>
                    
                    <div className="recovered-list">
                      {recoveredJobs.map(j => (
                        <div key={j.id} className="recovered-item">
                          <div className="recovered-info">
                            <strong>{j.titulo}</strong>
                            <code>ID: {j.id.substring(0, 8)}</code>
                          </div>
                          <button 
                            className="btn-access-now"
                            onClick={() => handleTokenAccess(null, j.token_edicao)}
                          >
                            Editar <ArrowRight size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button className="btn-link-small" onClick={() => { setRecoveredJobs([]); setSuccessMessage(''); }}>
                      Buscar outro e-mail
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRecoverEmail}>
                    <div className="form-group-modern">
                      <label>E-mail Cadastrado</label>
                      <input 
                        required
                        type="email" 
                        placeholder="recrutador@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-premium"
                      />
                    </div>
                    <button type="submit" className="btn-primary-glow" disabled={isLoading}>
                      {isLoading ? 'Consultando...' : 'Recuperar Tokens'}
                      <Mail size={18} />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Toasts globais substituem os alertas inline */}
            {/* {error && (
              <div className="error-alert-modern animate-in">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )} */}
          </div>

          <div className="auth-footer-info">
            <p>O gerenciamento é gratuito e permite editar ou excluir vagas a qualquer momento.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE EDIÇÃO (QUANDO JÁ TEM A VAGA) ---
  return (
    <div className="edit-page-container">
      <header className="edit-job-header">
        <div className="container header-flex">
          <div className="header-left">
            <button onClick={() => navigate(-1)} className="btn-back-premium">
              <ArrowLeft size={22} />
            </button>
            <div>
              <div className="manage-badge-v2">
                <Shield size={12} />
                Gestão de Vaga
              </div>
              <h1>Painel de Controle</h1>
              <p className="refining-text">
                Refinando: <strong>{job.titulo}</strong>
              </p>
            </div>
          </div>
          
          <button 
            className="btn-delete-premium" 
            onClick={handleDelete} 
            disabled={isSubmitting}
            title="Excluir vaga permanentemente"
          >
            <Trash2 size={20} />
            <span>Remover Vaga</span>
          </button>
        </div>
      </header>

      <div className="edit-form-content">
        <JobForm 
          initialData={job} 
          onSubmit={handleUpdate} 
          isSubmitting={isSubmitting}
          buttonText="Salvar Alterações"
          hideHero={true}
          title="" 
          subtitle=""
        />
      </div>
    </div>
  );
}
