import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Legal</span>
          <span className="mx-2">/</span>
          <span className="text-secondary font-medium">Refund Policy</span>
        </nav>

        <div className="text-center py-16">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is currently under construction
          </p>
          <p className="text-gray-600 mb-8">
            We're working on creating a comprehensive refund policy for RefineCV. In the meantime,
            if you have any questions about refunds, please contact us.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View Pricing
            </Link>
            <Link
              to="/contact"
              className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
