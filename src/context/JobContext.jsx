import { createContext, useContext, useState, useEffect } from 'react';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados no mount
  useEffect(() => {
    const loadJobs = () => {
      try {
        const storedJobs = localStorage.getItem('trampo_jobs');
        if (storedJobs) {
          const parsedJobs = JSON.parse(storedJobs);
          const now = new Date();
          const validJobs = parsedJobs.filter(job => new Date(job.expira_em) > now);
          
          if (validJobs.length !== parsedJobs.length) {
            localStorage.setItem('trampo_jobs', JSON.stringify(validJobs));
          }
          setJobs(validJobs);
        }
        
        const storedSavedJobs = localStorage.getItem('trampo_saved_jobs');
        if (storedSavedJobs) {
          setSavedJobs(JSON.parse(storedSavedJobs));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do LocalStorage:", error);
        localStorage.removeItem('trampo_jobs'); // Limpa se estiver corrompido
      }
      setIsLoading(false);
    };

    loadJobs();
  }, []);

  const saveJobs = (newJobs) => {
    localStorage.setItem('trampo_jobs', JSON.stringify(newJobs));
    setJobs(newJobs);
  };

  const addJob = (jobData) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Calcula expiração em 30 dias
    const now = new Date();
    const expireDate = new Date();
    expireDate.setDate(now.getDate() + 30);

    const newJob = {
      ...jobData,
      id,
      token_edicao: token,
      criado_em: now.toISOString(),
      expira_em: expireDate.toISOString(),
      views: 0, // Inicia zerado como pedido
    };

    const newJobs = [newJob, ...jobs];
    saveJobs(newJobs);
    
    return { id, token };
  };

  const updateJob = (token, updatedData) => {
    const newJobs = jobs.map(job => {
      if (job.token_edicao === token) {
        return { ...job, ...updatedData };
      }
      return job;
    });
    saveJobs(newJobs);
  };

  const deleteJob = (token) => {
    const newJobs = jobs.filter(job => job.token_edicao !== token);
    saveJobs(newJobs);
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === id);
  };

  const getJobByToken = (token) => {
    return jobs.find(job => job.token_edicao === token);
  };

  const searchJobs = (query, city) => {
    return jobs.filter(job => {
      const matchQuery = query 
        ? job.titulo.toLowerCase().includes(query.toLowerCase()) || 
          job.empresa.toLowerCase().includes(query.toLowerCase()) ||
          job.descricao.toLowerCase().includes(query.toLowerCase())
        : true;
      
      const matchCity = city 
        ? job.cidade.toLowerCase().includes(city.toLowerCase())
        : true;
        
      return matchQuery && matchCity;
    });
  };

  const toggleSavedJob = (jobId) => {
    let newSaved = [];
    if (savedJobs.includes(jobId)) {
      newSaved = savedJobs.filter(id => id !== jobId);
    } else {
      newSaved = [...savedJobs, jobId];
    }
    setSavedJobs(newSaved);
    localStorage.setItem('trampo_saved_jobs', JSON.stringify(newSaved));
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  // Lógica para verificar se a urgência ainda é válida (Máx 7 dias)
  const isUrgencyActive = (job) => {
    if (!job.is_urgent) return false;
    
    const createdDate = new Date(job.criado_em);
    if (isNaN(createdDate.getTime())) return true;

    const daysSincePublished = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    
    // Se passou de 7 dias, a urgência "venceu"
    return daysSincePublished <= 7;
  };

  // Lógica Unificada "Em Alta" (Trending)
  const isJobHot = (job) => {
    const activeUrgent = isUrgencyActive(job);
    if (activeUrgent) return true;
    
    // Fallback para views se a vaga for nova e estivermos usando o estado de views
    const views = job.views !== undefined ? job.views : (() => {
        let h = 0;
        for (let i = 0; i < (job.id || '').length; i++) h = (job.id || '').charCodeAt(i) + ((h << 5) - h);
        return Math.abs(h % 85) + 5;
    })();

    const createdDate = new Date(job.criado_em);
    if (isNaN(createdDate.getTime())) return views > 50;

    const hoursSincePublished = Math.max(1, (new Date() - createdDate) / (1000 * 60 * 60));
    const velocityScore = views / hoursSincePublished;

    // Critérios para SAIR do "Em Alta":
    if (hoursSincePublished > 168 && views < 300) return false;

    // Critérios para ENTRAR:
    return velocityScore > 1.2 || views > 80;
  };

  const incrementJobViews = (jobId) => {
    // 1. Verifica se este usuário já viu esta vaga nesta sessão/browser
    const viewedKey = `viewed_${jobId}`;
    if (localStorage.getItem(viewedKey)) return;

    // 2. Incrementa no estado global
    const newJobs = jobs.map(job => {
      if (job.id === jobId) {
         return { ...job, views: (job.views || 0) + 1 };
      }
      return job;
    });

    setJobs(newJobs);
    localStorage.setItem('trampo_jobs', JSON.stringify(newJobs));
    
    // 3. Marca como visto por este usuário
    localStorage.setItem(viewedKey, 'true');
  };

  return (
    <JobContext.Provider value={{
      jobs,
      savedJobs,
      isLoading,
      addJob,
      updateJob,
      deleteJob,
      getJobById,
      getJobByToken,
      searchJobs,
      toggleSavedJob,
      isJobSaved,
      incrementJobViews,
      isJobHot,
      isUrgencyActive
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
