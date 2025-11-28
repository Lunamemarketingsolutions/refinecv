import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Pricing from './pages/Pricing';
import ATSAnalyzer from './pages/ATSAnalyzer';
import JDMatcher from './pages/JDMatcher';
import CVEnhancer from './pages/CVEnhancer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MyCVs from './pages/MyCVs';
import History from './pages/History';
import ATSUpload from './pages/ats-tool/ATSUpload';
import ATSAnalyzing from './pages/ats-tool/ATSAnalyzing';
import ATSResults from './pages/ats-tool/ATSResults';
import JDMatchUpload from './pages/jd-match-tool/JDMatchUpload';
import JDMatchAnalyzing from './pages/jd-match-tool/JDMatchAnalyzing';
import JDMatchResults from './pages/jd-match-tool/JDMatchResults';
import EnhancerUpload from './pages/cv-enhancer-tool/EnhancerUpload';
import EnhancerAnalyzing from './pages/cv-enhancer-tool/EnhancerAnalyzing';
import EnhancerEditor from './pages/cv-enhancer-tool/EnhancerEditor';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features/ats-analyzer" element={<ATSAnalyzer />} />
            <Route path="/features/jd-matcher" element={<JDMatcher />} />
            <Route path="/features/cv-enhancer" element={<CVEnhancer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-cvs" element={<MyCVs />} />
            <Route path="/history" element={<History />} />
            <Route path="/ats-tool" element={<ATSUpload />} />
            <Route path="/ats-tool/analyzing/:uploadId" element={<ATSAnalyzing />} />
            <Route path="/ats-tool/results/:analysisId" element={<ATSResults />} />
            <Route path="/jd-match-tool" element={<JDMatchUpload />} />
            <Route path="/jd-match-tool/analyzing/:matchId" element={<JDMatchAnalyzing />} />
            <Route path="/jd-match-tool/results/:matchId" element={<JDMatchResults />} />
            <Route path="/cv-enhancer" element={<EnhancerUpload />} />
            <Route path="/cv-enhancer/analyzing/:enhancementId" element={<EnhancerAnalyzing />} />
            <Route path="/cv-enhancer/editor/:enhancementId" element={<EnhancerEditor />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
