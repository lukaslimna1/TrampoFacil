import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobForm } from '../components/JobForm';
import './PublishJob.css';

export function PublishJob() {
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const handleCreate = (jobData) => {
    const { id, token } = addJob(jobData);
    navigate('/sucesso', { state: { id, token } });
  };

  return (
    <div className="publish-page-pure">
       <JobForm onSubmit={handleCreate} buttonText="Lançar Vaga no Feed" />
    </div>
  );
}
