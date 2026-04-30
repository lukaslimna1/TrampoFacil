import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import trampoAI from '../utils/trampoAI';
import './AIGreeting.css';

export function AIGreeting({ variant = 'global' }) {
  const location = useLocation();
  const [greeting, setGreeting] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const lastVisit = localStorage.getItem('trampo_last_visit');
    const isFirstVisitToday = lastVisit !== todayStr;
    
    if (isFirstVisitToday) {
      localStorage.setItem('trampo_last_visit', todayStr);
    }

    const message = trampoAI.getGreeting({
      pathname: location.pathname,
      isFirstVisitToday
    });

    setGreeting(message);
    setIsTyping(true);
    
    // Simulate typewriter effect
    const timer = setTimeout(() => setIsTyping(false), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
