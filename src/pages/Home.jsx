/**
 * PÁGINA: Home (Feed de Oportunidades)
 * OBJETIVO: Ponto de entrada principal da plataforma, exibindo vagas em tempo real.
 * POR QUE: Utiliza um sistema de busca inteligente e filtragem dinâmica para 
 * conectar candidatos às melhores vagas sem a necessidade de login (Accountless).
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobCardSkeleton } from '../components/JobCardSkeleton';
import { JobDetail } from './JobDetail';
import { StoriesFilter } from '../components/StoriesFilter';
import { SearchHub } from '../components/SearchHub';
import { 
  Briefcase, Flame, Accessibility, Home as HomeIcon, Search
} from 'lucide-react';
import './Home.css';

export function Home() {
  const { jobs, isLoading, isJobHot } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStory, setActiveStory] = useState(searchParams.get('story') || 'todos');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);
  
  // Inicializar estado dos filtros a partir da URL
  const [filterParams, setFilterParams] = useState({
    searchTerm: searchParams.get('q') || '',
    locationTerm: searchParams.get('loc') || '',
    aiFilters: null,
    modality: searchParams.get('mod') || 'todos',
    level: searchParams.get('lvl') || 'todos',
    salary: searchParams.get('sal') || 'todos',
    date: searchParams.get('date') || 'todos',
    contract: searchParams.get('type') || 'todos',
    sector: searchParams.get('sec') || 'todos'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar estado com a URL sempre que mudar
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterParams.searchTerm) params.set('q', filterParams.searchTerm);
    if (filterParams.locationTerm) params.set('loc', filterParams.locationTerm);
    if (filterParams.modality !== 'todos') params.set('mod', filterParams.modality);
    if (filterParams.level !== 'todos') params.set('lvl', filterParams.level);
    if (filterParams.salary !== 'todos') params.set('sal', filterParams.salary);
    if (filterParams.date !== 'todos') params.set('date', filterParams.date);
    if (filterParams.contract !== 'todos') params.set('type', filterParams.contract);
    if (filterParams.sector !== 'todos') params.set('sec', filterParams.sector);
    if (activeStory !== 'todos') params.set('story', activeStory);
    
    setSearchParams(params, { replace: true });
  }, [filterParams, activeStory, setSearchParams]);

  const dynamicStories = useMemo(() => [
    { id: 'todos', label: 'Tudo', icon: <Briefcase size={20} /> },
    { id: 'hot', label: 'Em Alta', icon: <Flame size={20} />, isHot: true },
    { id: 'inclusao', label: 'Inclusão', icon: <Accessibility size={20} /> },
    { id: 'remoto', label: 'Remoto', icon: <HomeIcon size={20} /> }
  ], []);

  const availableSectors = useMemo(() => {
    if (!jobs) return [];
    return Array.from(new Set(jobs.map(j => j.setor).filter(Boolean))).slice(0, 8);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    const { 
      searchTerm, locationTerm, aiFilters, modality, 
      level, salary, date, contract, sector 
    } = filterParams;

    const filtered = jobs.filter(job => {
      // 1. Busca básica
      const baseMatch = (job.titulo + job.empresa + (job.descricao || '')).toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = job.cidade.toLowerCase().includes(locationTerm.toLowerCase());
      
      // 2. Filtros de Stories
      let storyMatch = true;
      if (activeStory === 'remoto') storyMatch = job.modalidade_trabalho === 'Remoto';
      else if (activeStory === 'inclusao') storyMatch = Boolean(job.pcd || job.exclusiva_pcd || Object.values(job.afirmativa || {}).some(Boolean));
      else if (activeStory === 'hot') storyMatch = isJobHot(job);

      // 3. Filtros Manuais (Avançados)
      let manualMatch = true;
      if (modality !== 'todos') manualMatch = manualMatch && job.modalidade_trabalho === modality;
      if (level !== 'todos') manualMatch = manualMatch && job.nivel === level;
      if (contract !== 'todos') manualMatch = manualMatch && job.tipo_contrato === contract;
      if (sector !== 'todos') manualMatch = manualMatch && job.setor === sector;
      
      if (salary !== 'todos') {
        const val = parseInt(String(job.salario || '0').replace(/[^\d]/g, '')) || 0;
        if (salary === 'baixo') manualMatch = manualMatch && val < 3000;
        else if (salary === 'medio') manualMatch = manualMatch && val >= 3000 && val <= 7000;
        else if (salary === 'alto') manualMatch = manualMatch && val > 7000;
        else if (salary === 'combinar') manualMatch = manualMatch && (val === 0 || String(job.salario).toLowerCase().includes('combinar'));
      }

      if (date !== 'todos') {
        const created = new Date(job.criado_em);
        const now = new Date();
        const diffHours = (now - created) / (1000 * 60 * 60);
        if (date === '24h') manualMatch = manualMatch && diffHours <= 24;
        else if (date === '3d') manualMatch = manualMatch && diffHours <= 72;
        else if (date === '7d') manualMatch = manualMatch && diffHours <= 168;
      }

      // 4. Filtros Inteligentes (AI) - Atuam como reforço
      let aiMatch = true;
      if (aiFilters) {
        if (aiFilters.cargo) {
          aiMatch = aiMatch && (job.titulo.toLowerCase().includes(aiFilters.cargo.toLowerCase()) || 
                               job.descricao?.toLowerCase().includes(aiFilters.cargo.toLowerCase()));
        }
        if (aiFilters.periodo) {
          const desc = (job.descricao || '').toLowerCase();
          if (aiFilters.periodo === 'noite') {
             aiMatch = aiMatch && (desc.includes('noite') || desc.includes('noturno') || desc.includes('18:00') || desc.includes('22:00'));
          }
        }
      }

      return baseMatch && locationMatch && storyMatch && manualMatch && aiMatch;
    });

    return [...filtered].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      if (a.is_urgent && !b.is_urgent) return -1;
      if (!a.is_urgent && b.is_urgent) return 1;
      return new Date(b.criado_em) - new Date(a.criado_em);
    });
  }, [jobs, activeStory, isJobHot, filterParams]);

  const handleJobClick = (jobId) => {
    if (isDesktop) {
      setSelectedJobId(selectedJobId === jobId ? null : jobId);
    } else {
      navigate(`/vaga/${jobId}`);
    }
  };

  return (
    <div className="home-container">
      <section className="jd-home-hero-premium">
         <div className="tech-glow-orb"></div>
         
         <div className="container hero-content-top">
            <div className="jd-social-greeting-v2">
               <h1 className="hero-title-main">Sua próxima <span className="text-gradient">vaga de alta</span> performance.</h1>
               <p className="hero-subtitle">Chega de currículo no buraco negro. Aqui é direto ao ponto, 100% grátis e sem enrolação.</p>
            </div>

            <SearchHub 
              onFilterChange={(newParams) => setFilterParams(prev => ({ ...prev, ...newParams }))}
              availableSectors={availableSectors}
              initialValues={filterParams}
            />
         </div>
      </section>

      <div className="container stories-wrapper">
        <StoriesFilter 
          stories={dynamicStories} 
          activeFilter={activeStory} 
          onFilterSelect={setActiveStory} 
        />
      </div>

      <div className="container">
        <div className={`home-feed-layout ${selectedJobId && isDesktop ? 'split-active' : ''}`}>
          <div className="home-job-list" style={{ flex: selectedJobId && isDesktop ? '0 0 500px' : '1 1 100%' }}>
            <h2 className="results-count">
              {isLoading ? 'Buscando vagas...' : `${filteredJobs.length} vagas encontradas`}
              {activeStory !== 'todos' && <span className="active-filter-badge">Filtrado por: {activeStory}</span>}
            </h2>
            
            {isLoading ? (
               <div className="job-list-grid">
                  {[1, 2, 3].map(i => <JobCardSkeleton key={i} />)}
               </div>
            ) : (
              <div className="job-list-grid">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div 
                      key={job.id} 
                      className={`job-card-wrapper ${selectedJobId === job.id ? 'is-selected' : ''}`}
                      onClick={() => handleJobClick(job.id)}
                    >
                      <JobCard job={job} isSelected={selectedJobId === job.id} />
                    </div>
                  ))
                ) : (
                  <div className="no-results-premium">
                    <Search size={48} opacity={0.2} />
                    <h3>Nenhuma vaga encontrada</h3>
                    <p>Tente ajustar seus filtros ou sua busca inteligente.</p>
                    <button className="btn-secondary" onClick={() => setFilterParams({
                      searchTerm: '', locationTerm: '', aiFilters: null, modality: 'todos',
                      level: 'todos', salary: 'todos', date: 'todos', contract: 'todos', sector: 'todos'
                    })}>Ver todas as vagas</button>
                  </div>
                )}
              </div>
            )}
          </div>

            {selectedJobId && isDesktop ? (
              <div className="home-job-preview">
                <div className="preview-sticky-container">
                  <JobDetail key={selectedJobId} inlineJobId={selectedJobId} />
                </div>
              </div>
            ) : null}
        </div>
      </div>
    </div>
  );
}
