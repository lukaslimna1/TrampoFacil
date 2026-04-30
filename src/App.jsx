import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { Header } from './components/Header';
import { AIGreeting } from './components/AIGreeting';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { JobDetail } from './pages/JobDetail';
import { PublishJob } from './pages/PublishJob';
import { EditJob } from './pages/EditJob';
import { Success } from './pages/Success';
import { SavedJobs } from './pages/SavedJobs';
import { About } from './pages/About';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <JobProvider>
      <Router>
        <div className="page-wrapper">
          <Header />
          <div className="global-ai-bar">
            <div className="container">
              <AIGreeting variant="global" />
            </div>
          </div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vaga/:id" element={<JobDetail />} />
              <Route path="/publicar" element={<PublishJob />} />
              <Route path="/editar/:token" element={<EditJob />} />
              <Route path="/sucesso" element={<Success />} />
              <Route path="/salvos" element={<SavedJobs />} />
              <Route path="/sobre" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </Router>
    </JobProvider>
  );
}

export default App;
