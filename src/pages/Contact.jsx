import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContextCore';
import { 
  FiSend, FiMail, FiMessageCircle, 
  FiShield, FiBriefcase, FiUsers 
} from 'react-icons/fi';
import { 
  FaLinkedin, FaInstagram, FaWhatsapp 
} from 'react-icons/fa';
import './Contact.css';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Candidato',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal-init');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Mensagem recebida! Nossa equipe entrará em contato em breve. 🚀", "success");
    
    // Limpa o formulário após o envio bem sucedido
    setFormData({
      name: '',
      email: '',
      subject: 'Candidato',
      message: ''
    });
    
    // Reseta o scroll do formulário se necessário
    e.target.reset();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page-premium">
      <div className="tech-grid-overlay"></div>

      {/* Hero Section */}
      <section className="contact-hero-premium reveal">
        <div className="container hero-flex-v4">
          <div className="hero-text-side-v4">
            <div className="m-tag-v4">CENTRAL DE ATENDIMENTO</div>
            <h1 className="hero-title-v4">
              Conecte-se com o <br/>
              <span className="text-gradient-v4">Trampo Fácil.</span>
            </h1>
            <p className="hero-desc-v4">
              Dúvidas, parcerias ou suporte? Nossa equipe está pronta para 
              ajudar você a impulsionar sua carreira ou encontrar o talento ideal.
            </p>
          </div>

          <div className="hero-visual-side-v4">
            <div className="floating-ui-container">
               {/* Card de Status Flutuante */}
               <div className="floating-ui-card f-card-1">
                  <div className="card-top">
                    <div className="tech-icon"><FiUsers size={18} /></div>
                    <div className="match-score">Suporte Ativo</div>
                  </div>
                  <div className="card-content">
                    <div className="mini-bar"><div className="mini-fill" style={{width: '100%'}}></div></div>
                    <p className="mini-text">Tempo de resposta: &lt; 24h</p>
                  </div>
               </div>

               {/* Card de Segurança */}
               <div className="floating-ui-card f-card-2">
                  <div className="card-top">
                    <div className="tech-icon" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}><FiShield size={18} /></div>
                    <div className="match-score" style={{color: '#3b82f6'}}>Seguro</div>
                  </div>
                  <p className="mini-text">Proteção de Dados Ativa</p>
               </div>

               {/* Núcleo de Comunicação */}
               <div className="central-tech-core">
                  <div className="core-inner">
                    <FiBriefcase size={40} className="core-brain-icon" />
                  </div>
                  <div className="core-ring r1"></div>
                  <div className="core-ring r2"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid-premium">
          {/* Lado 1: Sidebar de Conexão */}
          <aside className="contact-sidebar-premium reveal">
            <div className="contact-info-card-v4 tech-card">
              <div className="card-glass-glow"></div>
              <div className="v-icon-box"><FiMessageCircle size={24} /></div>
              <h3>Canais Diretos</h3>
              <p>Escolha a forma mais conveniente de falar com a gente.</p>
              
              <div className="info-list-v4">
                <div className="info-item-v4">
                  <FiMail size={18} className="text-primary" />
                  <span>contato@trampofacil.com.br</span>
                </div>
                <div className="info-item-v4">
                  <FaWhatsapp size={18} style={{color: '#25D366'}} />
                  <span>WhatsApp Comercial</span>
                </div>
              </div>
            </div>

            <div className="contact-social-grid-v4">
              <div className="social-card-v4 tech-card">
                <FaLinkedin size={24} style={{color: '#0077b5'}} />
                <span>LinkedIn</span>
              </div>
              <div className="social-card-v4 tech-card">
                <FaInstagram size={24} style={{color: '#e4405f'}} />
                <span>Instagram</span>
              </div>
            </div>
          </aside>

          {/* Lado 2: Formulário */}
          <main className="contact-main-premium reveal">
            <form className="contact-form-v4 tech-card" onSubmit={handleSubmit}>
              <div className="card-glass-glow"></div>
              
              <div className="form-header-v4">
                <div className="header-icon-v4"><FiBriefcase size={24} /></div>
                <div className="header-text-v4">
                  <h4>Envie sua Mensagem</h4>
                  <p>Preencha os campos abaixo para iniciarmos o contato.</p>
                </div>
              </div>

              <div className="form-grid-v4">
                <div className="form-group-v4">
                  <label>Seu Nome <span>*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Como prefere ser chamado?" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group-v4">
                  <label>Seu E-mail <span>*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="email@exemplo.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-v4">
                <label>Assunto / Perfil</label>
                <div className="select-wrapper-v4">
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="Candidato">Sou Candidato (Buscando Vagas)</option>
                    <option value="Recrutador">Sou Recrutador ou Empresa</option>
                    <option value="Parceria">Quero ser um Parceiro</option>
                    <option value="Suporte">Dúvidas ou Problemas Técnicos</option>
                  </select>
                </div>
              </div>

              <div className="form-group-v4">
                <label>Mensagem <span>*</span></label>
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="No que podemos te ajudar hoje?"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-v4-main">
                <span>Enviar Mensagem</span>
                <FiSend size={18} />
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}