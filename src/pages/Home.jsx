import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobCardSkeleton } from '../components/JobCardSkeleton';
import { JobDetail } from './JobDetail';
import { StoriesFilter } from '../components/StoriesFilter';
import { Search, MapPin, Briefcase, Flame, Accessibility, Home as HomeIcon, Zap, Loader2 } from 'lucide-react';
import './Home.css';

export function Home() {
  const { jobs, isLoading, isJobHot } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeStory, setActiveStory] = useState('todos');
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dynamicStories = useMemo(() => [
    { id: 'todos', label: 'Tudo', icon: <Briefcase size={20} /> },
    { id: 'hot', label: 'Em Alta', icon: <Flame size={20} />, isHot: true },
    { id: 'inclusao', label: 'Inclusão', icon: <Accessibility size={20} /> },
    { id: 'remoto', label: 'Remoto', icon: <HomeIcon size={20} /> }
  ], []);

  useEffect(() => {
    if (jobs) {
      const filtered = jobs.filter(job => {
        const matchSearch = (job.titulo + job.empresa).toLowerCase().includes(searchTerm.toLowerCase());
        const matchLocation = job.cidade.toLowerCase().includes(locationTerm.toLowerCase());
        
        let matchStory = true;
        if (activeStory === 'remoto') matchStory = job.modalidade_trabalho === 'Remoto';
        else if (activeStory === 'inclusao') matchStory = Boolean(job.pcd || job.exclusiva_pcd || Object.values(job.afirmativa || {}).some(Boolean));
        else if (activeStory === 'hot') matchStory = isJobHot(job);

        return matchSearch && matchLocation && matchStory;
      });
      const sorted = [...filtered].sort((a, b) => {
        // 1. VIP (Destaque) primeiro
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        
        // 2. Urgentes em segundo
        if (a.is_urgent && !b.is_urgent) return -1;
        if (!a.is_urgent && b.is_urgent) return 1;
        
        // 3. Mais recentes por último
        return new Date(b.criado_em) - new Date(a.criado_em);
      });
      
      setFilteredJobs(sorted);
    }
  }, [jobs, searchTerm, locationTerm, activeStory, isJobHot]);

  const handleJobClick = (jobId) => {
    if (isDesktop) {
      setSelectedJobId(selectedJobId === jobId ? null : jobId);
    } else {
      navigate(`/vaga/${jobId}`);
    }
  };


  return (
    <div className="home-container">
      {/* Hero Full Width */}
      <section className="jd-home-hero-premium">
         {/* Animated Tech Orbs */}
         <div className="tech-glow-orb"></div>
         
         <div className="container hero-content-top">
            <div className="jd-social-greeting-v2">
               <h1 className="hero-title-main">Sua próxima <span className="text-gradient">vaga de alta</span> performance.</h1>
               <p className="hero-subtitle">Chega de currículo no buraco negro. Aqui é direto ao ponto, 100% grátis e sem enrolação.</p>
            </div>

            <div className="search-container-premium">
               <div className="search-glass-box">
                 <div className="search-input-field">
                   <div className="si-icon"><Search size={22} /></div>
                   <div className="si-content">
                     <label>O que busca?</label>
                     <input 
                       type="text" 
                       placeholder="Cargo ou empresa..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                   </div>
                 </div>
                 
                 <div className="search-field-divider"></div>

                 <div className="search-input-field">
                   <div className="si-icon"><MapPin size={22} /></div>
                   <div className="si-content">
                     <label>Onde?</label>
                     <input 
                       type="text" 
                       placeholder="Cidade ou Remoto" 
                       value={locationTerm}
                       onChange={(e) => setLocationTerm(e.target.value)}
                     />
                   </div>
                 </div>

                 <button className="btn-search-hero">
                   <Zap size={20} fill="currentColor" />
                   <span>Buscar</span>
                 </button>
               </div>
            </div>
         </div>
      </section>

      <div className="container">
        <StoriesFilter stories={dynamicStories} activeFilter={activeStory} onFilterSelect={(id) => {
          setIsFiltering(true);
          setActiveStory(id);
          setTimeout(() => setIsFiltering(false), 300);
        }} />

        <div className={`home-feed-layout ${selectedJobId && isDesktop ? 'split-active' : ''}`}>
          <div className="home-job-list" style={{ flex: selectedJobId && isDesktop ? '0 0 40%' : '1 1 100%' }}>
            <h2 className="results-count">
              {isLoading || isFiltering ? 'Atualizando...' : `${filteredJobs.length} vagas encontradas`}
            </h2>
            
            {(isLoading || isFiltering) ? (
               <div className="job-list-grid">
                  {[1, 2, 3].map(i => <JobCardSkeleton key={i} />)}
               </div>
            ) : (
              <div className="job-list-grid">
                {filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    className={`job-card-wrapper ${selectedJobId === job.id ? 'is-selected' : ''}`}
                    onClick={() => handleJobClick(job.id)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedJobId === job.id ? '2px solid var(--primary-color)' : '2px solid transparent',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease',
                      padding: '2px'
                    }}
                  >
                    <JobCard job={job} isSelected={selectedJobId === job.id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedJobId && isDesktop && (
            <aside className="home-job-preview">
               <div className="preview-sticky-container">
                  <JobDetail inlineJobId={selectedJobId} />
               </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
