import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Pricing from './pages/Pricing';
import ATSAnalyzer from './pages/ATSAnalyzer';
import JDMatcher from './pages/JDMatcher';
import CVEnhancer from './pages/CVEnhancer';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features/ats-analyzer" element={<ATSAnalyzer />} />
          <Route path="/features/jd-matcher" element={<JDMatcher />} />
          <Route path="/features/cv-enhancer" element={<CVEnhancer />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
