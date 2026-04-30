import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import trampoAI from '../utils/trampoAI';
import './AIGreeting.css';

/**
 * AIGreeting v4.0 - Sincronizado com Motor Gemini 2024-2027
 */
export function AIGreeting({ variant = 'global' }) {
  const location = useLocation();
  const [greeting, setGreeting] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    async function fetchGreeting() {
      setIsTyping(true);
      
      const context = {
        pathname: location.pathname
      };

      try {
        // Agora o getGreeting do trampoAI já gerencia a chamada ao Gemini e o fallback
        // E ele é assíncrono, então precisamos do await
        const message = await trampoAI.getGreeting(context);
        setGreeting(message);
      } catch (err) {
        console.error("Erro ao carregar saudação da IA:", err);
        setGreeting("Conectando ao motor de inteligência... 🚀");
      } finally {
        // Pequeno delay para o efeito de "IA pensando" ser visível e premium
        setTimeout(() => setIsTyping(false), 800);
      }
    }

    fetchGreeting();
  }, [location.pathname]); // Dispara toda vez que a URL mudar

  return (
    <div className={`ai-greeting-v3 ${variant}`}>
      <div className="greeting-badge-v3">
        <span className="pulse-dot-v3"></span>
        <span className="ai-label-v3">TRAMPO IA</span>
      </div>
      <div className="greeting-content-v3">
        <p className={`greeting-text-v3 ${isTyping ? 'typing' : ''}`}>
          {greeting}
        </p>
      </div>
    </div>
  );
}
