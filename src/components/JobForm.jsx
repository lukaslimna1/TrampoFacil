/**
 * COMPONENTE: JobForm
 * OBJETIVO: Formulário centralizado para criação e edição de vagas de emprego.
 * POR QUE: Este componente é o motor de entrada de dados da plataforma, integrando
 * validações, máscaras de UI (como salário), seleção de localização via API do IBGE,
 * e o motor de análise em tempo real 'trampoAI' para feedback ao recrutador.
 */
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../context/ToastContextCore';
import './JobForm.css';
import trampoAI from '../utils/trampoAI';
import { 
  ShieldCheck, Zap, Star, Briefcase, Users, Eye, Phone, MapPin, Smile, 
  DollarSign, Clock, FileText, BarChart, Building2, Link2, ClipboardList, 
  Target, Award, ListChecks, Utensils, Laptop, TrendingUp, HeartPulse, 
  GraduationCap, Gift, Baby, MessageSquare, Mail, ExternalLink, Navigation, Sparkles, Rocket
} from 'lucide-react';

const BENEFIT_CATEGORIES = [
  {
    title: 'Alimentação & Básicos',
    icon: <Utensils size={18} />,
    benefits: [
      { id: 'vr', label: 'Vale Refeição (VR)', hasValue: true },
      { id: 'va', label: 'Vale Alimentação (VA)', hasValue: true },
      { id: 'vt', label: 'Vale Transporte (VT)', hasValue: true },
      { id: 'combustivel', label: 'Auxílio Combustível', hasValue: true },
      { id: 'refeicao_local', label: 'Refeição no local' },
      { id: 'lanches', label: 'Lanches / Snacks' },
    ]
  },
  {
    title: 'Trabalho & Flexibilidade',
    icon: <Laptop size={18} />,
    benefits: [
      { id: 'homeoffice', label: 'Auxílio Home Office', hasValue: true },
      { id: 'internet', label: 'Auxílio Internet', hasValue: true },
      { id: 'energia', label: 'Auxílio Energia', hasValue: true },
      { id: 'ajuda_custo', label: 'Ajuda de custo', hasValue: true },
    ]
  },
  {
    title: 'Financeiro & Bônus',
    icon: <TrendingUp size={18} />,
    benefits: [
      { id: 'bonus', label: 'Bônus por desempenho' },
      { id: 'plr', label: 'Participação nos Lucros (PLR)' },
      { id: 'comissao', label: 'Comissão' },
      { id: 'gratificacao', label: 'Gratificação' },
      { id: 'caju_flash', label: 'Multibenefícios (Caju/Flash)', hasValue: true },
      { id: 'seguro', label: 'Seguro de Vida' },
    ]
  },
  {
    title: 'Saúde & Bem-estar',
    icon: <HeartPulse size={18} />,
    benefits: [
      { id: 'saude', label: 'Plano de Saúde' },
      { id: 'odonto', label: 'Plano Odontológico' },
      { id: 'gympass', label: 'Wellhub (Gympass)' },
      { id: 'totalpass', label: 'TotalPass' },
      { id: 'mental', label: 'Apoio Saúde Mental' },
      { id: 'telemedicina', label: 'Telemedicina' },
      { id: 'farmacia', label: 'Reembolso Farmácia', hasValue: true },
    ]
  },
  {
    title: 'Educação & Carreira',
    icon: <GraduationCap size={18} />,
    benefits: [
      { id: 'educacao', label: 'Auxílio Educação' },
      { id: 'cursos', label: 'Cursos Pagos' },
      { id: 'idiomas', label: 'Auxílio Idiomas' },
      { id: 'treinamentos', label: 'Treinamentos Internos' },
    ]
  },
  {
    title: 'Cultura & Lifestyle',
    icon: <Gift size={18} />,
    benefits: [
      { id: 'dayoff', label: 'Day Off (Aniversário)' },
      { id: 'cultura', label: 'Vale Cultura' },
      { id: 'happy_hour', label: 'Happy Hour / Eventos' },
      { id: 'viagens', label: 'Viagens Corporativas' },
    ]
  },
  {
    title: 'Família',
    icon: <Baby size={18} />,
    benefits: [
      { id: 'creche', label: 'Auxílio Creche' },
      { id: 'maternidade', label: 'Licença Estendida' },
      { id: 'nascimento', label: 'Auxílio Nascimento' },
    ]
  }
];

// Flat list removida (não utilizada)


/**
 * Estado inicial padrão para novas vagas.
 * Inclui flags de visibilidade (is_urgent, is_featured) e campos de diversidade.
 */
const DEFAULT_FORM = {
  titulo: '',
  empresa: '',
  cidade: '',
  modalidade_trabalho: 'Presencial',
  modalidade_contrato: 'CLT',
  salario: '',
  salario_max: '',
  nivel: 'Não informado',
  num_vagas: '1',
  horario: '',
  beneficios: '',
  beneficios_lista: [],
  descricao: '',
  atividades: '',
  requisitos: '',
  diferenciais: '',
  descricao_empresa: '',
  logo_url: '',
  pcd: false,
  exclusiva_pcd: false,
  afirmativa: {
    mulheres: false,
    negros: false,
    lgbt: false,
    senior: false,
    vulnerabilidade: false
  },
  contato: {
    whatsapp: '',
    email: '',
    link: '',
    endereco: ''
  },
  is_urgent: false,
  is_featured: false, // Destaque Premium (VIP)
  recruiter_email: ''
};

export function JobForm({ initialData, onSubmit, buttonText, title, subtitle, hideHero }) {
  const { showToast } = useToast();
  const isEdit = !!initialData;

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...DEFAULT_FORM,
        ...initialData,
        beneficios_lista: initialData.beneficios_lista || []
      };
    }
    return DEFAULT_FORM;
  });

  // Removido estado de erro local para usar Toasts globais
  // const [error, setError] = useState('');

  // UX Inteligente Toggles
  const [isConfidencial, setIsConfidencial] = useState(false);
  const [isSalarioACombinar, setIsSalarioACombinar] = useState(false);
  const [isHorarioOculto, setIsHorarioOculto] = useState(false);

  // Estados Locais API IBGE
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(() => {
    if (initialData?.cidade && initialData.cidade !== 'Remoto') {
      const parts = initialData.cidade.split(' - ');
      return (parts.length === 2 && parts[1]) ? parts[1] : '';
    }
    return '';
  });
  const [selectedCidade, setSelectedCidade] = useState(() => {
    if (initialData?.cidade && initialData.cidade !== 'Remoto') {
      const parts = initialData.cidade.split(' - ');
      return parts[0] || '';
    }
    return '';
  });

  // Busca estados do IBGE ao montar o componente
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error(err));
  }, []);

  // Busca municípios do IBGE sempre que o estado selecionado mudar
  useEffect(() => {
    if (selectedEstado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => setCidades(data))
        .catch(err => console.error(err));
    }
  }, [selectedEstado]);

  // Efeito para sincronizar cidades ao montar se já tiver estado (Edit mode)
  useEffect(() => {
    if (selectedEstado && cidades.length === 0) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => setCidades(data))
        .catch(err => console.error(err));
    }
  }, [selectedEstado, cidades.length]);

  const handleDetailKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      const { value, selectionStart } = e.target;
      
      // Se a linha anterior começa com º, adiciona º na próxima
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      
      if (currentLine.startsWith('º')) {
        e.preventDefault();
        const newValue = value.substring(0, selectionStart) + '\nº ' + value.substring(selectionStart);
        setFormData(prev => ({ ...prev, [field]: newValue }));
        
        // Ajusta cursor após o re-render
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 3;
        }, 0);
      }
    }
    
    // Se digitou algo e o campo está vazio, começa com º
    if (e.target.value === '' && e.key.length === 1) {
       e.preventDefault();
       setFormData(prev => ({ ...prev, [field]: 'º ' + e.key }));
    }
  };

  // Otimização: Recalcular análise da IA apenas ao sair do campo (onBlur) para evitar lag
  const [aiData, setAiData] = useState(formData);
  
  const handleBlur = () => {
    setAiData(formData);
  };

  const aiAnalysis = useMemo(() => trampoAI.analyzeForRecruiter(aiData), [aiData]);
  const jobScore = aiAnalysis.total;
  const marketData = aiAnalysis.market;
  const checklist = aiAnalysis.checklist;
  // performanceLevel removido (não utilizado)


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('afirmativa.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        afirmativa: { ...prev.afirmativa, [field]: checked }
      }));
    } else if (name.startsWith('contato.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contato: { ...prev.contato, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleBenefitToggle = (id, label) => {
    setFormData(prev => {
      const exists = prev.beneficios_lista.find(b => b.id === id);
      if (exists) {
        return {
          ...prev,
          beneficios_lista: prev.beneficios_lista.filter(b => b.id !== id)
        };
      } else {
        return {
          ...prev,
          beneficios_lista: [...prev.beneficios_lista, { id, label, valor: '' }]
        };
      }
    });
  };

  const handleBenefitValue = (id, valor) => {
    setFormData(prev => ({
      ...prev,
      beneficios_lista: prev.beneficios_lista.map(b =>
        b.id === id ? { ...b, valor } : b
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação de localização
    let finalCidade;
    if (formData.modalidade_trabalho === 'Remoto') {
      finalCidade = 'Remoto';
    } else {
      if (!selectedEstado || !selectedCidade) {
        showToast('Por favor, selecione o Estado e a Cidade em que a vaga será exercida.', 'warning');
        return;
      }
      finalCidade = `${selectedCidade} - ${selectedEstado}`;
    }

    // Validação de contato
    const { whatsapp, email, link } = formData.contato;
    if (!whatsapp && !email && !link) {
      showToast('É obrigatório informar pelo menos um meio de contato (WhatsApp, Email ou Link)', 'warning');
      return;
    }

    // Aplicar máscaras de UX antes de enviar
    const formDataTratado = { ...formData, cidade: finalCidade };

    if (isConfidencial) {
      formDataTratado.empresa = 'Empresa Confidencial';
    }

    if (isSalarioACombinar) {
      formDataTratado.salario = 'A combinar';
    }

    if (isHorarioOculto) {
      formDataTratado.horario = '';
    }

    // setError('');
    onSubmit(formDataTratado);
  };

  const formatCurrency = (value) => {
    // Remove tudo que não for dígito
    let v = value.replace(/\D/g, "");
    if (!v) return "";

    // Converte para centavos
    v = (parseInt(v) / 100).toFixed(2);

    // Aplica formatação BRL
    return "R$ " + v.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const handleSalarioChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({ ...prev, salario: formatted }));
  };

  return (
    <div className={`job-form-page-wrapper ${hideHero ? 'no-hero' : ''}`}>
      {/* HERO RECRUITER PREMIUM (Style from Home) */}
      {!hideHero && (
        <section className="jd-recruiter-hero-premium">
           <div className="tech-glow-orb"></div>
           <div className="container hero-content-top">
              <div className="jd-social-greeting-v2">
                 <h1 className="hero-title-main">
                   {title || (isEdit ? 
                     <><span className="text-gradient">Refine sua vaga</span> para máxima performance.</> : 
                     <>Publique <span className="text-gradient">vagas de alta</span> performance.</>
                   )}
                 </h1>
                 <p className="hero-subtitle">
                   {subtitle || (isEdit ? 
                     "Edite os detalhes, melhore os requisitos e atraia os talentos certos para o seu time." : 
                     "Use o poder da IA para otimizar sua busca pelos melhores talentos do mercado."
                   )}
                 </p>
              </div>
           </div>
        </section>
      )}

      <div className="job-form-premium-container">
        {/* FORMULÁRIO PRINCIPAL */}
        <form id="main-job-form" className="job-form-modern" onSubmit={handleSubmit} onBlur={handleBlur}>
        {/* Toasts globais substituem o alerta inline */}
        {/* {error && <div className="alert alert-danger-premium">{error}</div>} */}

        <div className="form-section">
          <div className="section-header-rich">
            <h3><Briefcase size={24} /> Informações Principais</h3>
            <p>Comece pelo básico para que os candidatos identifiquem a vaga rapidamente.</p>
          </div>

          <div className="form-grid-premium">
            {/* TÍTULO E EMPRESA */}
            <div className="form-group span-2">
              <label className="form-label"><Star size={14} /> Título da vaga <span>*</span></label>
              <input required type="text" name="titulo" className="form-control" value={formData.titulo} onChange={handleChange} placeholder="Ex: Desenvolvedor Front-end" />
            </div>

            <div className="form-group span-2">
              <div className="label-with-action">
                <label className="form-label"><Briefcase size={14} /> Nome da Empresa <span>*</span></label>
                <label className="switch-toggle">
                  <input type="checkbox" checked={isConfidencial} onChange={(e) => setIsConfidencial(e.target.checked)} />
                  <span className="switch-slider"></span>
                  <span className="switch-text">{isConfidencial ? 'Confidencial' : 'Ocultar nome'}</span>
                </label>
              </div>
              <input required={!isConfidencial} disabled={isConfidencial} type="text" name="empresa" className={`form-control ${isConfidencial ? 'disabled-input' : ''}`} value={isConfidencial ? 'Empresa Confidencial' : formData.empresa} onChange={handleChange} placeholder="Ex: Tech Solutions" />
            </div>

            {/* LOCALIZAÇÃO E MODALIDADE */}
            <div className="form-group">
                <label className="form-label"><MapPin size={14} /> Estado <span>*</span></label>
                <select className="form-control" value={selectedEstado} onChange={(e) => { setSelectedEstado(e.target.value); setSelectedCidade(''); }} disabled={formData.modalidade_trabalho === 'Remoto'} >
                  <option value="">Selecione o Estado</option>
                  {estados.map(uf => (
                    <option key={uf.id} value={uf.sigla}>{uf.nome} ({uf.sigla})</option>
                  ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label"><MapPin size={14} /> Cidade <span>*</span></label>
                <select className="form-control" value={selectedCidade} onChange={(e) => setSelectedCidade(e.target.value)} disabled={!selectedEstado || formData.modalidade_trabalho === 'Remoto'} >
                  <option value="">{selectedEstado ? 'Selecione a Cidade' : 'Escolha um estado primeiro'}</option>
                  {cidades.map(city => (
                    <option key={city.id} value={city.nome}>{city.nome}</option>
                  ))}
                </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Users size={14} /> Modalidade <span>*</span></label>
              <select required name="modalidade_trabalho" className="form-control" value={formData.modalidade_trabalho} onChange={handleChange}>
                <option value="Presencial">📍 Presencial</option>
                <option value="Híbrido">🏠 Híbrido</option>
                <option value="Remoto">🌍 Remoto</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><FileText size={14} /> Contrato <span>*</span></label>
              <select required name="modalidade_contrato" className="form-control" value={formData.modalidade_contrato} onChange={handleChange}>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estágio">Estágio</option>
                <option value="Temporário">Temporário</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Aprendiz">Aprendiz</option>
              </select>
            </div>

            {/* EXPERIÊNCIA E VAGAS */}
            <div className="form-group">
              <label className="form-label"><BarChart size={14} /> Nível de Experiência</label>
              <select name="nivel" className="form-control" value={formData.nivel} onChange={handleChange}>
                <option value="Não informado">Não informado</option>
                <option value="Estagiário">Estagiário</option>
                <option value="Assistente / Auxiliar">Assistente / Auxiliar</option>
                <option value="Júnior">Júnior</option>
                <option value="Pleno">Pleno</option>
                <option value="Sênior">Sênior</option>
                <option value="Especialista">Especialista</option>
                <option value="Gerência / Direção">Gerência / Direção</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Users size={14} /> Qtd. de Vagas</label>
              <input type="number" name="num_vagas" className="form-control" value={formData.num_vagas} onChange={handleChange} min="1" placeholder="Ex: 1" />
            </div>

            {/* SALÁRIO E HORÁRIO */}
            <div className="form-group">
              <div className="label-with-action">
                <label className="form-label"><DollarSign size={14} /> Salário</label>
                <label className="switch-toggle">
                  <input type="checkbox" checked={isSalarioACombinar} onChange={(e) => setIsSalarioACombinar(e.target.checked)} />
                  <span className="switch-slider"></span>
                  <span className="switch-text">{isSalarioACombinar ? 'Combinar' : 'Informar'}</span>
                </label>
              </div>
              {!isSalarioACombinar && (
                <input type="text" name="salario" className="form-control" value={formData.salario === 'A combinar' ? '' : formData.salario} onChange={handleSalarioChange} placeholder="Ex: R$ 3.000,00" />
              )}
              {isSalarioACombinar && <div className="form-control disabled-input">A combinar</div>}
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label className="form-label"><Clock size={14} /> Horário</label>
                <label className="switch-toggle">
                  <input type="checkbox" checked={isHorarioOculto} onChange={(e) => setIsHorarioOculto(e.target.checked)} />
                  <span className="switch-slider"></span>
                  <span className="switch-text">{isHorarioOculto ? 'Oculto' : 'Informar'}</span>
                </label>
              </div>
              {!isHorarioOculto && (
                <input type="text" name="horario" className="form-control" value={formData.horario} onChange={handleChange} placeholder="Ex: 09:00 às 18:00" />
              )}
              {isHorarioOculto && <div className="form-control disabled-input">Não informado</div>}
            </div>
          </div>

          {formData.modalidade_trabalho === 'Remoto' && (
            <div className="v-warning-blue mt-4">
              ✨ <strong>Modalidade Remota Ativada:</strong> A vaga terá alcance nacional e a cidade não será exibida para os candidatos.
            </div>
          )}
        </div>

        {/* NOVA SEÇÃO: CONFIGURAÇÕES DE VISIBILIDADE (DESTAQUE MÁXIMO) */}
        <div className="form-section section-visibility-highlight">
          <div className="section-header-rich">
            <h3><Eye size={24} /> Configurações de Visibilidade</h3>
            <p>Escolha o nível de alcance e destaque que sua vaga terá no feed principal.</p>
          </div>
          
          <div className="premium-cards-grid">
            <label className={`premium-feature-card urgent ${formData.is_urgent ? 'active' : ''}`}>
              <input type="checkbox" name="is_urgent" checked={formData.is_urgent} onChange={handleChange} />
              <div className="premium-card-icon">🔥</div>
              <div className="premium-card-info">
                <div className="premium-card-top">
                  <span>Vaga Urgente</span>
                  <div className="p-badge">Vaga Urgente</div>
                </div>
                <p>Para quem precisa contratar rápido. Destaque visual no feed e prioridade nas listagens.</p>
              </div>
              <div className="premium-card-check">
                 <div className="custom-check"></div>
              </div>
            </label>

            <label className={`premium-feature-card featured ${formData.is_featured ? 'active' : ''}`}>
              <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
              <div className="premium-card-icon">💎</div>
              <div className="premium-card-info">
                <div className="premium-card-top">
                  <span>Destaque Premium</span>
                  <div className="p-badge gold">Destaque Premium</div>
                </div>
                <p>Máxima visibilidade na plataforma. Vaga fixada no topo e destaque visual completo (VIP).</p>
              </div>
              <div className="premium-card-check">
                 <div className="custom-check"></div>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section section-diversity-premium">
          <div className="section-header-rich">
            <h3><Users size={24} /> Acessibilidade e Diversidade</h3>
            <p>Destaque o compromisso da sua empresa com a inclusão e o impacto social.</p>
          </div>

          <div className="diversity-grid-pills">
            <label className={`diversity-pill ${formData.pcd ? 'active' : ''}`}>
              <input type="checkbox" name="pcd" checked={formData.pcd} onChange={handleChange} />
              <span>♿ Vaga aceita PcD</span>
            </label>
            <label className={`diversity-pill ${formData.exclusiva_pcd ? 'active' : ''}`}>
              <input type="checkbox" name="exclusiva_pcd" checked={formData.exclusiva_pcd} onChange={handleChange} />
              <span>♿ Exclusiva para PcD</span>
            </label>
            <label className={`diversity-pill ${formData.afirmativa.mulheres ? 'active' : ''}`}>
              <input type="checkbox" name="afirmativa.mulheres" checked={formData.afirmativa.mulheres} onChange={handleChange} />
              <span>👩 Mulheres</span>
            </label>
            <label className={`diversity-pill ${formData.afirmativa.negros ? 'active' : ''}`}>
              <input type="checkbox" name="afirmativa.negros" checked={formData.afirmativa.negros} onChange={handleChange} />
              <span>✊ Pessoas Negras</span>
            </label>
            <label className={`diversity-pill ${formData.afirmativa.lgbt ? 'active' : ''}`}>
              <input type="checkbox" name="afirmativa.lgbt" checked={formData.afirmativa.lgbt} onChange={handleChange} />
              <span>🌈 LGBTQIA+</span>
            </label>
            <label className={`diversity-pill ${formData.afirmativa.senior ? 'active' : ''}`}>
              <input type="checkbox" name="afirmativa.senior" checked={formData.afirmativa.senior} onChange={handleChange} />
              <span>👴 Profissionais 50+</span>
            </label>
            <label className={`diversity-pill ${formData.afirmativa.vulnerabilidade ? 'active' : ''}`}>
              <input type="checkbox" name="afirmativa.vulnerabilidade" checked={formData.afirmativa.vulnerabilidade} onChange={handleChange} />
              <span>🤝 Vulnerabilidade Social</span>
            </label>
          </div>

          <div className="divider-premium"></div>
        </div>

        {/* SEÇÃO 3: SOBRE A EMPRESA E LOGO (REDESIGN) */}
        <div className="form-section section-branding-premium">
          <div className="section-header-rich">
            <h3><Building2 size={24} /> Sobre a Empresa e Branding</h3>
            <p>Sua marca é o primeiro contato do candidato. Transmita autoridade e cultura.</p>
          </div>

          <div className="branding-grid-layout">
            <div className="branding-content-area">
              <div className="form-group">
                <label className="form-label">História & Cultura da Empresa</label>
                <textarea 
                  name="descricao_empresa" 
                  className="form-control" 
                  style={{ minHeight: '180px' }}
                  value={formData.descricao_empresa} 
                  onChange={handleChange} 
                  placeholder="Conte um pouco sobre a história, valores e o que torna sua empresa um lugar incrível para trabalhar..."
                ></textarea>
              </div>
            </div>

            <div className="branding-asset-area">
              <label className="form-label"><Link2 size={14} /> Logo da Empresa</label>
              <div className={`logo-upload-container ${formData.logo_url ? 'has-logo' : ''}`}>
                {!formData.logo_url ? (
                  <div className="logo-placeholder-ui">
                    <div className="lp-icon">📁</div>
                    <span>Insira a URL da Logo</span>
                    <p>PNG, JPG ou SVG</p>
                  </div>
                ) : (
                  <div className="logo-active-preview">
                    <img src={formData.logo_url} alt="Logo Preview" />
                    <button type="button" className="btn-remove-logo" onClick={() => handleChange({ target: { name: 'logo_url', value: '' } })}>✕</button>
                  </div>
                )}
                <input 
                  type="url" 
                  name="logo_url" 
                  className="logo-url-hidden-input" 
                  value={formData.logo_url} 
                  onChange={handleChange} 
                  placeholder="Cole aqui o link da imagem..." 
                />
              </div>
              <p className="help-text-premium">Recomendado: Logo quadrada ou horizontal com fundo transparente.</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: DETALHES DA VAGA (REDESIGN) */}
        <div className="form-section section-details-premium">
          <div className="section-header-rich">
             <h3><ListChecks size={24} /> Detalhes da Vaga</h3>
             <p>Capriche nos detalhes. Vagas mais completas recebem 3x mais candidaturas qualificadas.</p>
          </div>

          <div className="details-modern-grid">
            <div className="rich-input-group span-2">
              <div className="rig-header">
                <label><ClipboardList size={16} /> Descrição Geral <span>*</span></label>
                <div className="rig-hint">Conte os objetivos principais da vaga</div>
              </div>
              <textarea 
                required 
                name="descricao" 
                className="form-control rich-textarea-v2" 
                value={formData.descricao} 
                onChange={handleChange} 
                placeholder="Ex: Estamos em busca de uma pessoa para revolucionar nossa interface..."
              ></textarea>
            </div>

            <div className="rich-input-group">
              <div className="rig-header">
                <label><Target size={16} /> Responsabilidades</label>
                <div className="rig-hint">O que fará no dia a dia?</div>
              </div>
              <textarea 
                name="atividades" 
                className="form-control rich-textarea-v2" 
                value={formData.atividades} 
                onChange={handleChange} 
                onKeyDown={(e) => handleDetailKeyDown(e, 'atividades')}
                placeholder="º Executar tarefas diárias&#10;º Colaborar com o time..."
              ></textarea>
            </div>

            <div className="rich-input-group">
              <div className="rig-header">
                <label><ShieldCheck size={16} /> Requisitos</label>
                <div className="rig-hint">Conhecimentos essenciais</div>
              </div>
              <textarea 
                name="requisitos" 
                className="form-control rich-textarea-v2" 
                value={formData.requisitos} 
                onChange={handleChange} 
                onKeyDown={(e) => handleDetailKeyDown(e, 'requisitos')}
                placeholder="º Nível Superior&#10;º Conhecimento em banco de dados"
              ></textarea>
            </div>

            <div className="rich-input-group span-2">
              <div className="rig-header">
                <label><Award size={16} /> Diferenciais</label>
                <div className="rig-hint">O que faria o candidato brilhar?</div>
              </div>
              <textarea 
                name="diferenciais" 
                className="form-control rich-textarea-v2" 
                value={formData.diferenciais} 
                onChange={handleChange} 
                onKeyDown={(e) => handleDetailKeyDown(e, 'diferenciais')}
                placeholder="º Pós Graduação&#10;º Certificação técnica relevante"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: BENEFÍCIOS (UPGRADE TOTAL) */}
        <div className="form-section section-benefits-premium">
          <div className="section-header-rich">
            <div className="title-with-badge">
              <h3><Smile size={24} /> Benefícios & Vantagens</h3>
              <div className="badge-benefit-count">{formData.beneficios_lista.length} selecionados</div>
            </div>
            <p>Vagas com benefícios competitivos atraem candidatos de maior nível técnico.</p>
          </div>

          <div className="benefits-library">
            {BENEFIT_CATEGORIES.map(category => (
              <div key={category.title} className="benefit-cat-group">
                <h4 className="benefit-cat-title">{category.icon} {category.title}</h4>
                <div className="benefits-grid-picker-compact">
                  {category.benefits.map(benefit => {
                    const activeBenefit = formData.beneficios_lista?.find(b => b.id === benefit.id);
                    const isActive = !!activeBenefit;
                    
                    return (
                      <div 
                        key={benefit.id} 
                        className={`benefit-box-inline ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                          // Se clicar no input, não desmarca
                          if (e.target.tagName === 'INPUT') return;
                          handleBenefitToggle(benefit.id, benefit.label);
                        }}
                      >
                        <div className="inline-box-top">
                          <div className="bv2-check"></div>
                          <span className="bv2-label">{benefit.label}</span>
                          {benefit.hasValue && <div className="bv2-coin-tag">VALOR</div>}
                        </div>
                        
                        {isActive && benefit.hasValue && (
                           <div className="inline-value-input-wrap animate-in" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                className="form-control-inline"
                                placeholder="Ex: R$ 800"
                                value={activeBenefit.valor || ''}
                                onChange={(e) => handleBenefitValue(benefit.id, e.target.value)}
                                autoFocus
                              />
                           </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group mt-5">
            <label className="form-label">Outros Benefícios (Campo Livre)</label>
            <textarea 
              name="beneficios" 
              className="form-control" 
              value={formData.beneficios} 
              onChange={handleChange} 
              placeholder="Descreva benefícios adicionais não listados (ex: assinaturas, viagens, perks exclusivos…)"
            ></textarea>
          </div>
        </div>

        {/* SEÇÃO 6: CONTATO (REDESIGN) */}
        <div className="form-section section-contact-premium">
          <div className="section-header-rich">
            <h3><Phone size={24} /> Meios de Contato para Candidatura</h3>
            <p>Escolha como deseja receber as candidaturas. Pelo menos um campo é obrigatório.</p>
          </div>

          <div className="contact-channels-grid">
            {/* WHATSAPP */}
            <div className={`contact-channel-card ${formData.contato.whatsapp ? 'active' : ''}`}>
               <div className="cc-header">
                  <div className="cc-icon wa"><MessageSquare size={18} /></div>
                  <div className="cc-info">
                    <label>WhatsApp</label>
                    <span>Candidatura Rápida</span>
                  </div>
               </div>
               <input 
                 type="text" 
                 name="contato.whatsapp" 
                 className="form-control cc-input" 
                 value={formData.contato.whatsapp} 
                 onChange={handleChange} 
                 placeholder="Ex: 11999999999" 
               />
            </div>

            {/* EMAIL */}
            <div className={`contact-channel-card ${formData.contato.email ? 'active' : ''}`}>
               <div className="cc-header">
                  <div className="cc-icon mail"><Mail size={18} /></div>
                  <div className="cc-info">
                    <label>E-mail</label>
                    <span>Candidatura Tradicional</span>
                  </div>
               </div>
               <input 
                 type="email" 
                 name="contato.email" 
                 className="form-control cc-input" 
                 value={formData.contato.email} 
                 onChange={handleChange} 
                 placeholder="Ex: vagas@empresa.com" 
               />
            </div>

            {/* LINK / GUPY */}
            <div className={`contact-channel-card span-2 ${formData.contato.link ? 'active' : ''}`}>
               <div className="cc-header">
                  <div className="cc-icon link"><ExternalLink size={18} /></div>
                  <div className="cc-info">
                    <label>Link Externo / Gupy / LinkedIn</label>
                    <span>Redirecionar para seu portal</span>
                  </div>
               </div>
               <input 
                 type="url" 
                 name="contato.link" 
                 className="form-control cc-input" 
                 value={formData.contato.link} 
                 onChange={handleChange} 
                 placeholder="Ex: https://empresa.gupy.io/vaga-estagiario" 
               />
            </div>

            {/* ENDEREÇO */}
            <div className={`contact-channel-card span-2 ${formData.contato.endereco ? 'active' : ''}`}>
               <div className="cc-header">
                  <div className="cc-icon local"><Navigation size={18} /></div>
                  <div className="cc-info">
                    <label>Endereço de Entrega (Presencial)</label>
                    <span>Ideal para serviços locais</span>
                  </div>
               </div>
               <input 
                 type="text" 
                 name="contato.endereco" 
                 className="form-control cc-input" 
                 value={formData.contato.endereco} 
                 onChange={handleChange} 
                 placeholder="Ex: Rua das Flores, 123 - Centro" 
               />
            </div>
          </div>
        </div>

        {/* SEÇÃO 7: SEGURANÇA E GESTÃO (PRIVADO) */}
        <div className="form-section section-management-premium">
          <div className="section-header-rich">
            <h3><ShieldCheck size={24} /> Segurança e Gestão</h3>
            <p>Este e-mail é <strong>privado</strong>. Ele será usado apenas para você recuperar o acesso à edição ou exclusão desta vaga no futuro.</p>
          </div>

          <div className="form-group">
            <label className="form-label"><Mail size={14} /> Seu E-mail de Gestão <span>*</span></label>
            <input 
              required 
              type="email" 
              name="recruiter_email" 
              className="form-control" 
              value={formData.recruiter_email} 
              onChange={handleChange} 
              placeholder="Ex: seuemail@empresa.com" 
            />
          </div>
        </div>
      </form>

      {/* TRAMPO AI: Dashboard de Otimização do Recrutador */}
      <div className="form-preview-sidebar-premium">
        <div className="preview-sticky">
          <div className="ai-integrated-header">
             <div className="ai-logo-pill">
                <Sparkles size={16} /> <span>Trampo AI</span>
             </div>
             <div className="ai-tag-status-premium">Otimização Ativa</div>
          </div>

          {/* 1. Score Centralizado e Grande */}
          <div className="ai-main-score-center">
            <div className="score-circle-large" style={{"--score-percent": jobScore, "--score-color": jobScore > 80 ? '#10B981' : jobScore > 60 ? '#F59E0B' : '#EF4444'}}>
              <svg viewBox="0 0 36 36" className="circular-chart-premium">
                <path className="circle-bg-premium" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-progress-premium" strokeDasharray={`${jobScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="score-inner-content">
                <span className="score-number-large">{jobScore}</span>
                <span className="score-label-sub">Score Global</span>
              </div>
            </div>
            
            <div className="ai-score-message">
               {jobScore > 85 ? '✨ Vaga Impecável!' : jobScore > 60 ? '👍 Bom caminho, mas pode melhorar' : '⚠️ Precisa de ajustes urgentes'}
            </div>
          </div>

          {/* 2. Análise de Mercado Detalhada */}
          <div className="ai-market-analysis-card">
             <div className="market-header">
                <BarChart size={16} />
                <span>Análise de Mercado</span>
             </div>
             <div className="market-badge-large" style={{ background: marketData.color }}>
                {marketData.label}
             </div>
             <p className="market-insight-text">
                {marketData.insight}
             </p>
          </div>

          {/* 3. Dicas Dinâmicas de Melhoria */}
          <div className="ai-optimization-tips">
             <div className="tips-header">
                <Zap size={16} />
                <span>Como aumentar seu Score:</span>
             </div>
             <div className="ai-tips-scroll-area">
                {checklist.length > 0 ? (
                  checklist.map((tip, idx) => (
                    <div key={idx} className="ai-tip-card">
                        <div className="tip-bullet" />
                        {tip}
                    </div>
                  ))
                ) : (
                  <div className="ai-tip-card success">
                    ✅ Todos os requisitos de performance ELITE foram atingidos!
                  </div>
                )}
             </div>
          </div>

          <button type="submit" form="main-job-form" className="btn-publish-recruiter">
            <Rocket size={20} /> {buttonText}
          </button>
          
          <div className="ai-footer-info">
             <ShieldCheck size={12} />
             <span>Validado pelo Motor Trampo AI v2.4</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
