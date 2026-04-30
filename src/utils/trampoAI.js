/**
 * TRAMPO AI - Sistema de Inteligência de Mercado & Otimização de Vagas
 * v4.1 - Motor de Greetings Híbrido (Gemini) + Scores Locais
 */
import { aiService } from '../services/aiService';

const MARKET_BENCHMARKS = {
  TECH: { base: 5000, keywords: ['desenvolvedor', 'engenheiro', 'analista', 'tech', 'programador', 'ti', 'software', 'dados'] },
  MANAGEMENT: { base: 9000, keywords: ['gerente', 'diretor', 'head', 'lider', 'coordenador', 'manager'] },
  OPERATIONAL: { base: 1800, keywords: ['atendimento', 'auxiliar', 'assistente', 'recepção', 'operacional', 'vendedor'] },
  DESIGN: { base: 3500, keywords: ['designer', 'ux', 'ui', 'criativo', 'art', 'ilustrador'] },
  DEFAULT: { base: 2500 }
};

/**
 * Analisa o salário em relação ao mercado
 */
const evaluateMarketSalary = (titulo, nivel, salarioStr) => {
  if (!salarioStr || String(salarioStr).toLowerCase().includes('combinar')) {
    return { 
      score: 10, 
      label: 'A Combinar', 
      color: '#94A3B8', 
      insight: '💡 Dica: Vagas com salário visível atraem 40% mais candidatos qualificados.',
      status: 'NEUTRAL'
    };
  }

  const cleanSalary = String(salarioStr).replace(/[^\d]/g, '');
  const value = parseInt(cleanSalary);
  
  if (isNaN(value)) return { score: 0, label: 'Valor Inválido', color: '#EF4444', status: 'ERROR' };

  let marketBase = MARKET_BENCHMARKS.DEFAULT.base;
  const titleLower = titulo?.toLowerCase() || '';

  if (MARKET_BENCHMARKS.TECH.keywords.some(k => titleLower.includes(k))) marketBase = MARKET_BENCHMARKS.TECH.base;
  else if (MARKET_BENCHMARKS.MANAGEMENT.keywords.some(k => titleLower.includes(k))) marketBase = MARKET_BENCHMARKS.MANAGEMENT.base;
  else if (MARKET_BENCHMARKS.DESIGN.keywords.some(k => titleLower.includes(k))) marketBase = MARKET_BENCHMARKS.DESIGN.base;
  else if (MARKET_BENCHMARKS.OPERATIONAL.keywords.some(k => titleLower.includes(k))) marketBase = MARKET_BENCHMARKS.OPERATIONAL.base;

  if (nivel?.includes('Sênior') || nivel?.includes('Sr')) marketBase *= 1.6;
  else if (nivel?.includes('Pleno') || nivel?.includes('Pl')) marketBase *= 1.3;

  const ratio = value / marketBase;
  
  if (ratio >= 1.25) return { score: 30, label: 'Salário Ultra Atrativo', color: '#10B981', insight: '🚀 Oferta excepcional! Candidatos tendem a priorizar esta vaga.', status: 'EXCELLENT' };
  if (ratio >= 0.9) return { score: 20, label: 'Dentro da Média', color: '#3B82F6', insight: '✅ Salário competitivo para a região e cargo.', status: 'GOOD' };
  return { score: 5, label: 'Abaixo da Média', color: '#F59E0B', insight: '⚠️ Alerta: Salário abaixo da média de mercado. Aumente os benefícios para compensar.', status: 'WARNING' };
};

const trampoAI = {
  /**
   * Visão do Recrutador: Foco em Otimização e Performance da Vaga (100% LOCAL)
   */
  analyzeForRecruiter: (job) => {
    let score = 20;
    const insights = [];
    const checklist = [];

    if (job.titulo?.length > 8) score += 10; else checklist.push('Definir um título mais descritivo (+8 caracteres)');
    if (job.nivel && job.nivel !== 'Não informado') score += 10; else checklist.push('Informar o nível da vaga (Jr, Pl, Sr)');

    const market = evaluateMarketSalary(job.titulo, job.nivel, job.salario);
    score += market.score;
    if (market.status === 'WARNING') checklist.push('Revisar proposta salarial ou compensar com benefícios');

    if (job.descricao?.length > 200) score += 15; else checklist.push('Expandir a descrição da vaga (mínimo 200 caracteres)');
    if (job.beneficios_lista?.length >= 4) score += 15; else checklist.push('Adicionar pelo menos 4 benefícios atrativos');
    
    const hasDiversity = job.pcd || Object.values(job.afirmativa || {}).some(v => v === true);
    if (hasDiversity) {
      score += 10;
      insights.push('✨ Selo de Diversidade Ativo: Isso aumenta o alcance da vaga em 35%.');
    } else {
      checklist.push('Considerar tags de ações afirmativas para maior alcance');
    }

    if (job.is_featured) score += 10;
    if (job.is_urgent) score += 10;

    return {
      total: Math.min(score, 100),
      market,
      insights: insights.concat(market.insight ? [market.insight] : []),
      checklist: checklist.slice(0, 4),
      performance: score > 85 ? 'ELITE' : score > 65 ? 'ALTA' : 'MÉDIA'
    };
  },

  /**
   * Visão do Candidato: Foco em Atratividade e "Por que aplicar?"
   */
  analyzeForCandidate: (job) => {
    const market = evaluateMarketSalary(job.titulo, job.nivel, job.salario);
    const score = trampoAI.analyzeForRecruiter(job).total;
    
    const whyApply = [];
    if (market.status === 'EXCELLENT') whyApply.push('Salário acima do mercado');
    if (job.beneficios_lista?.length > 5) whyApply.push('Pacote de benefícios robusto');
    if (job.is_urgent) whyApply.push('Contratação imediata');
    if (job.modalidade_trabalho === 'Remoto') whyApply.push('Flexibilidade total (100% Remoto)');

    return {
      attractivenessScore: score,
      marketLabel: market.label,
      marketColor: market.color,
      whyApply: whyApply.slice(0, 3)
    };
  },

  /**
   * Sistema de Saudações Dinâmicas e Humanizadas (Centralizado com Gemini)
   */
  getGreeting: async (context = {}) => {
    const { pathname = '/' } = context;
    try {
      const aiGreeting = await aiService.generateGreeting(pathname);
      if (aiGreeting) return aiGreeting;
    } catch {
      console.warn("Trampo AI: Gemini falhou, usando fallback. Verifique sua API Key.");
    }

    // --- FALLBACK INTELIGENTE (Se a IA falhar) ---
    const isRecruiter = pathname.includes('editar') || pathname.includes('publicar');
    
    if (isRecruiter) {
      if (pathname.includes('editar')) return "Hora de lapidar essa vaga e atrair os melhores. 💎";
      return "Foco na gestão: os melhores times se constroem agora. 🚀";
    }

    // Fallbacks específicos para evitar repetição
    if (pathname === '/sobre') return "Conheça nossa visão: estamos reinventando o trampo. 🚀";
    if (pathname === '/vagas') return "Explore as melhores oportunidades tech do mercado. ⚡";
    if (pathname.startsWith('/vaga/')) return "Analisando esse job... Parece um ótimo match! 🔍";
    
    return "Bora encontrar o match perfeito para sua carreira? ✨";
  }
};

export const calculateJobScore = (job) => {
  const result = trampoAI.analyzeForRecruiter(job);
  return {
    total: result.total,
    salaryEval: result.market,
    insights: result.checklist
  };
};

export default trampoAI;
