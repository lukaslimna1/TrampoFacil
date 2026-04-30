import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { BookmarkMinus } from 'lucide-react';
import './Home.css'; /* Reutilizar estilos de listagem e vazio */

export function SavedJobs() {
  const { jobs, savedJobs } = useJobs();

  const favoriteJobs = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <div className="home-container">
      <div className="container" style={{paddingTop: '2rem'}}>
        <div className="jd-social-greeting">
           <p className="greeting-text">Sua curadoria pessoal ✨</p>
        </div>
        <h1 style={{marginBottom: '2rem', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)'}}>
          Minhas Vagas Salvas <span style={{color: '#6366F1'}}>({favoriteJobs.length})</span>
        </h1>

        {favoriteJobs.length === 0 ? (
          <div className="empty-state">
            <BookmarkMinus size={48} style={{color: '#CBD5E1', marginBottom: '16px'}} />
            <h3>Nenhuma vaga salva.</h3>
            <p>Você pode navegar pelo Feed e clicar no ícone de "salvar" em qualquer vaga para guardá-la e ler mais tarde com calma.</p>
            <Link to="/" className="btn btn-primary mt-4" style={{display: 'inline-block'}}>Voltar ao Feed</Link>
          </div>
        ) : (
          <div className="job-list-grid">
            {favoriteJobs.map(job => (
              <div key={job.id} style={{transform: 'scale(1)', transition: 'all 0.2s', padding: '2px'}}>
                  <JobCard job={job} isClickable={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
