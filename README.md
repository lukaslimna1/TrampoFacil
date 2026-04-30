# 🚀 Trampo Fácil — Descoberta Inteligente de Oportunidades

<div align="center">
  <img src="https://img.shields.io/badge/Versão-4.9%20Stable-gold?style=for-the-badge&logo=react" alt="Versão Stable" />
  <img src="https://img.shields.io/badge/Performance‑Snappy%20UX-brightgreen?style=for-the-badge&logo=fastapi" alt="Performance Snappy" />
  <img src="https://img.shields.io/badge/IA‑Gemini%201.5%20Flash-blue?style=for-the-badge&logo=google-gemini" alt="IA Gemini" />
  <img src="https://img.shields.io/badge/DB‑Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase DB" />
  <br /><br />
  <h3>Encontre ou publique uma vaga em segundos — sem cadastro, sem burocracia.</h3>
  <p>Velocidade, simplicidade e inteligência aplicadas ao mundo real do trabalho.</p>
</div>

---

## ⚡ Sistema Sem Cadastro (Accountless)

O maior diferencial do Trampo Fácil é eliminar a necessidade de contas e senhas.

| Usuário | Como funciona |
|---|---|
| **Empresas** | Publicam vagas através do formulário *PublishJob*. Cada vaga recebe um **token exclusivo** que gera um link seguro (`/vaga/:id?token=…`). Esse link permite editar ou remover a vaga sem login. |
| **Candidatos** | Acessam imediatamente todas as funcionalidades (busca, filtros, aplicação) sem precisar criar conta. |
| **Privacidade** | Nenhum dado de login é armazenado; apenas o token da vaga é mantido no banco. |

---

## 🛡️ Central de Transparência & Compliance

A partir da v4.9, introduzimos uma arquitetura modular de conformidade e segurança:

*   **Arquitetura Modular**: Documentação jurídica dividida em módulos (`Security`, `Privacy`, `Terms`, `FAQ`) para fácil manutenção.
*   **FAQ Interativo**: Sistema de respostas expansíveis (Accordion) inspirado em plataformas premium (Dropbox/vagasbauru).
*   **Contato Inteligente**: Página de suporte otimizada com novos perfis de atendimento (Denúncia de Vagas, LGPD, Parcerias) e layout focado em conversão.

---

## 🧠 Inteligência Trampo IA

O motor `Trampo IA` (Gemini 1.5 Flash) foi sincronizado em toda a plataforma:

| Feature | O que entrega ao usuário |
|---|---|
| **Saudações Contextuais** | Mensagens inteligentes que mudam conforme a página (Contato, Legal, Home) e detectam o contexto da navegação. |
| **Score de Performance** | Avaliação 0-100 baseada em clareza, benefícios e inclusão, impulsionando vagas de alta qualidade. |
| **Fallback Robusto** | Garantia de frases inspiradoras mesmo em caso de indisponibilidade da API, mantendo a UX fluida. |

---

## 📊 Painel Técnico (Stack 2026)

| Característica | Detalhe | Impacto no Produto |
|---|---|---|
| **Arquitetura** | React 19 + Context API | Interface que nunca trava e estado sincronizado. |
| **Layout Expansivo** | Grid Ultra-Wide (até 1850px) | Aproveitamento total de monitores grandes para análise de vagas. |
| **Persistência** | Supabase Real-time | Vagas e visualizações atualizadas instantaneamente. |
| **Documentação** | JSDoc + Comentários de Objetivo | Código 100% autodocumentado para escala futura. |
| **Job Cards v2** | Spacious Design (32px padding) | Maior legibilidade e destaque visual para informações críticas. |

---

## 🏗️ Estrutura do Projeto

```mermaid
graph TD
    App[App.jsx] --> Context[JobContext.jsx]
    App --> Legal[Legal.jsx Orchestrator]
    Legal --> Seg[Security.jsx]
    Legal --> Priv[Privacy.jsx]
    Legal --> FAQ[FAQ.jsx]
    Home[Home.jsx] --> Search[SearchHub.jsx]
    Home --> Cards[JobCard v2 - Spacious]
    Detail[JobDetail.jsx] --> Apply[WhatsApp/E-mail]
```

---

## 📈 Roadmap de Evolução

### ✅ Concluído
- **v4.5** – Busca Inteligente com **interpretação de linguagem natural**
- **v4.8** – Snappy UX + Layout Ultra‑Wide
- **v4.9** – **Central de Transparência Modular** + Design de Cards Otimizado

### 🚀 Próximas Evoluções
- **Dashboard do Recrutador** – Centralização da gestão de vagas e métricas.
- **Navegação Geográfica** – Filtros avançados por cidades/estados (SEO Local).
- **Contas Opcionais** – Histórico persistente (opcional), mantendo o pilar Accountless.
- **Notificações Inteligentes** – Alertas personalizados por e-mail/WhatsApp.

---

## 📦 Como Rodar o Projeto Localmente

```bash
# 1️⃣ Instalar e Iniciar
git clone https://github.com/SEU-USUARIO/trampo-facil.git
cd trampo-facil
npm install
npm run dev
```

---

<div align="center">
  <p><b>Trampo Fácil</b> — Onde a tecnologia simplifica a sua próxima conquista.</p>
  <p><i>Foco em simplicidade. Paixão por resultados.</i></p>
</div>
