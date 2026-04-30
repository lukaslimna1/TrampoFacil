/**
 * CONTEXTO: JobContext
 * OBJETIVO: Central de gerenciamento de estado global das vagas.
 * POR QUE: Abstrai a lógica de persistência (Supabase + LocalStorage), 
 * filtragem avançada, contagem de visualizações e controle de favoritos,
 * permitindo que qualquer componente acesse e manipule os dados de vagas.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(() => {
    const stored = localStorage.getItem('trampo_saved_jobs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Carregar vagas do Supabase
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      
      const now = new Date();
      // Filtrar expiradas (opcional se o backend não filtrar)
      const validJobs = data.filter(job => !job.expira_em || new Date(job.expira_em) > now);
      setJobs(validJobs);
    } catch (error) {
      console.error("Erro ao buscar vagas no Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Carregar vagas salvas do LocalStorage
  useEffect(() => {
    const initData = async () => {
      await fetchJobs();
    };
    initData();
  }, [fetchJobs]);

  const addJob = async (jobData) => {
    try {
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const now = new Date();
      const expireDate = new Date();
      expireDate.setDate(now.getDate() + 30);

      const newJob = {
        ...jobData,
        token_edicao: token,
        criado_em: now.toISOString(),
        expira_em: expireDate.toISOString(),
        views: 0,
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select();

      if (error) throw error;
      
      setJobs(prev => [data[0], ...prev]);
      return { id: data[0].id, token };
    } catch (error) {
      console.error("Erro detalhado ao adicionar vaga:", error);
      if (error.message) {
        console.error("Mensagem de erro:", error.message);
      }
      if (error.details) {
        console.error("Detalhes:", error.details);
      }
      if (error.hint) {
        console.error("Dica:", error.hint);
      }
      throw error;
    }
  };

  const updateJob = async (token, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updatedData)
        .eq('token_edicao', token)
        .select();

      if (error) throw error;
      
      setJobs(prev => prev.map(job => job.token_edicao === token ? data[0] : job));
      return data[0];
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      throw error;
    }
  };

  const deleteJob = async (token) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('token_edicao', token);

      if (error) throw error;
      
      setJobs(prev => prev.filter(job => job.token_edicao !== token));
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
      throw error;
    }
  };

  const incrementJobViews = async (jobId) => {
    const viewedKey = `viewed_${jobId}`;
    if (localStorage.getItem(viewedKey)) return;

    try {
      // Usando rpc se disponível ou update simples
      const { error } = await supabase.rpc('increment_views', { job_id: jobId });
      
      if (error) {
        // Fallback: update manual se o RPC não existir
        const currentJob = jobs.find(j => j.id === jobId);
        if (currentJob) {
          await supabase
            .from('jobs')
            .update({ views: (currentJob.views || 0) + 1 })
            .eq('id', jobId);
        }
      }

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, views: (job.views || 0) + 1 } : job
      ));
      
      localStorage.setItem(viewedKey, 'true');
    } catch (error) {
      console.error("Erro ao incrementar views:", error);
    }
  };

  const getJobsByEmail = async (email) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, titulo, token_edicao, criado_em')
        .eq('recruiter_email', email);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar vagas por e-mail:", error);
      throw error;
    }
  };

  const getJobById = (id) => jobs.find(job => job.id === id);
  const getJobByToken = (token) => jobs.find(job => job.token_edicao === token);

  const toggleSavedJob = (jobId) => {
    const newSaved = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSaved);
    localStorage.setItem('trampo_saved_jobs', JSON.stringify(newSaved));
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  const isUrgencyActive = (job) => {
    if (!job.is_urgent) return false;
    const createdDate = new Date(job.criado_em);
    if (isNaN(createdDate.getTime())) return true;
    const daysSincePublished = (new Date() - createdDate) / (1000 * 60 * 60 * 24);
    return daysSincePublished <= 7;
  };

  const isJobHot = (job) => {
    // Vagas Premium e Urgentes são sempre "Hot"
    if (job.is_featured || isUrgencyActive(job)) return true;
    
    // Lógica de velocidade de visualizações para vagas orgânicas
    const views = job.views || 0;
    const createdDate = new Date(job.criado_em);
    if (isNaN(createdDate.getTime())) return views > 50;
    const hoursSincePublished = Math.max(1, (new Date() - createdDate) / (1000 * 60 * 60));
    const velocityScore = views / hoursSincePublished;
    return velocityScore > 1.2 || views > 80;
  };

  return (
    <JobContext.Provider value={{
      jobs,
      savedJobs,
      isLoading,
      fetchJobs,
      addJob,
      updateJob,
      deleteJob,
      getJobsByEmail,
      getJobById,
      getJobByToken,
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

// eslint-disable-next-line react-refresh/only-export-components
export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
