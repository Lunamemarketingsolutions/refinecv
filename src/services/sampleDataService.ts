import { supabase } from '../lib/supabase';

const SAMPLE_CV_TEXT = `
Arjun Mehta
arjun.mehta@email.com | +91 98765 43210 | linkedin.com/in/arjunmehta

EDUCATION
Master of Business Administration
IIM Ahmedabad | 2022 - 2024 | GPA: 3.8/4.0

Bachelor of Technology in Computer Science
IIT Delhi | 2018 - 2022 | GPA: 3.6/4.0

WORK EXPERIENCE
Product Manager | TechCorp India | June 2022 - Present
• Led product strategy for B2B SaaS platform serving 500+ enterprise clients
• Increased user engagement by 45% through data-driven feature prioritization
• Managed cross-functional team of 8 engineers and 3 designers
• Launched 3 major features resulting in $2M additional ARR

Business Analyst Intern | Consulting Firm | May 2021 - July 2021
• Conducted market research for retail client expansion into tier-2 cities
• Built financial models projecting 5-year revenue growth
• Presented insights to C-suite executives

PROJECTS
E-commerce Analytics Platform
• Developed Python-based dashboard analyzing customer behavior patterns
• Processed 1M+ transactions using pandas and SQL
• Improved conversion rate predictions by 25% using machine learning

SKILLS
Technical: Python, SQL, React, Tableau, Excel, R
Product: A/B Testing, User Research, Roadmap Planning, Agile
Business: Financial Modeling, Market Analysis, Strategy Development
`;

const SAMPLE_JD_TEXT = `
Product Manager - Google
Mountain View, CA

About the Role:
We're looking for a Product Manager to lead our machine learning initiatives and drive innovation in our consumer products. You'll work with cross-functional teams to define product strategy, conduct user research, and deliver impactful features.

Responsibilities:
• Define product roadmap based on user research and business goals
• Lead cross-functional teams including engineering, design, and data science
• Apply machine learning insights to improve product recommendations
• Conduct A/B tests to validate product hypotheses
• Analyze product metrics using SQL and present to leadership
• Manage stakeholder relationships and communicate product vision

Requirements:
• 2+ years of experience in product management or related field
• Strong proficiency in Python and SQL for data analysis
• Experience with A/B testing and statistical analysis
• Proven track record of shipping successful products
• Excellent stakeholder management and communication skills
• Understanding of machine learning concepts
• MBA from top-tier institution preferred
`;

export async function createATSSample(userId: string): Promise<string> {
  try {
    const { data: cvUpload, error: cvError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: 'Sample_MBA_Resume.pdf',
        file_path: `${userId}/sample_cv.pdf`,
        file_size: 245760,
        extracted_text: SAMPLE_CV_TEXT,
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (cvError || !cvUpload) {
      throw new Error('Failed to create sample CV upload');
    }

    const { data: analysis, error: analysisError } = await supabase
      .from('ats_analyses')
      .insert({
        user_id: userId,
        cv_upload_id: cvUpload.id,
        overall_score: 78,
        is_sample: true,
        critical_issues: [
          {
            title: 'Contact Information Not Detected',
            impact: 'Critical',
            impactScore: -15,
            problem: 'Name, phone, and LinkedIn appear in header/footer which most ATS systems cannot parse',
            location: 'Header (top of page)',
            fix: 'Move all contact info to main body at top of first page',
            example: 'Place "Arjun Mehta | arjun.mehta@email.com | +91 98765 43210" as first line in document body',
          },
          {
            title: 'Skills Section Not Parsed Correctly',
            impact: 'Critical',
            impactScore: -10,
            problem: 'Skills formatted as visual bars/charts which ATS cannot read',
            location: 'Skills section',
            fix: 'Convert to plain text list format',
            example: 'Python: Advanced (5 years)\nSQL: Intermediate (3 years)',
          },
        ],
        warnings: [
          {
            title: 'Two-Column Table Layout Detected',
            impact: 'Medium',
            impactScore: -8,
            problem: 'ATS may read left-to-right across columns, mixing content incorrectly',
            location: 'Work Experience section',
            fix: 'Use single-column layout with clear section breaks',
            example: 'Remove table structure, use standard heading + bullet format',
          },
          {
            title: 'Inconsistent Date Formatting',
            impact: 'Low',
            impactScore: -5,
            problem: 'Mixed formats: "June 2022", "2022-Present", "05/2021"',
            location: 'Multiple sections',
            fix: 'Use consistent format throughout',
            example: 'June 2022 - Present (or) 06/2022 - Present',
          },
        ],
        passed_checks: [
          'Work Experience section detected and parsed correctly',
          'Education section identified with degree, institution, and dates',
          'PDF format is ATS-compatible',
          'No special characters or unusual fonts detected',
          'Project section parsed successfully',
        ],
        ats_text_extraction: SAMPLE_CV_TEXT.substring(0, 800) + '...',
        section_scores: {
          contact: 40,
          experience: 95,
          education: 90,
          skills: 60,
          projects: 85,
        },
      })
      .select()
      .maybeSingle();

    if (analysisError || !analysis) {
      throw new Error('Failed to create sample analysis');
    }

    return analysis.id;
  } catch (error) {
    console.error('Error creating ATS sample:', error);
    throw error;
  }
}

export async function createJDMatchSample(userId: string): Promise<string> {
  try {
    const { data: cvUpload, error: cvError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: 'Sample_MBA_Resume.pdf',
        file_path: `${userId}/sample_cv.pdf`,
        file_size: 245760,
        extracted_text: SAMPLE_CV_TEXT,
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (cvError || !cvUpload) {
      throw new Error('Failed to create sample CV upload');
    }

    const { data: match, error: matchError } = await supabase
      .from('jd_matches')
      .insert({
        user_id: userId,
        cv_upload_id: cvUpload.id,
        jd_text: SAMPLE_JD_TEXT,
        jd_source: 'paste',
        jd_metadata: {
          wordCount: 482,
          detectedRole: 'Product Management',
          detectedCompany: 'Google',
          requirements: 25,
        },
        overall_score: 78,
        is_sample: true,
        matched_keywords: [
          { name: 'Python', jdFrequency: 5, cvFrequency: 3, status: 'matched', category: 'technical' },
          { name: 'Team Leadership', jdFrequency: 3, cvFrequency: 2, status: 'matched', category: 'soft-skill' },
          { name: 'Product Analytics', jdFrequency: 4, cvFrequency: 1, status: 'under-represented', category: 'domain' },
          { name: 'React', jdFrequency: 3, cvFrequency: 2, status: 'matched', category: 'technical' },
          { name: 'Data Analysis', jdFrequency: 2, cvFrequency: 3, status: 'matched', category: 'domain' },
          { name: 'User Research', jdFrequency: 3, cvFrequency: 1, status: 'under-represented', category: 'domain' },
        ],
        partial_matches: [
          {
            cvText: 'Built financial models',
            jdText: 'financial modeling experience',
            recommendation: 'Expand on financial modeling experience and quantify models built',
          },
          {
            cvText: 'cross-functional team',
            jdText: 'lead cross-functional teams',
            recommendation: 'Emphasize leadership role in cross-functional collaboration',
          },
        ],
        missing_keywords: [
          { name: 'Machine Learning', jdFrequency: 4, priority: 'CRITICAL', impact: 6, suggestion: 'Highlight ML project from experience' },
          { name: 'SQL', jdFrequency: 5, priority: 'CRITICAL', impact: 5, suggestion: 'Emphasize SQL usage in analytics work' },
          { name: 'A/B Testing', jdFrequency: 3, priority: 'HIGH', impact: 4, suggestion: 'Add A/B testing examples from product work' },
          { name: 'Stakeholder Management', jdFrequency: 3, priority: 'MEDIUM', impact: 3, suggestion: 'Detail stakeholder interactions' },
        ],
        strengths: [
          {
            area: 'Product Management Experience',
            details: 'Strong PM background at TechCorp with clear metrics and impact',
            keywords: ['product strategy', 'user engagement', 'cross-functional team'],
          },
          {
            area: 'Technical Skills',
            details: 'Python and data analysis skills align well with role requirements',
            keywords: ['Python', 'data analysis', 'dashboard'],
          },
          {
            area: 'Educational Background',
            details: 'IIM MBA and IIT engineering degree match role preferences',
            keywords: ['MBA', 'IIM', 'Computer Science'],
          },
        ],
        weaknesses: [
          {
            area: 'Machine Learning Experience',
            details: 'JD emphasizes ML but CV shows limited ML project work',
            impact: 'HIGH',
            keywords: ['machine learning', 'ML models'],
          },
          {
            area: 'A/B Testing',
            details: 'No explicit mention of A/B testing despite being key requirement',
            impact: 'MEDIUM',
            keywords: ['A/B testing', 'experimentation'],
          },
        ],
        action_items: {
          immediate: [
            {
              action: 'Add Machine Learning keywords',
              impact: 'Increase match score by ~8%',
              howTo: 'Reframe e-commerce project to emphasize ML algorithms used',
              priority: 'CRITICAL',
            },
            {
              action: 'Highlight SQL proficiency',
              impact: 'Increase match score by ~6%',
              howTo: 'Add SQL to skills and mention in analytics work',
              priority: 'CRITICAL',
            },
          ],
          shortTerm: [
            {
              action: 'Add A/B Testing examples',
              impact: 'Increase match score by ~5%',
              howTo: 'Detail experimentation approach in product work',
              priority: 'HIGH',
            },
          ],
          optional: [
            {
              action: 'Expand stakeholder management',
              impact: 'Increase match score by ~3%',
              howTo: 'Add bullet about exec presentations and buy-in',
              priority: 'MEDIUM',
            },
          ],
        },
      })
      .select()
      .maybeSingle();

    if (matchError || !match) {
      throw new Error('Failed to create sample match');
    }

    return match.id;
  } catch (error) {
    console.error('Error creating JD match sample:', error);
    throw error;
  }
}

export async function createEnhancerSample(userId: string): Promise<string> {
  try {
    const { data: cvUpload, error: cvError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: 'Sample_MBA_Resume.pdf',
        file_path: `${userId}/sample_cv.pdf`,
        file_size: 245760,
        extracted_text: SAMPLE_CV_TEXT,
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (cvError || !cvUpload) {
      throw new Error('Failed to create sample CV upload');
    }

    const { data: enhancement, error: enhancementError } = await supabase
      .from('cv_enhancements')
      .insert({
        user_id: userId,
        cv_upload_id: cvUpload.id,
        original_text: SAMPLE_CV_TEXT,
        overall_score_before: 72,
        overall_score_after: 72,
        status: 'analyzing',
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (enhancementError || !enhancement) {
      throw new Error('Failed to create sample enhancement');
    }

    const sections = [
      {
        name: 'Personal Information',
        rating: 5,
        bullets: [
          {
            text: 'Arjun Mehta | arjun.mehta@email.com | +91 98765 43210',
            issues: [],
            suggestions: [],
          },
        ],
      },
      {
        name: 'Work Experience',
        rating: 3,
        bullets: [
          {
            text: 'Led product strategy for B2B SaaS platform serving 500+ enterprise clients',
            issues: ['Passive verb', 'No impact metrics'],
            suggestions: [
              'Spearheaded product strategy for B2B SaaS platform, driving adoption across 500+ enterprise clients and increasing platform usage by 35%',
              'Architected and executed product strategy for enterprise SaaS platform, scaling from 200 to 500+ clients while maintaining 98% retention rate',
              'Transformed B2B SaaS product strategy, capturing 500+ enterprise clients and generating $5M in new ARR through strategic feature prioritization',
            ],
          },
          {
            text: 'Increased user engagement by 45% through data-driven feature prioritization',
            issues: ['Weak verb', 'Vague metrics'],
            suggestions: [
              'Drove 45% surge in user engagement by implementing data-driven feature prioritization framework, analyzing 100K+ user interactions monthly',
              'Boosted user engagement 45% by pioneering analytics-backed feature roadmap, resulting in 2.5x increase in daily active users',
              'Accelerated user engagement by 45% through ML-powered feature prioritization, reducing churn by 23% and increasing session duration by 40%',
            ],
          },
        ],
      },
      {
        name: 'Projects',
        rating: 2,
        bullets: [
          {
            text: 'Developed Python-based dashboard analyzing customer behavior patterns',
            issues: ['No user impact', 'Missing scale', 'Weak verb'],
            suggestions: [
              'Engineered Python-based analytics dashboard processing 1M+ transactions daily, uncovering behavior patterns that increased conversion rates by 18%',
              'Built real-time customer behavior dashboard in Python, analyzing 50K+ daily users and delivering insights that drove $500K revenue growth',
              'Created ML-powered customer analytics platform using Python, processing 10M+ data points and reducing customer acquisition costs by 25%',
            ],
          },
        ],
      },
    ];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const { data: sectionData, error: sectionError } = await supabase
        .from('cv_enhancement_sections')
        .insert({
          enhancement_id: enhancement.id,
          section_name: section.name,
          section_order: i + 1,
          rating_before: section.rating,
          rating_after: section.rating,
          total_bullets: section.bullets.length,
          enhanced_bullets: 0,
          is_sample: true,
        })
        .select()
        .maybeSingle();

      if (sectionError || !sectionData) continue;

      for (let j = 0; j < section.bullets.length; j++) {
        const bullet = section.bullets[j];
        await supabase.from('cv_bullets').insert({
          section_id: sectionData.id,
          original_text: bullet.text,
          current_text: bullet.text,
          bullet_order: j + 1,
          rating_before: section.rating,
          issues: JSON.stringify(bullet.issues),
          ai_suggestions: JSON.stringify(bullet.suggestions),
          is_sample: true,
        });
      }
    }

    return enhancement.id;
  } catch (error) {
    console.error('Error creating enhancer sample:', error);
    throw error;
  }
}
