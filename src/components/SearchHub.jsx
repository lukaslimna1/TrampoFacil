import React, { useState, useCallback } from 'react';
import { 
  Search, MapPin, Briefcase, Filter, Zap, Sparkles, X, Clock, ShieldCheck, TrendingUp, Home as HomeIcon
} from 'lucide-react';
import { aiService } from '../services/aiService';
import './SearchHub.css';

export function SearchHub({ 
  onFilterChange, 
  initialValues = {},
  availableSectors = []
}) {
  // Estados Locais (UI e Valores)
  const [searchTerm, setSearchTerm] = useState(initialValues.searchTerm || '');
  const [locationTerm, setLocationTerm] = useState(initialValues.locationTerm || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFilters, setAiFilters] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Filtros Manuais
  const [filters, setFilters] = useState({
    modality: initialValues.modality || 'todos',
    level: initialValues.level || 'todos',
    salary: initialValues.salary || 'todos',
    date: initialValues.date || 'todos',
    contract: initialValues.contract || 'todos',
    sector: initialValues.sector || 'todos'
  });

  // Notificar pai sobre mudanças
  const notifyChange = useCallback((newValues) => {
    onFilterChange({
      searchTerm,
      locationTerm,
      aiFilters,
      ...filters,
      ...newValues
    });
  }, [searchTerm, locationTerm, aiFilters, filters, onFilterChange]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setAiFilters(null);
      notifyChange({ aiFilters: null });
      return;
    }

    setIsAnalyzing(true);
    try {
      const parsed = await aiService.parseSearchQuery(searchTerm);
      if (parsed) {
        setAiFilters(parsed);
        let newLocation = locationTerm;
        if (parsed.cidade && !locationTerm) {
          newLocation = parsed.cidade;
          setLocationTerm(newLocation);
        }
        
        const newFilters = { ...filters };
        if (parsed.modalidade) newFilters.modality = parsed.modalidade;
        if (parsed.nivel) newFilters.level = parsed.nivel;
        
        setFilters(newFilters);
        onFilterChange({
          searchTerm,
          locationTerm: newLocation,
          aiFilters: parsed,
          ...newFilters
        });
      }
    } catch (error) {
      console.error("Erro na busca inteligente:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    notifyChange({ ...newFilters });
  };

  const clearAll = () => {
    setSearchTerm('');
    setLocationTerm('');
    setAiFilters(null);
    const resetFilters = {
      modality: 'todos',
      level: 'todos',
      salary: 'todos',
      date: 'todos',
      contract: 'todos',
      sector: 'todos'
    };
    setFilters(resetFilters);
    onFilterChange({
      searchTerm: '',
      locationTerm: '',
      aiFilters: null,
      ...resetFilters
    });
  };

  return (
    <div className="search-hub-wrapper">
      <div className="search-container-premium">
        <div className="search-glass-box">
          <div className="search-input-field">
            <div className="si-icon"><Search size={22} /></div>
            <div className="si-content">
              <label>O que busca?</label>
              <input 
                type="text" 
                placeholder="Ex: Garçom a noite ou Dev Remoto" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onFilterChange({ searchTerm: e.target.value, locationTerm, aiFilters, ...filters });
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            {searchTerm && (
              <button className="clear-btn" onClick={() => {
                setSearchTerm('');
                onFilterChange({ searchTerm: '', locationTerm, aiFilters, ...filters });
              }}><X size={16} /></button>
            )}
          </div>
          
          <div className="search-field-divider"></div>

          <div className="search-input-field">
            <div className="si-icon"><MapPin size={22} /></div>
            <div className="si-content">
              <label>Onde?</label>
              <input 
                type="text" 
                placeholder="Cidade ou Remoto" 
                value={locationTerm}
                onChange={(e) => {
                  setLocationTerm(e.target.value);
                  onFilterChange({ searchTerm, locationTerm: e.target.value, aiFilters, ...filters });
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <button 
            className={`btn-search-hero ${isAnalyzing ? 'is-loading' : ''}`}
            onClick={handleSearch}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <div className="loader-ai"></div>
            ) : (
              <>
                <Zap size={20} fill="currentColor" />
                <span>{searchTerm.length > 15 ? 'Analisar' : 'Buscar'}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Intelligence Badge */}
        {aiFilters && (
          <div className="ai-intelligence-tag">
            <Sparkles size={14} />
            <span>Motor IA: Interpretamos sua busca como <strong>{aiFilters.cargo || 'vaga'}</strong> 
            {aiFilters.periodo && ` no período ${aiFilters.periodo}`}
            {aiFilters.modalidade && ` em modo ${aiFilters.modalidade}`}</span>
            <button onClick={() => {
              setAiFilters(null);
              notifyChange({ aiFilters: null });
            }}><X size={14} /></button>
          </div>
        )}

        <div className="search-footer-options">
          <button className={`btn-advanced ${showAdvanced ? 'active' : ''}`} onClick={() => setShowAdvanced(!showAdvanced)}>
            <Filter size={16} /> {showAdvanced ? 'Ocultar Filtros' : 'Filtros Avançados'}
          </button>
          {(searchTerm || locationTerm || aiFilters || Object.values(filters).some(v => v !== 'todos')) && (
            <button className="btn-clear-all" onClick={clearAll}>Limpar tudo</button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="advanced-filters-panel glass-morph">
          <div className="filters-grid-premium">
            <div className="filter-group">
              <h4><HomeIcon size={16} /> Modalidade</h4>
              <div className="filter-chips">
                {['Todos', 'Presencial', 'Híbrido', 'Remoto'].map(m => (
                  <button 
                    key={m} 
                    className={`chip ${filters.modality === (m === 'Todos' ? 'todos' : m) ? 'active' : ''}`}
                    onClick={() => updateFilter('modality', m === 'Todos' ? 'todos' : m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4><Briefcase size={16} /> Nível</h4>
              <div className="filter-chips">
                {['Todos', 'Estágio', 'Júnior', 'Pleno', 'Sênior'].map(n => (
                  <button 
                    key={n} 
                    className={`chip ${filters.level === (n === 'Todos' ? 'todos' : n) ? 'active' : ''}`}
                    onClick={() => updateFilter('level', n === 'Todos' ? 'todos' : n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4><ShieldCheck size={16} /> Contrato</h4>
              <div className="filter-chips">
                {['Todos', 'CLT', 'PJ', 'Freelance', 'Temporário'].map(c => (
                  <button 
                    key={c} 
                    className={`chip ${filters.contract === (c === 'Todos' ? 'todos' : c) ? 'active' : ''}`}
                    onClick={() => updateFilter('contract', c === 'Todos' ? 'todos' : c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4><TrendingUp size={16} /> Setor</h4>
              <div className="filter-chips">
                <button 
                  className={`chip ${filters.sector === 'todos' ? 'active' : ''}`}
                  onClick={() => updateFilter('sector', 'todos')}
                >
                  Todos
                </button>
                {availableSectors.map(s => (
                  <button 
                    key={s} 
                    className={`chip ${filters.sector === s ? 'active' : ''}`}
                    onClick={() => updateFilter('sector', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4><Sparkles size={16} /> Salário</h4>
              <div className="filter-chips">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'baixo', label: 'Até 3k' },
                  { id: 'medio', label: '3k - 7k' },
                  { id: 'alto', label: '7k+' },
                  { id: 'combinar', label: 'A combinar' }
                ].map(s => (
                  <button 
                    key={s.id} 
                    className={`chip ${filters.salary === s.id ? 'active' : ''}`}
                    onClick={() => updateFilter('salary', s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4><Clock size={16} /> Data</h4>
              <div className="filter-chips">
                {[
                  { id: 'todos', label: 'Qualquer data' },
                  { id: '24h', label: 'Últimas 24h' },
                  { id: '3d', label: 'Últimos 3 dias' },
                  { id: '7d', label: 'Última semana' }
                ].map(d => (
                  <button 
                    key={d.id} 
                    className={`chip ${filters.date === d.id ? 'active' : ''}`}
                    onClick={() => updateFilter('date', d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
