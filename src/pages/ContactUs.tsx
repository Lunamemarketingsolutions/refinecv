import { useState } from 'react';
import {
  Mail, Phone, Clock, Book, Video, MessageCircle, FileText,
  Send, CheckCircle, MapPin, Globe, Shield, Award,
  ChevronDown, MessageSquare, Calendar, Users
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    subject: '',
    message: '',
    agreeToPrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const quickContacts = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'refinecvhelp@gmail.com',
      href: 'mailto:refinecvhelp@gmail.com',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+91 92651 10454',
      href: 'tel:+919265110454',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      href: null,
    },
  ];

  const quickHelp = [
    { icon: Book, text: 'Knowledge Base', href: '#' },
    { icon: Video, text: 'Video Tutorials', href: '#' },
    { icon: MessageCircle, text: 'FAQs', href: '#faq' },
    { icon: FileText, text: 'Getting Started Guide', href: '#' },
  ];

  const alternativeMethods = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Support',
      description: 'Get quick responses on WhatsApp for urgent queries',
      buttonText: 'Message on WhatsApp',
      buttonColor: 'bg-success',
      href: 'https://wa.me/919265110454?text=Hi%20RefineCV%20Team',
    },
    {
      icon: Calendar,
      title: 'Schedule a Call',
      description: 'Book a 15-minute slot with our team to discuss your needs',
      buttonText: 'Book a Call',
      buttonColor: 'bg-primary',
      href: '#',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us in real-time during business hours',
      buttonText: 'Start Chat',
      buttonColor: 'bg-primary',
      note: 'Available Mon-Sat, 9 AM - 6 PM IST',
      href: '#',
    },
    {
      icon: Users,
      title: 'Join Our Community',
      description: 'Connect with other MBA students and get peer support',
      buttonText: 'Join Forum',
      buttonColor: 'border-2 border-primary text-primary bg-white',
      href: '#',
    },
  ];

  const faqs = [
    {
      question: 'What are your support hours?',
      answer: 'Our support team is available Monday to Saturday, 9:00 AM to 6:00 PM IST. We respond to all inquiries within 24 hours, even on weekends and holidays.',
    },
    {
      question: 'How quickly will I get a response?',
      answer: 'We typically respond within 4-6 hours during business hours, and within 24 hours for messages received outside business hours or on Sundays.',
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! You can call us at +91 92651 10454 during business hours (Mon-Sat, 9 AM - 6 PM IST). For technical issues, we may ask you to email us screenshots for faster resolution.',
    },
    {
      question: 'Can I get a demo before signing up?',
      answer: 'Absolutely! Click the "Try a Demo" button on our homepage, or email us at refinecvhelp@gmail.com to schedule a personalized 15-minute demo with our team.',
    },
    {
      question: 'I\'m having technical issues. How do I report them?',
      answer: 'Please email refinecvhelp@gmail.com with: (1) A description of the issue, (2) Screenshots if applicable, (3) Your browser and device type. We\'ll investigate and respond within 4 hours.',
    },
    {
      question: 'Do you offer student discounts or bulk pricing?',
      answer: 'Yes! We offer special pricing for college groups, placement cells, and student clubs. Contact Shweta at refinecvhelp@gmail.com to discuss custom plans.',
    },
    {
      question: 'How can I request a new feature?',
      answer: 'We love feedback! Use the contact form above and select "Feature Request" as the subject, or email us directly. We review all suggestions monthly and prioritize based on user demand.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes. We offer a 7-day money-back guarantee for Premium subscriptions. If you\'re not satisfied, email us within 7 days of purchase for a full refund. See our Refund Policy for details.',
    },
  ];

  const trustSignals = [
    {
      icon: Shield,
      title: 'GDPR Compliant',
      subtitle: 'Your data is secure',
    },
    {
      icon: Clock,
      title: '24-Hour Response',
      subtitle: 'We reply fast',
    },
    {
      icon: Award,
      title: '99% Satisfaction',
      subtitle: 'Based on user feedback',
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      college: '',
      subject: '',
      message: '',
      agreeToPrivacy: false,
    });
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/15 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                  We're Here to Help
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary mb-6">
                Get in Touch
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about RefineCV? Need help with your CV? Our team responds within 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {quickContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <contact.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <div className="text-sm font-bold text-secondary mb-2">
                    {contact.label}
                  </div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="text-primary font-semibold hover:underline"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <div className="text-primary font-semibold">{contact.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content - Form + Contact Info */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left Column - Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg">
                  {!isSubmitted ? (
                    <>
                      <h2 className="text-3xl font-black text-secondary mb-3">
                        Send Us a Message
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-semibold text-secondary mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.fullName ? 'border-error' : 'border-gray-300'
                            }`}
                          />
                          {errors.fullName && (
                            <p className="text-error text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.email ? 'border-error' : 'border-gray-300'
                            }`}
                          />
                          {errors.email && (
                            <p className="text-error text-sm mt-1">{errors.email}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-secondary mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 XXXXX XXXXX"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.phone ? 'border-error' : 'border-gray-300'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-error text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>

                        {/* College */}
                        <div>
                          <label htmlFor="college" className="block text-sm font-semibold text-secondary mb-2">
                            College/University
                          </label>
                          <input
                            type="text"
                            id="college"
                            name="college"
                            value={formData.college}
                            onChange={handleInputChange}
                            placeholder="E.g., IIM Ahmedabad, XLRI, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>

                        {/* Subject */}
                        <div>
                          <label htmlFor="subject" className="block text-sm font-semibold text-secondary mb-2">
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                              errors.subject ? 'border-error' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select a subject...</option>
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Support</option>
                            <option value="billing">Billing & Pricing</option>
                            <option value="feature">Feature Request</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="press">Press & Media</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.subject && (
                            <p className="text-error text-sm mt-1">{errors.subject}</p>
                          )}
                        </div>

                        {/* Message */}
                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-secondary mb-2">
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us how we can help you..."
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y ${
                              errors.message ? 'border-error' : 'border-gray-300'
                            }`}
                          />
                          {errors.message && (
                            <p className="text-error text-sm mt-1">{errors.message}</p>
                          )}
                        </div>

                        {/* Privacy Checkbox */}
                        <div>
                          <label className="flex items-start">
                            <input
                              type="checkbox"
                              name="agreeToPrivacy"
                              checked={formData.agreeToPrivacy}
                              onChange={handleInputChange}
                              className="mt-1 mr-3 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600">
                              I agree to RefineCV's{' '}
                              <a href="#" className="text-primary hover:underline">
                                Privacy Policy
                              </a>{' '}
                              and{' '}
                              <a href="#" className="text-primary hover:underline">
                                Terms of Service
                              </a>
                            </span>
                          </label>
                          {errors.agreeToPrivacy && (
                            <p className="text-error text-sm mt-1">{errors.agreeToPrivacy}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
                      <h3 className="text-3xl font-black text-success mb-4">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-lg text-gray-600 mb-8">
                        Thank you for reaching out. Shweta will get back to you within 24 hours at{' '}
                        <span className="font-semibold text-primary">{formData.email}</span>.
                      </p>
                      <button
                        onClick={resetForm}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                      >
                        Send Another Message
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Direct Contact Information */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-secondary mb-2">
                    Contact Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Prefer direct contact? Reach out to our team.
                  </p>

                  <div className="mb-6 text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                      SK
                    </div>
                    <div className="text-xl font-bold text-secondary">Shweta</div>
                    <div className="text-sm text-gray-600">Head of HR</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs uppercase text-gray-500 mb-1">Email</div>
                        <a
                          href="mailto:refinecvhelp@gmail.com"
                          className="text-primary hover:underline font-medium"
                        >
                          refinecvhelp@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs uppercase text-gray-500 mb-1">Phone</div>
                        <a
                          href="tel:+919265110454"
                          className="text-primary hover:underline font-medium"
                        >
                          +91 92651 10454
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs uppercase text-gray-500 mb-1">Support Hours</div>
                        <div className="text-secondary font-medium">Monday - Saturday</div>
                        <div className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Help Resources */}
                <div className="bg-primary/5 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-secondary mb-2">
                    Need Immediate Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Check out these resources for instant answers.
                  </p>

                  <div className="space-y-3">
                    {quickHelp.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium group-hover:underline">{item.text}</span>
                        <span className="ml-auto">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-2">Follow Us</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Stay updated with tips, features, and success stories.
                  </p>

                  <div className="flex gap-4 justify-center">
                    {['linkedin', 'twitter', 'instagram', 'youtube'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:scale-110 transition-all"
                        aria-label={social}
                      >
                        <div className="w-6 h-6"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Contact Methods */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Other Ways to Reach Us
              </h2>
              <p className="text-xl text-gray-600">
                Choose the method that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {alternativeMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <method.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-secondary mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{method.description}</p>
                  <a
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`inline-block px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 ${method.buttonColor}`}
                  >
                    {method.buttonText}
                  </a>
                  {method.note && (
                    <p className="text-sm text-gray-500 mt-4">{method.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-primary/5 rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Globe className="w-24 h-24 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    Remote-First Team
                  </h3>
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-secondary mb-6">
                  We're a Remote-First Team
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our team works across 7 countries, providing 24/7 support coverage to help you succeed.
                </p>
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-secondary font-semibold mb-2">
                        Distributed team across India, USA, Singapore, Germany, UAE, Canada, and Australia
                      </p>
                      <p className="text-gray-600">
                        This allows us to provide round-the-clock support for our global MBA student community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 lg:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Find quick answers to common questions
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-secondary pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="#"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
              >
                Didn't find your answer? Contact us →
              </a>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-black text-secondary text-center mb-12">
              Trusted by 5,000+ MBA Students
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {trustSignals.map((signal, index) => (
                <div key={index} className="text-center">
                  <signal.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-xl font-bold text-secondary mb-1">
                    {signal.title}
                  </div>
                  <div className="text-gray-600">{signal.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-32 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              We're here to help. Reach out and our team will get back to you within 24 hours.
            </p>
            <button className="bg-white text-primary px-12 py-4 rounded-lg text-lg font-bold hover:scale-105 hover:shadow-2xl transition-all mb-6">
              Get Started Free
            </button>
            <p className="text-white/80 text-sm">
              Or email us at refinecvhelp@gmail.com
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
