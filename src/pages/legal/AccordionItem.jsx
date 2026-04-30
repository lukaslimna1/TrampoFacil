/**
 * COMPONENTE: AccordionItem
 * OBJETIVO: UI atomizada para itens expansíveis (estilo Dropbox/FAQ).
 * POR QUE: Centraliza a lógica de animação e estado dos accordions,
 * permitindo consistência visual em toda a plataforma.
 */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AccordionItem({ title, children, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-accordion-item ${isOpen ? 'active' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <div className="faq-title-group">
          {Icon && <Icon size={20} className="faq-icon" />}
          <span>{title}</span>
        </div>
        <ChevronDown size={20} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>
      <div className={`faq-answer ${isOpen ? 'show' : ''}`}>
        <div className="faq-answer-content">
          {children}
        </div>
      </div>
    </div>
  );
}
