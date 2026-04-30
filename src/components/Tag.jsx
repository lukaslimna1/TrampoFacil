/**
 * COMPONENTE: Tag
 * OBJETIVO: Badge visual para exibir metadados de vagas (ex: Modalidade, Nível).
 * POR QUE: Padroniza a exibição de tags em toda a plataforma, suportando 
 * diferentes variantes de estilo, ícones e emojis.
 */
import './Tag.css';

export function Tag({ label, variant = 'default', icon: Icon, emoji }) {
  return (
    <span className={`tag tag-${variant}`}>
      {emoji && <span className="tag-icon">{emoji}</span>}
      {Icon && !emoji && <span className="tag-icon"><Icon size={14} /></span>}
      {label}
    </span>
  );
}
