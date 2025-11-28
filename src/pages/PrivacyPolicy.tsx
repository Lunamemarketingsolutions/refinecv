import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, AlertTriangle, Info, Lock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrustBanner from '../components/privacy/TrustBanner';
import TableOfContents from '../components/privacy/TableOfContents';
import PolicySection from '../components/privacy/PolicySection';
import Callout from '../components/privacy/Callout';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'ai-processing', title: 'AI Processing & Data Usage' },
    { id: 'data-storage', title: 'Data Storage & Security' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'your-rights', title: 'Your Rights & Choices' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'international', title: 'International Users (GDPR)' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Legal</span>
          <span className="mx-2">/</span>
          <span className="text-secondary font-medium">Privacy Policy</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-4">Privacy Policy</h1>
          <div className="inline-block bg-gray-100 rounded-full px-4 py-2">
            <span className="text-sm font-medium text-gray-600">
              Last Updated: November 28, 2025
            </span>
          </div>
        </div>

        <TrustBanner />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <TableOfContents sections={sections} />

          <div className="flex-1 max-w-4xl">
            <PolicySection id="introduction" title="1. Introduction">
              <p>
                RefineCV ("we," "us," or "our") is an AI-powered CV intelligence platform designed
                for MBA students and professionals in India. We provide ATS analysis, job
                description matching, and CV enhancement services.
              </p>

              <p>This Privacy Policy explains:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>What information we collect when you use RefineCV</li>
                <li>How we use, store, and protect that information</li>
                <li>Your rights regarding your personal data</li>
                <li>How to contact us with privacy questions</li>
              </ul>

              <p>
                By using RefineCV, you agree to the practices described in this Privacy Policy. If
                you do not agree, please do not use our services.
              </p>

              <p className="font-medium">Effective Date: November 28, 2025</p>

              <Callout type="success" icon={CheckCircle} title="Core Principle">
                <p>
                  We collect only the minimum data necessary to provide our CV analysis services.
                  We do NOT sell your data to third parties or use it for marketing purposes
                  outside of RefineCV.
                </p>
              </Callout>
            </PolicySection>

            <PolicySection id="information-collected" title="2. Information We Collect">
              <h3 className="text-xl font-bold text-secondary mt-6 mb-3">
                2.1 Information You Provide Directly
              </h3>
              <p>When you use RefineCV, you may provide:</p>

              <div className="ml-4 space-y-4">
                <div>
                  <p className="font-semibold">a) Account Information:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Name (first and last)</li>
                    <li>Email address</li>
                    <li>Password (encrypted and hashed)</li>
                    <li>Phone number (optional)</li>
                    <li>LinkedIn profile URL (optional)</li>
                    <li>Educational institution (e.g., IIM Bangalore, ISB)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) CV/Resume Content:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personal details in your CV (name, contact info, address)</li>
                    <li>Work experience and employment history</li>
                    <li>Educational background and qualifications</li>
                    <li>Skills, certifications, and projects</li>
                    <li>Achievements and awards</li>
                    <li>Any other information included in your uploaded CV</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Job Description Content:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Job descriptions you paste or upload for matching analysis</li>
                    <li>Company names and role titles from job postings</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Payment Information:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Credit/debit card details (processed by Razorpay - we do NOT store card
                      numbers)
                    </li>
                    <li>Billing address</li>
                    <li>Transaction history</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) Communications:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Messages you send us via contact forms, email, or support chat</li>
                    <li>Feedback and survey responses</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-secondary mt-6 mb-3">
                2.2 Information We Collect Automatically
              </h3>
              <p>When you use RefineCV, we automatically collect:</p>

              <div className="ml-4 space-y-4">
                <div>
                  <p className="font-semibold">a) Usage Data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Pages you visit and features you use</li>
                    <li>Time spent on each page</li>
                    <li>Number of analyses performed (ATS, JD Match, CV Enhancer)</li>
                    <li>Dates and times of your visits</li>
                    <li>Referring URLs (how you found RefineCV)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Device Information:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version (Chrome, Firefox, Safari, etc.)</li>
                    <li>Operating system (Windows, macOS, Android, iOS)</li>
                    <li>Device type (desktop, mobile, tablet)</li>
                    <li>Screen resolution</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Cookies and Tracking:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Session cookies (to keep you logged in)</li>
                    <li>Preference cookies (to remember your settings)</li>
                    <li>Analytics cookies (to understand usage patterns)</li>
                  </ul>
                  <p className="text-sm mt-2">See Section 11 for detailed cookie information.</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-secondary mt-6 mb-3">
                2.3 Information We Do NOT Collect
              </h3>

              <Callout type="error" icon={XCircle} title="We Do NOT Collect:">
                <ul className="list-none space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Government IDs (Aadhaar, PAN, Passport numbers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Social Security Numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Financial account numbers (except payment processing via Razorpay)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Health information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Biometric data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Religious or political beliefs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Caste, ethnicity, or other sensitive personal characteristics</span>
                  </li>
                </ul>
                <p className="mt-3">
                  If your CV contains such information, we recommend removing it before uploading.
                </p>
              </Callout>
            </PolicySection>

            <PolicySection id="how-we-use" title="3. How We Use Your Information">
              <p>We use your information ONLY for the following purposes:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) To Provide Our Services:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Analyze your CV for ATS compatibility</li>
                    <li>Match your CV to job descriptions</li>
                    <li>Enhance CV bullet points with AI suggestions</li>
                    <li>Generate reports and recommendations</li>
                    <li>Store your CVs for future access</li>
                    <li>Process your subscription payments</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) To Improve Our Platform:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Understand which features are most useful</li>
                    <li>Identify bugs and technical issues</li>
                    <li>Improve our AI models (using anonymized, aggregated data only)</li>
                    <li>Develop new features based on user needs</li>
                    <li>Conduct internal research and analytics</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) To Communicate with You:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Send transactional emails (account creation, password resets, analysis
                      completion)
                    </li>
                    <li>Provide customer support</li>
                    <li>Send service updates and important announcements</li>
                    <li>Request feedback (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) To Ensure Security:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Detect and prevent fraud</li>
                    <li>Protect against unauthorized access</li>
                    <li>Monitor for suspicious activity</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) For Marketing (WITH YOUR CONSENT ONLY):</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Send promotional emails about RefineCV features and updates</li>
                    <li>Notify you about special offers or discounts</li>
                  </ul>
                  <p className="text-sm mt-2">
                    You can opt out of marketing emails at any time by clicking "Unsubscribe" in
                    any email or updating your preferences in Account Settings.
                  </p>
                </div>
              </div>

              <Callout type="info" icon={Shield} title="What We Will NEVER Do With Your Data:">
                <ul className="list-none space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Sell your CV or personal information to recruiters, companies, or data
                      brokers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Share your CV with employers without your explicit permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Use your CV content for advertising or marketing by third parties
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Train AI models on your personal data without anonymization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Share your data with social media platforms for ad targeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Rent or lease your contact information to other companies</span>
                  </li>
                </ul>
                <p className="mt-4 font-semibold">
                  Your data is YOUR data. We use it only to provide RefineCV services.
                </p>
              </Callout>
            </PolicySection>

            <PolicySection id="ai-processing" title="4. AI Processing & Data Usage">
              <p>RefineCV uses artificial intelligence to analyze and enhance your CV. Here's how it works:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) AI Service Providers:</p>
                  <p>We use OpenAI (ChatGPT API) and/or Anthropic (Claude API) to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Analyze CV text and structure</li>
                    <li>Extract keywords and match them to job descriptions</li>
                    <li>Generate enhanced bullet point suggestions</li>
                    <li>Identify formatting issues</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Data Sent to AI Providers:</p>
                  <p>
                    When you use our services, we send your CV content to these AI providers for
                    processing.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                    <p className="font-medium mb-2">Important Notes:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>AI providers process your data temporarily to generate results</li>
                      <li>
                        They do NOT retain your CV content for training their models (per our
                        agreements)
                      </li>
                      <li>Data transmission is encrypted (HTTPS/TLS)</li>
                      <li>We use enterprise AI APIs with data protection agreements</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="font-semibold">c) Anonymization for Improvement:</p>
                  <p>We may use anonymized, aggregated data to improve our services:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Example: "80% of users improved their ATS score after using CV Enhancer"
                    </li>
                    <li>
                      Example: "Common weak verbs include 'worked on' and 'helped with'"
                    </li>
                  </ul>
                  <p className="text-sm mt-2">
                    Anonymized means: No names, emails, or personally identifiable information.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">d) Your Control:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You can delete your CV data at any time (see Section 7)</li>
                    <li>Deletion requests are processed within 30 days</li>
                    <li>
                      Once deleted, your data is permanently removed from our systems and AI
                      processing queues
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mt-6">
                <p className="font-semibold mb-2">AI Data Flow:</p>
                <div className="text-sm space-y-1 font-mono">
                  <p>[Your CV] → [RefineCV Server - Encrypted]</p>
                  <p className="ml-8">↓</p>
                  <p className="ml-4">[AI API - Temporary Processing]</p>
                  <p className="ml-8">↓</p>
                  <p className="ml-4">[Results Back to You]</p>
                  <p className="ml-8">↓</p>
                  <p className="ml-4">[NOT stored by AI provider]</p>
                </div>
              </div>
            </PolicySection>

            <PolicySection id="data-storage" title="5. Data Storage & Security">
              <p>We take data security seriously. Here's how we protect your information:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) Encryption:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Data in Transit:</strong> All data transmitted between your device
                      and our servers is encrypted using TLS 1.3 (bank-level encryption)
                    </li>
                    <li>
                      <strong>Data at Rest:</strong> Your CV files and personal information are
                      encrypted in our databases using AES-256 encryption
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Secure Infrastructure:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>We use AWS or Google Cloud Platform for hosting</li>
                    <li>Servers are located in secure data centers with 24/7 monitoring</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Automatic backups to prevent data loss</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Access Controls:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Only authorized RefineCV employees have access to user data</li>
                    <li>Access is logged and monitored</li>
                    <li>Two-factor authentication (2FA) for admin accounts</li>
                    <li>Role-based access control (RBAC)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Password Security:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Your password is hashed using bcrypt (one-way encryption)</li>
                    <li>We cannot see your password</li>
                    <li>We never email you your password (only password reset links)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) Payment Security:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Credit card information is processed by Razorpay (PCI DSS compliant)</li>
                    <li>We do NOT store your full card number or CVV</li>
                    <li>Only last 4 digits are stored for transaction records</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">f) Vulnerability Management:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Regular software updates and security patches</li>
                    <li>Bug bounty program (coming soon)</li>
                    <li>Incident response plan in case of data breaches</li>
                  </ul>
                </div>
              </div>

              <Callout type="success" icon={Lock} title="Our Security Promise:">
                <p>
                  While no system is 100% secure, we implement industry-standard security measures
                  to protect your data. In the unlikely event of a data breach affecting your
                  personal information, we will:
                </p>
                <ol className="list-decimal pl-6 space-y-1 mt-2">
                  <li>Notify you within 72 hours</li>
                  <li>Explain what data was affected</li>
                  <li>Provide steps you can take to protect yourself</li>
                  <li>Report the breach to relevant authorities as required by law</li>
                </ol>
                <p className="mt-3 font-semibold">Your security is our responsibility.</p>
              </Callout>
            </PolicySection>

            <PolicySection id="third-party" title="6. Third-Party Services">
              <p>RefineCV integrates with the following third-party services:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) AI Processing:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>OpenAI (ChatGPT API) - for CV analysis and enhancement</li>
                    <li>Anthropic (Claude API) - for CV analysis and enhancement</li>
                    <li>Data Use: CV content sent for temporary processing only</li>
                    <li>Data Retention: Not retained by AI providers (per our agreements)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Payment Processing:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Razorpay - for credit/debit card payments and subscriptions</li>
                    <li>Data Shared: Name, email, billing address, payment amount</li>
                    <li>Data Use: Payment processing only</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Analytics:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Google Analytics - to understand website usage</li>
                    <li>Data Shared: Anonymized usage data (pages visited, time on site)</li>
                    <li>Data Use: Website optimization and feature improvement</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Email Services:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>SendGrid or AWS SES - for transactional and marketing emails</li>
                    <li>Data Shared: Email address, name</li>
                    <li>
                      Data Use: Sending emails only (welcome emails, analysis completion, etc.)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) Authentication (Optional):</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Google OAuth - for "Sign in with Google"</li>
                    <li>LinkedIn OAuth - for "Sign in with LinkedIn"</li>
                    <li>Data Shared: Name, email, profile photo (with your permission)</li>
                  </ul>
                </div>
              </div>

              <Callout type="warning" icon={AlertTriangle} title="Third-Party Links:">
                <p>
                  RefineCV may contain links to external websites (e.g., LinkedIn, Naukri, company
                  career pages). We are NOT responsible for the privacy practices of these external
                  sites. Please review their privacy policies before providing any information.
                </p>
              </Callout>
            </PolicySection>

            <PolicySection id="your-rights" title="7. Your Rights & Choices">
              <p>You have full control over your data. Here are your rights:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) Access Your Data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>View all personal information we have about you</li>
                    <li>Download your account data and CV history</li>
                    <li>
                      <em>How: Go to Account Settings → Privacy → Download My Data</em>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Correct Your Data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Update your name, email, phone number, or other account details</li>
                    <li>
                      <em>How: Go to Account Settings → Profile → Edit Information</em>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Delete Your Data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Request permanent deletion of your account and all associated data</li>
                    <li>
                      This includes: CVs, analysis reports, account information, usage history
                    </li>
                    <li>Timeframe: Completed within 30 days of request</li>
                    <li>
                      <em>How: Go to Account Settings → Privacy → Delete Account</em>
                    </li>
                    <li>
                      <em>Or email: support.refinecv@gmail.com with subject "Data Deletion Request"</em>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Export Your Data (Data Portability):</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Download all your CVs, analysis reports, and account data in machine-readable
                      format (JSON, CSV)
                    </li>
                    <li>
                      <em>How: Account Settings → Privacy → Export Data</em>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) Opt-Out of Marketing Emails:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Unsubscribe from promotional emails</li>
                    <li>
                      You'll still receive important transactional emails (password resets, analysis
                      completion)
                    </li>
                    <li>
                      <em>How: Click "Unsubscribe" in any marketing email OR Account Settings → Notifications</em>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">f) Disable Cookies:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Control which cookies you allow</li>
                    <li>
                      <em>How: Use our Cookie Consent Manager (banner on first visit) OR browser settings</em>
                    </li>
                  </ul>
                </div>
              </div>

              <Callout type="info" icon={Mail} title="Contact Our Privacy Team:">
                <p className="font-semibold mb-2">Email: support.refinecv@gmail.com</p>
                <p className="mb-2">
                  Subject Line: [Your Request - e.g., "Data Deletion Request", "Access My Data"]
                </p>
                <p className="font-medium">Include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your full name</li>
                  <li>Email address associated with your account</li>
                  <li>Specific request (delete account, download data, etc.)</li>
                </ul>
                <p className="mt-3">
                  <strong>Response Time:</strong> We respond within 7 business days and complete
                  requests within 30 days.
                </p>
              </Callout>
            </PolicySection>

            <PolicySection id="data-retention" title="8. Data Retention">
              <p>We keep your data only as long as necessary to provide our services:</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) Active Accounts:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>CV files: Stored until you delete them or close your account</li>
                    <li>
                      Analysis reports: Stored for 1 year, then automatically deleted (unless you
                      save them)
                    </li>
                    <li>Account information: Stored as long as your account is active</li>
                    <li>Usage logs: Stored for 90 days</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) Inactive Accounts (Free Tier):</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>If no login for 12 months: Account and data automatically deleted</li>
                    <li>
                      We send 3 reminder emails before deletion (at 10, 11, and 11.5 months)
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) Closed Accounts:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Data deleted within 30 days of account closure request</li>
                    <li>Backups purged within 90 days (for disaster recovery)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Legal Requirements:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Transaction records: Kept for 7 years (Indian tax law requirement)</li>
                    <li>Support tickets: Kept for 2 years (customer service purposes)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">e) Anonymized Data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Aggregated, anonymized analytics data may be retained indefinitely</li>
                    <li>Cannot be traced back to you</li>
                  </ul>
                </div>
              </div>
            </PolicySection>

            <PolicySection id="international" title="9. International Users & GDPR Compliance">
              <p>
                RefineCV primarily serves users in India, but we comply with international privacy
                laws:
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">a) GDPR (European Union):</p>
                  <p>If you're located in the EU, you have additional rights under GDPR:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Right to be Forgotten: Request permanent deletion of your data</li>
                    <li>
                      Right to Data Portability: Export your data in machine-readable format
                    </li>
                    <li>Right to Object: Object to data processing for marketing purposes</li>
                    <li>Right to Restrict Processing: Limit how we use your data</li>
                    <li>
                      Right to Lodge a Complaint: Contact your local data protection authority
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">b) CCPA (California, USA):</p>
                  <p>If you're a California resident:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Right to Know: Request details about what personal information we collect</li>
                    <li>Right to Delete: Request deletion of your personal information</li>
                    <li>Right to Opt-Out: Opt out of data "sales" (note: we do NOT sell data)</li>
                    <li>
                      Non-Discrimination: We won't discriminate against you for exercising your
                      rights
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">c) DPDPA (India):</p>
                  <p>We comply with India's Digital Personal Data Protection Act (DPDPA):</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Data Localization: User data may be stored in Indian data centers or AWS
                      Mumbai region
                    </li>
                    <li>Consent: Clear consent obtained for data collection and processing</li>
                    <li>Data Fiduciary: RefineCV acts as a Data Fiduciary under DPDPA</li>
                    <li>Grievance Officer: Appointed (contact details in Section 13)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">d) Data Transfers:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Your data may be processed by AI providers (OpenAI, Anthropic) with servers in
                      the US
                    </li>
                    <li>
                      We use Standard Contractual Clauses (SCCs) to ensure GDPR-compliant data
                      transfers
                    </li>
                    <li>All transfers are encrypted and subject to data protection agreements</li>
                  </ul>
                </div>
              </div>
            </PolicySection>

            <PolicySection id="children" title="10. Children's Privacy">
              <p>RefineCV is intended for adults and students aged 16 and above.</p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Age Requirements:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Minimum Age: 16 years old</li>
                    <li>Users under 16: Not permitted to create accounts or use our services</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Parental Notice:</p>
                  <p>
                    We do not knowingly collect personal information from children under 16. If you
                    believe your child under 16 has created an account, please contact us
                    immediately at support.refinecv@gmail.com, and we will delete the account within 7 days.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Educational Institutions:</p>
                  <p>
                    If you're a school administrator or professor using RefineCV for students under
                    18, you must:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Obtain parental consent before students create accounts</li>
                    <li>Ensure students understand our Privacy Policy</li>
                    <li>Supervise student usage</li>
                  </ul>
                </div>
              </div>
            </PolicySection>

            <PolicySection id="cookies" title="11. Cookies & Tracking Technologies">
              <p>
                RefineCV uses cookies and similar technologies to improve your experience:
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold">What Are Cookies?</p>
                  <p>
                    Cookies are small text files stored on your device that help websites remember
                    your preferences.
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Types of Cookies We Use:</p>

                  <div className="ml-4 space-y-3">
                    <div>
                      <p className="font-medium">a) Essential Cookies (Always Active):</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Session cookies: Keep you logged in</li>
                        <li>Security cookies: Prevent fraud and unauthorized access</li>
                        <li>
                          These cannot be disabled as they're necessary for the site to function
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">b) Functional Cookies (Can be Disabled):</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Preference cookies: Remember your settings (language, theme)</li>
                        <li>Recent analysis history: Quick access to your last 5 analyses</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">c) Analytics Cookies (Can be Disabled):</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Google Analytics: Track website usage (page views, bounce rate)</li>
                        <li>Helps us understand which features are popular</li>
                        <li>Data is anonymized</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium">d) Marketing Cookies (Can be Disabled):</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Facebook Pixel: Track conversions from ads (if you clicked a Facebook ad)
                        </li>
                        <li>Google Ads: Track conversions from Google ads</li>
                        <li>Used only if you clicked an ad to reach RefineCV</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold">Managing Cookies:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Cookie Consent Manager: Banner on first visit lets you accept/reject cookies
                    </li>
                    <li>Browser Settings: Disable cookies in Chrome, Firefox, Safari settings</li>
                    <li>Opt-Out Tools: Google Analytics Opt-Out Browser Extension</li>
                  </ul>
                  <p className="text-sm mt-2">
                    Note: Disabling essential cookies may prevent you from using RefineCV.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Cookie Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Purpose
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Duration
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">auth_token</td>
                      <td className="border border-gray-300 px-4 py-2">Keep you logged in</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Essential</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">csrf_token</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Security (prevent attacks)
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                      <td className="border border-gray-300 px-4 py-2">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">user_prefs</td>
                      <td className="border border-gray-300 px-4 py-2">Remember settings</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                      <td className="border border-gray-300 px-4 py-2">Functional</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">_ga</td>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                      <td className="border border-gray-300 px-4 py-2">Analytics</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_fbp</td>
                      <td className="border border-gray-300 px-4 py-2">Facebook Pixel</td>
                      <td className="border border-gray-300 px-4 py-2">90 days</td>
                      <td className="border border-gray-300 px-4 py-2">Marketing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </PolicySection>

            <PolicySection id="changes" title="12. Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>New features or services</li>
                <li>Changes in privacy laws</li>
                <li>Improvements to our security practices</li>
                <li>User feedback</li>
              </ul>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-semibold">When We Make Changes:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Material Changes: We'll email you 30 days before changes take effect
                    </li>
                    <li>
                      Minor Changes: We'll update the "Last Updated" date at the top of this page
                    </li>
                    <li>
                      Your Options: If you disagree with changes, you can delete your account before
                      they take effect
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Version History:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>v1.0 - November 28, 2025: Initial privacy policy published</li>
                    <li className="text-gray-500">[Future versions will be listed here]</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4">
                Continued use of RefineCV after changes indicates your acceptance of the updated
                Privacy Policy.
              </p>
            </PolicySection>

            <PolicySection id="contact" title="13. Contact Us">
              <p>Questions, concerns, or requests about your privacy? We're here to help.</p>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="font-semibold">Privacy Team:</p>
                  <ul className="list-none space-y-1">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:support.refinecv@gmail.com"
                        className="text-primary hover:underline"
                      >
                        support.refinecv@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong>Response Time:</strong> Within 7 business days
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">General Inquiries:</p>
                  <ul className="list-none space-y-1">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:support.refinecv@gmail.com"
                        className="text-primary hover:underline"
                      >
                        support.refinecv@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong>Website:</strong>{' '}
                      <Link to="/contact" className="text-primary hover:underline">
                        www.refinecv.com/contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">Grievance Officer (India DPDPA):</p>
                  <ul className="list-none space-y-1">
                    <li>
                      <strong>Name:</strong> RefineCV Support Team
                    </li>
                    <li>
                      <strong>Email:</strong>{' '}
                      <a
                        href="mailto:support.refinecv@gmail.com"
                        className="text-primary hover:underline"
                      >
                        support.refinecv@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong>Phone:</strong> +91 9265110454
                    </li>
                    <li>
                      <strong>Address:</strong> Bangalore, India
                    </li>
                  </ul>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                We take all privacy inquiries seriously and respond promptly.
              </p>
            </PolicySection>

            <div className="bg-primary text-white rounded-2xl p-8 lg:p-12 mt-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Enhance Your CV Securely?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Your data is safe with RefineCV. We're committed to protecting your privacy while
                helping you land your dream job.
              </p>
              <Link
                to="/signup"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors mb-4"
              >
                Get Started - Free →
              </Link>
              <div>
                <a
                  href="mailto:support.refinecv@gmail.com"
                  className="text-white hover:underline opacity-90"
                >
                  Have Questions? Contact Our Privacy Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
