import { useState } from 'react';
import { useToast } from '../context/ToastContextCore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobForm } from '../components/JobForm';
import './PublishJob.css';

export function PublishJob() {
  const { showToast } = useToast();
  const { addJob } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();

  const preSelectedPlan = location.state?.plan;
  const initialData = preSelectedPlan === 'urgent' 
    ? { is_urgent: true } 
    : preSelectedPlan === 'premium' 
    ? { is_featured: true } 
    : {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (jobData) => {
    try {
      setIsSubmitting(true);
      const result = await addJob(jobData);
      if (!result) throw new Error("Falha ao criar vaga");
      
      const { id, token } = result;
      
      // Navegamos para sucesso apenas se não houver pagamento pendente (vaga free)
      // Se houver pagamento, o JobForm cuidará do redirecionamento para o Stripe
      if (jobData.payment_status !== 'pending') {
        navigate('/sucesso', { state: { id, token } });
      }
      
      return result; 
    } catch (err) {
      console.error("Erro no handleCreate:", err);
      showToast("Erro ao publicar vaga. Verifique sua conexão.", "error");
      throw err; // Repassa para o JobForm capturar
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="publish-page-pure">
       <JobForm 
         onSubmit={handleCreate} 
         initialData={initialData}
         buttonText={isSubmitting ? "Lançando..." : "Lançar Vaga no Feed"} 
       />
    </div>
  );
}
