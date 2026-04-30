/**
 * TRAMPO AI - Sistema de Inteligência de Mercado & Otimização de Vagas
 * v3.0 - Arquitetura Modular
 */

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
      label: 'Salário a Combinar', 
      color: '#94A3B8', 
      insight: '💡 Definir um salário pode atrair 40% mais candidatos de qualidade.',
      status: 'NEUTRAL'
    };
  }
  
  const matches = String(salarioStr).match(/[\d.,]+/);
  if (!matches) return { score: 15, label: 'Salário Informado', color: '#64748B', status: 'INFO' };
  
  let valueStr = matches[0].replace(/\./g, '').replace(',', '.');
  const value = parseFloat(valueStr);
  if (isNaN(value) || value < 500) return { score: 15, label: 'Informado', color: '#64748B', status: 'INFO' };

  let marketBase = MARKET_BENCHMARKS.DEFAULT.base;
  const t = (titulo || '').toLowerCase();
  const n = (nivel || '').toLowerCase();

  // Detecção de categoria por palavra-chave
  if (MARKET_BENCHMARKS.TECH.keywords.some(k => t.includes(k))) marketBase = MARKET_BENCHMARKS.TECH.base;
  else if (MARKET_BENCHMARKS.MANAGEMENT.keywords.some(k => t.includes(k))) marketBase = MARKET_BENCHMARKS.MANAGEMENT.base;
  else if (MARKET_BENCHMARKS.DESIGN.keywords.some(k => t.includes(k))) marketBase = MARKET_BENCHMARKS.DESIGN.base;
  else if (MARKET_BENCHMARKS.OPERATIONAL.keywords.some(k => t.includes(k))) marketBase = MARKET_BENCHMARKS.OPERATIONAL.base;

  // Ajuste por nível
  if (n.includes('sênior') || n.includes('senior')) marketBase *= 1.9;
  else if (n.includes('pleno')) marketBase *= 1.35;
  else if (n.includes('júnior') || n.includes('junior') || n.includes('estágio')) marketBase *= 0.75;

  const ratio = value / marketBase;
  
  if (ratio >= 1.25) return { score: 30, label: 'Salário Ultra Atrativo', color: '#10B981', insight: '🚀 Oferta excepcional! Candidatos tendem a priorizar esta vaga.', status: 'EXCELLENT' };
  if (ratio >= 0.9) return { score: 20, label: 'Dentro da Média', color: '#3B82F6', insight: '✅ Salário competitivo para a região e cargo.', status: 'GOOD' };
  return { score: 5, label: 'Abaixo da Média', color: '#F59E0B', insight: '⚠️ Alerta: Salário abaixo da média de mercado. Aumente os benefícios para compensar.', status: 'WARNING' };
};

/**
 * Módulo Principal Trampo AI
 */
const trampoAI = {
  /**
   * Visão do Recrutador: Foco em Otimização e Performance da Vaga
   */
  analyzeForRecruiter: (job) => {
    let score = 20;
    const insights = [];
    const checklist = [];

    // 1. Título e Estrutura
    if (job.titulo?.length > 8) score += 10; else checklist.push('Definir um título mais descritivo (+8 caracteres)');
    if (job.nivel && job.nivel !== 'Não informado') score += 10; else checklist.push('Informar o nível da vaga (Jr, Pl, Sr)');

    // 2. Análise de Mercado
    const market = evaluateMarketSalary(job.titulo, job.nivel, job.salario);
    score += market.score;
    if (market.status === 'WARNING') checklist.push('Revisar proposta salarial ou compensar com benefícios');

    // 3. Densidade de Informação
    if (job.descricao?.length > 200) score += 15; else checklist.push('Expandir a descrição da vaga (mínimo 200 caracteres)');
    if (job.beneficios_lista?.length >= 4) score += 15; else checklist.push('Adicionar pelo menos 4 benefícios atrativos');
    
    // 4. Diversidade e Inclusão (Recurso Novo)
    const hasDiversity = job.pcd || Object.values(job.afirmativa || {}).some(v => v === true);
    if (hasDiversity) {
      score += 10;
      insights.push('✨ Selo de Diversidade Ativo: Isso aumenta o alcance da vaga em 35%.');
    } else {
      checklist.push('Considerar tags de ações afirmativas para maior alcance');
    }

    // 5. Visibilidade
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
   * Sistema de Saudações Dinâmicas e Humanizadas
   */
  getGreeting: (context = {}) => {
    const hour = new Date().getHours();
    const { pathname = '/', isFirstVisitToday = false } = context;

    const morning = hour >= 5 && hour < 12;
    const afternoon = hour >= 12 && hour < 18;
    const night = hour >= 18 || hour < 5;

    // 1. Specific Page Contexts (High Priority)
    if (pathname === '/publicar') {
      return "Olá, recrutador! Pronto para encontrar o talento ideal hoje? 🚀";
    }
    
    if (pathname === '/sobre') {
      return "Descubra como estamos revolucionando o recrutamento com tecnologia e humanidade. 💡";
    }
    
    if (pathname === '/sucesso') {
      return "Parabéns! Sua vaga foi publicada. Que tal aproveitar para revisar suas outras oportunidades? 🎉";
    }

    // 2. Returning User Experience
    if (!isFirstVisitToday && Math.random() > 0.4) {
      const returns = [
        'Que bom te ver de novo por aqui! 🎉',
        'De volta à busca? Vamos encontrar algo incrível! 💪',
        'Foco total! Novas vagas acabaram de chegar. 🔥',
        'Sentimos sua falta! Próximo passo na carreira? 🚀'
      ];
      return returns[Math.floor(Math.random() * returns.length)];
    }

    // 3. Random Career/Market Tips (30% chance)
    if (Math.random() > 0.7) {
      const tips = [
        '💡 Dica: Vagas com salário visível recebem 40% mais cliques.',
        '💡 Dica: Manter seu LinkedIn atualizado ajuda no match da IA.',
        '💡 Dica: Ter um portfólio no GitHub é essencial para vagas Tech.',
        '💡 Dica: O mercado de Trabalho Remoto cresceu 20% este mês.',
        '💡 Dica: Personalize sua mensagem ao falar com recrutadores.'
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // 4. Default Time-Based Greetings
    if (morning) return 'Bom dia! Café na mão e foco na vaga? ☕';
    if (afternoon) return 'Boa tarde! Que tal um "up" na carreira hoje? ⚡';
    if (hour < 5) return 'Madrugando na busca? A vaga dos sonhos não espera! 🦉';
    return 'Boa noite! Já deu uma olhada nas novidades de hoje? 🌙';
  }
};

// Exportando como módulo unificado e também as funções individuais para retrocompatibilidade
export const calculateJobScore = (job) => {
  const result = trampoAI.analyzeForRecruiter(job);
  return {
    total: result.total,
    salaryEval: result.market,
    insights: result.checklist // Usamos o checklist como insights no Form
  };
};

export default trampoAI;
