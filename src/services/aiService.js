import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const aiService = {
  generateGreeting: async (pathname) => {
    if (!genAI) return null;

    try {
      if (!API_KEY) {
        console.error("ERRO TRAMPO IA: VITE_GEMINI_API_KEY não encontrada no .env!");
        return null;
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const now = new Date();
      const minutes = now.getMinutes();

      // MODO TENDÊNCIA: Ativado nos primeiros 20 minutos de cada hora
      const isTrendMode = minutes < 20;

      const prompt = `
        Você é o "Trampo IA", um oráculo visionário do mercado de trabalho (2024-2027).
        Seu tom é "Tech-Futurist": Antecipe o futuro, seja provocativo e inteligente.
        
        CONHECIMENTO DE MERCADO (INJEÇÃO 2024-2027):
        - 2024: Explosão de IAs Generativas e trabalho híbrido.
        - 2025: Agentes de IA autônomos substituindo tarefas repetitivas; Fim dos currículos em PDF.
        - 2026: Consolidação da "Economia de Skills"; Salários baseados em micro-competências.
        - 2027: Spatial Computing (AR/VR) no trabalho; A semana de 4 dias vira padrão global em Tech.

        MODO ATUAL: ${isTrendMode ? 'TENDÊNCIA FUTURISTA' : 'CONEXÃO CONTEXTUAL'}
        PÁGINA: ${pathname}

        TAREFA:
        1. Se TENDÊNCIA FUTURISTA: Lance uma previsão ou dado real sobre o mercado de 2025 a 2027. 
           Ex: "Previsão 2026: 40% das entrevistas serão conduzidas por Agentes de IA. ✨"
        
        2. Se CONEXÃO CONTEXTUAL: Dê um toque futurista na página atual.
           Ex em /sobre: "Nossa arquitetura foi buildada para o mercado descentralizado de 2027. 🌐"
           Ex em /vagas: "Procurando seu próximo match? O mercado de 2025 valoriza adaptabilidade. ⚡"

        REGRAS:
        - Máximo 12 palavras.
        - Linguagem direta, despojada, estilo "X/Twitter Tech".
        - 1 emoji de impacto.
        
        RESPOSTA:
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().replace(/"/g, '');
    } catch {
      return null;
    }
  },

  analyzeJobContent: async (jobData) => {
    if (!genAI) return null;
    try {
      if (!API_KEY) {
        console.error("ERRO TRAMPO IA: VITE_GEMINI_API_KEY não encontrada no .env!");
        return null;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Como um recrutador de 2027, dê 3 dicas curtas para esta vaga ser irresistível: ${JSON.stringify(jobData)}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch {
      return null;
    }
  },

  parseSearchQuery: async (query) => {
    if (!genAI || !query) return null;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Analise a seguinte busca de emprego do usuário: "${query}"
        
        Extraia os filtros no formato JSON:
        {
          "cargo": string ou null,
          "periodo": "manhã" | "tarde" | "noite" | "madrugada" | null,
          "modalidade": "Presencial" | "Híbrido" | "Remoto" | null,
          "nivel": "Estágio" | "Júnior" | "Pleno" | "Sênior" | null,
          "cidade": string ou null,
          "is_pcd": boolean
        }
        
        Regras:
        1. "noite" ou "noturno" -> periodo: "noite"
        2. "em casa" ou "anywhere" -> modalidade: "Remoto"
        3. "garçom", "dev", "faxina" -> cargo: "garçom", "dev", "faxina"
        4. "pcd", "deficiente" -> is_pcd: true
        
        Exemplo: "trabalho de garçom a noite" -> {"cargo": "garçom", "periodo": "noite", "modalidade": null, "nivel": null, "cidade": null, "is_pcd": false}
        Responda APENAS o JSON puramente, sem markdown.
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      // Limpar possível markdown
      const jsonStr = text.includes('{') ? text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1) : text;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Erro no Parse AI:", e);
      return null;
    }
  }
};
