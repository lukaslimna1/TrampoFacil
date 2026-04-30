import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobForm } from '../components/JobForm';

export function EditJob() {
  const { token } = useParams();
  const { getJobByToken, updateJob, deleteJob } = useJobs();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const foundJob = getJobByToken(token);
    if (!foundJob) {
      navigate('/');
    } else {
      setJob(foundJob);
    }
  }, [token, getJobByToken, navigate]);

  const handleUpdate = (updatedData) => {
    updateJob(token, updatedData);
    navigate(`/vaga/${job.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.')) {
      deleteJob(token);
      navigate('/');
    }
  };

  if (!job) return <div className="container" style={{ padding: '2rem' }}>Carregando...</div>;

  return (
    <div className="page-wrapper container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Editar Vaga</h2>
          <p className="text-muted">Atualize sua vaga ou feche a posição.</p>
        </div>
        <button className="btn btn-danger" onClick={handleDelete}>
          Excluir Vaga
        </button>
      </div>
      <JobForm initialData={job} onSubmit={handleUpdate} buttonText="Salvar Alterações" />
    </div>
  );
}
