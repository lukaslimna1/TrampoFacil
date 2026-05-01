/**
 * PÁGINA: Contact (Atendimento ao Usuário)
 * OBJETIVO: Facilitar o contato direto entre usuários e a equipe do Trampo Fácil.
 * POR QUE: Centraliza solicitações de suporte, parcerias e denúncias de vagas falsas,
 * integrando links de privacidade para reforçar o compromisso com a transparência.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContextCore';
import { 
  FiSend, FiMail, FiMessageCircle, 
  FiShield, FiBriefcase, FiUsers, FiCheckCircle 
} from 'react-icons/fi';
import { 
  FaLinkedin, FaInstagram, FaWhatsapp 
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import './Contact.css';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Outro',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      showToast("Mensagem enviada com sucesso! Responderemos em breve. 🚀", "success");
      
      setFormData({
        name: '',
        email: '',
        subject: 'Outro',
        message: ''
      });
      
      e.target.reset();
    } catch (err) {
      console.error("Erro ao enviar contato:", err);
      showToast("Erro ao enviar mensagem. Tente novamente ou use nossos canais diretos.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page-premium">
      <div className="tech-grid-overlay"></div>

      {/* Compact Header Section */}
      <header className="contact-compact-header reveal">
        <div className="container">
          <div className="header-flex-v4">
            <div className="header-text-side-v4">
              <div className="m-tag-v4">CONTATO</div>
              <h1 className="hero-title-v4">
                Conecte-se com o <span className="text-gradient-v4">Trampo Fácil.</span>
              </h1>
              <p className="hero-desc-v4">
                Dúvidas, parcerias ou suporte? Nossa equipe está pronta para 
                te ajudar agora.
              </p>
            </div>
            
            <div className="header-stats-v4 hidden-mobile">
              <div className="stat-pill-v4">
                <span className="pill-dot"></span>
                <span>Resposta em &lt; 24h</span>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                <div className="header-icon-v4"><FiSend size={24} /></div>
                <div className="header-text-v4">
                  <h4>Canal de Comunicação Direto</h4>
                  <p>Sua mensagem será processada pelo nosso motor de atendimento prioritário.</p>
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
                <label>Assunto / Perfil de Contato</label>
                <div className="select-wrapper-v4">
                  <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="Candidato">👤 Sou Candidato (Buscando Vagas)</option>
                    <option value="Recrutador">🏢 Sou Recrutador ou Empresa</option>
                    <option value="Privacidade">🔐 Privacidade e LGPD (Dados Pessoais)</option>
                    <option value="Seguranca">🛡️ Reportar Vaga Suspeita / Denúncia</option>
                    <option value="Legal">📄 Termos de Uso e Compliance</option>
                    <option value="Parceria">🤝 Quero ser um Parceiro</option>
                    <option value="Suporte">⚙️ Suporte Técnico ou Erros</option>
                    <option value="Outros">✨ Outros Assuntos</option>
                  </select>
                </div>
              </div>

              <div className="form-group-v4">
                <label>Mensagem <span>*</span></label>
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="Descreva detalhadamente como podemos te ajudar..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-footer-v4">
                <button 
                  type="submit" 
                  className={`btn-v4-main ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="loader-inline"></div>
                  ) : (
                    <>
                      <span>Enviar Mensagem Agora</span>
                      <FiSend size={18} />
                    </>
                  )}
                </button>
                <p className="form-privacy-note">
                  Ao enviar, você concorda com nossa <Link to="/legal/privacidade">Política de Privacidade</Link>.
                </p>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}