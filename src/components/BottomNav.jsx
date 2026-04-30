import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, PlusSquare } from 'lucide-react';
import './BottomNav.css';

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Vagas</span>
      </Link>
      
      <Link to="/publicar" className={`nav-item nav-add ${location.pathname.includes('/publicar') ? 'active' : ''}`}>
        <PlusSquare size={24} />
        <span>Postar</span>
      </Link>
      
      <Link to="/salvos" className={`nav-item ${location.pathname === '/salvos' ? 'active' : ''}`}>
        <Bookmark size={24} />
        <span>Salvas</span>
      </Link>
    </div>
  );
}
