import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/dashboard/:id" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;