/**
 * CORE: App Component
 * OBJETIVO: Ponto de montagem principal da aplicação e definição de rotas.
 * POR QUE: Centraliza a lógica de navegação, providers de estado (Jobs, Toast)
 * e o carregamento sob demanda (Lazy Loading) das páginas para performance.
 */
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ToastProvider } from './context/ToastContext';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const JobDetail = lazy(() => import('./pages/JobDetail').then(module => ({ default: module.JobDetail })));
const PublishJob = lazy(() => import('./pages/PublishJob').then(module => ({ default: module.PublishJob })));
const EditJob = lazy(() => import('./pages/EditJob').then(module => ({ default: module.EditJob })));
const Success = lazy(() => import('./pages/Success').then(module => ({ default: module.Success })));
const SavedJobs = lazy(() => import('./pages/SavedJobs').then(module => ({ default: module.SavedJobs })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal').then(module => ({ default: module.Legal })));
const ForCompanies = lazy(() => import('./pages/ForCompanies'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Global Loading Fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--primary-color)' }}>
    <div className="ai-dot" style={{ width: '12px', height: '12px' }}></div>
    <span style={{ marginLeft: '12px', fontWeight: '500' }}>Carregando interface...</span>
  </div>
);

function App() {
  return (
    <JobProvider>
      <ToastProvider>
        <Router>
          <div className="page-wrapper">
            <Header />
            <main className="main-content">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/vaga/:id" element={<JobDetail />} />
                  <Route path="/publicar" element={<PublishJob />} />
                  <Route path="/editar/:token" element={<EditJob />} />
                  <Route path="/editar" element={<EditJob />} />
                  <Route path="/sucesso" element={<Success />} />
                  <Route path="/salvos" element={<SavedJobs />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/legal/:section" element={<Legal />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/para-empresas" element={<ForCompanies />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
      </ToastProvider>
    </JobProvider>
  );
}

export default App;
