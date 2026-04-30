import { useState } from 'react';
import { useToast } from '../context/ToastContextCore';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobForm } from '../components/JobForm';
import './PublishJob.css';

export function PublishJob() {
  const { showToast } = useToast();
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (jobData) => {
    try {
      setIsSubmitting(true);
      const { id, token } = await addJob(jobData);
      navigate('/sucesso', { state: { id, token } });
    } catch {
      showToast("Erro ao publicar vaga. Verifique sua conexão.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="publish-page-pure">
       <JobForm 
         onSubmit={handleCreate} 
         buttonText={isSubmitting ? "Lançando..." : "Lançar Vaga no Feed"} 
       />
    </div>
  );
}
