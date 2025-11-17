import { FileText, Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-2xl font-black">RefineCV</span>
            </div>
            <p className="text-gray-400 mb-6">
              Transform your resume with AI
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features/ats-analyzer" className="text-gray-400 hover:text-primary transition-colors">ATS Analyzer</Link></li>
              <li><Link to="/features/jd-matcher" className="text-gray-400 hover:text-primary transition-colors">JD CV Match Analyzer</Link></li>
              <li><a href="#cv-enhancer" className="text-gray-400 hover:text-primary transition-colors">Instant CV Enhancer</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-primary transition-colors">Dashboard</a></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><a href="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="/press" className="text-gray-400 hover:text-primary transition-colors">Press Kit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="/disclaimer" className="text-gray-400 hover:text-primary transition-colors">Disclaimer</a></li>
              <li><a href="/refund" className="text-gray-400 hover:text-primary transition-colors">Refund Policy</a></li>
              <li><a href="/copyrights" className="text-gray-400 hover:text-primary transition-colors">Copyrights</a></li>
              <li><a href="/sitemap" className="text-gray-400 hover:text-primary transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 RefineCV. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with ❤️ for Indian MBA students
          </p>
        </div>
      </div>
    </footer>
  );
}
