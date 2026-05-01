# 🚀 Trampo Fácil — Descoberta Inteligente de Oportunidades

<div align="center">
  <img src="https://img.shields.io/badge/Versão-5.2%20Stable-gold?style=for-the-badge&logo=react" alt="Versão Stable" />
  <img src="https://img.shields.io/badge/Performance‑Snappy%20UX-brightgreen?style=for-the-badge&logo=fastapi" alt="Performance Snappy" />
  <img src="https://img.shields.io/badge/IA‑Gemini%201.5%20Flash-blue?style=for-the-badge&logo=google-gemini" alt="IA Gemini" />
  <img src="https://img.shields.io/badge/Checkout‑Stripe-635BFF?style=for-the-badge&logo=stripe" alt="Stripe Integration" />
  <br /><br />
  <h3>A ponte tecnológica definitiva entre talentos e empresas.</h3>
  <p>Uma plataforma <b>Accountless</b>, <b>AI-First</b> e com design <b>High-End</b>.</p>
</div>

---

## 📜 Manifesto & Filosofia de Produto

O **Trampo Fácil** nasceu para desafiar o status quo dos portais de emprego. 

A maioria das plataformas hoje falha em dois pontos críticos: **atrito de entrada** (cadastros longos) e **baixa qualidade de informação** (vagas mal escritas). Nossa filosofia resolve ambos:
- **Zero Friction:** O sistema é 100% accountless. Você não cria uma conta; você cria uma conexão.
- **AI-Enhanced Quality:** O motor de IA não é um enfeite; ele é um filtro de qualidade que eleva o nível dos anúncios na plataforma.

---

## 🛠️ Stack Técnica Detalhada: O "O quê", "Porquê" e "Quando"

| Tecnologia | Função | Justificativa Técnica (O Porquê) | Introduzido em |
|---|---|---|---|
| **React 19** | Core UI Library | Escolhido pela estabilidade do Concurrent Mode e suporte nativo a transições, permitindo uma interface "snappy" que nunca bloqueia a thread principal. | v0 |
| **Vite** | Build Tool | Substituiu o antigo CRA (Create React App) para garantir Hot Module Replacement (HMR) instantâneo e tempos de build otimizados para deploy contínuo. | v0 |
| **Supabase** | Backend & DB | Utilizamos o Postgres por sua robustez relacional. O Supabase foi escolhido pela camada de **Realtime (Websockets)**, que permite atualizar o feed de vagas sem refresh. | v0 |
| **Google Gemini 1.5 Flash** | Engine de IA | Selecionado em detrimento de modelos maiores pelo equilíbrio perfeito entre **latência baixa** (essencial para feedback em tempo real) e **janela de contexto**, permitindo analisar anúncios inteiros em milissegundos. | v2 |
| **Stripe SDK** | Pagamentos | Implementado para garantir segurança PCI-DSS e permitir planos de destaque (Premium/Urgente) com redirecionamento automático e webhooks de confirmação. | v5 |
| **Lucide-React** | Design System | Padronização de ícones vetoriais leves que facilitam a manutenção e garantem a estética "Tech Premium" (Glassmorphism). | v3 |

---

## 🧠 O Motor Trampo IA: Por que ele é superior?

Nosso motor de IA não é apenas um wrapper de chat. Ele é integrado profundamente ao `JobForm` e ao `SearchHub`:

1.  **Análise de Performance Multidimensional:** Ele não apenas corrige erros gramaticais; ele avalia o anúncio com base em **atratividade de benefícios**, **clareza de requisitos** e **indicadores de diversidade**.
2.  **Feedback em Tempo Real (Debounced):** Integrado via hooks customizados que analisam os dados enquanto o recrutador digita, fornecendo um "Score de Performance" instantâneo.
3.  **Contextualização Dinâmica:** O motor reconhece em qual página o usuário está (ex: FAQ, Contato, Publicação) e ajusta as saudações e sugestões via IA para maximizar a conversão.
4.  **Processamento Estruturado:** Diferente de IAs genéricas, o Trampo IA retorna dados em **JSON estruturado**, o que nos permite renderizar componentes visuais (como checklists de otimização) baseados na resposta da IA.

---

## 🛡️ Segurança de Dados: O Modelo Accountless

Como protegemos as empresas sem exigir senha? 
- **Token-Based Auth:** Cada vaga possui um `token_edicao` (UUID + Timestamp).
- **Transient Management:** O recrutador recebe um link administrativo único. A segurança reside no sigilo desse link, eliminando a vulnerabilidade de senhas fracas ou bancos de dados de credenciais vazados.
- **Local Persistence:** Para candidatos, os favoritos são salvos via `LocalStorage`, mantendo a privacidade total sem rastreamento no servidor.

---

## 📦 Como Rodar o Projeto

1.  **Preparação:**
    ```bash
    git clone https://github.com/lukaslimna1/TrampoFacil.git
    npm install
    ```
2.  **Variáveis de Ambiente (.env):**
    ```env
    VITE_SUPABASE_URL=seu_projeto_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    VITE_STRIPE_PUBLIC_KEY=sua_chave_stripe
    VITE_GEMINI_API_KEY=sua_chave_google_ai
    ```
3.  **Execução:**
    ```bash
    npm run dev
    ```

---

## ⏳ Histórico de Versões e Atualizações (Changelog)

Abaixo, registramos toda a jornada do Trampo Fácil, desde o primeiro commit até o estado de arte atual:

### 🌱 v0 (A Gênese) - Fevereiro/2026
- Definição do Core Stack (React + Vite + Supabase).
- Implementação do banco de dados inicial no Postgres.
- Criação da filosofia "Sem Login" e estrutura básica de rotas.

### 🏗️ v1 (Base Estrutural)
- Lançamento do sistema de **Tokens de Edição**.
- Implementação da busca por palavras-chave e filtros de localidade.
- Primeira versão do JobCard e JobDetail.

### 🧠 v2 (O Salto da Inteligência)
- **Marco:** Integração com **Google Gemini 1.5 Flash**.
- Lançamento do motor de análise de vagas (Recruiter Insights).
- Criação do Score de Performance dinâmico.

### 💎 v3 (Redesign Premium)
- Adoção da estética **Glassmorphism** em toda a plataforma.
- Lançamento do **Command Hub** unificado.
- Refatoração para React 19 e melhoria de performance no render.

### 🛡️ v4 (Escala e Transparência)
- Criação da central jurídica: Security, Privacy e Terms.
- Lançamento da página **Sobre Nós** com manifesto de marca.
- Módulo de FAQ dinâmico com sistema de busca inteligente.

### 💳 v5 (Monetização Enterprise)
- **v5.0:** Landing Page dedicada `/empresas` para venda de serviços.
- **v5.1:** Implementação de filtros "Em Alta" e tags de urgência.
- **v5.2 (Atual):** **Integração Completa Stripe**.
  - Checkout operacional e planos cumulativos.
  - Substituição da iconografia antiga pela **Gema Premium** e **Fogo Dourado**.
  - Novo **Payment Modal v2** utilizando React Portals para UI superior.

---

<div align="center">
  <p><b>Trampo Fácil</b> — Tecnologia que simplifica a sua próxima conquista.</p>
  <p><i>Focado em performance. Apaixonado por resultados.</i></p>
  <img src="https://img.shields.io/badge/Built%20with-Passion-red?style=flat-square" alt="Built with Passion" />
</div>


