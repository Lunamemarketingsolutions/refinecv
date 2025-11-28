export const SAMPLE_CV_TEXT = `Naveen Kumar
naveen.kumar@email.com | +91 98765 43210 | linkedin.com/in/naveenkumar

EDUCATION
Master of Business Administration
IIM Bangalore | 2022 - 2024 | GPA: 3.8/4.0

Bachelor of Technology in Computer Science
IIT Delhi | 2018 - 2022 | GPA: 3.7/4.0

WORK EXPERIENCE
Amazon India - Software Engineer Intern
Bangalore, India | August 2022 - Present
• Worked on three mobile applications including two Android and one iOS
• Designed, built and maintained reusable and reliable Java code
• Lead a team of three persons
• Created RESTful API endpoints using node, express and MongoDB

Walmart Global Tech - Software Engineer Intern
Bangalore, India | January 2022 - July 2022
• Developed Own Your Inventory (OYI) application using React Native
• OYI transformed inventory management system
• Improved daily stand-ups and operational efficiency

PROJECTS
Covid Vaccine Tracker | May 2021
• Built a simple application using Kotlin

Stockify - Stock Trend Prediction | May 2021
• Stockify is a Stock Trend Prediction Web Application in Python

E-commerce Analytics Platform | March 2021
• Developed dashboard analyzing customer behavior patterns

SKILLS
Python, Java, React, Node.js, MongoDB, SQL, AWS, Git, Agile

POSITIONS OF RESPONSIBILITY
Technical Lead - College Fest
• Managed tech team for annual college festival
• Coordinated with 15 volunteers`;

export const SAMPLE_JD_TEXT = `Product Manager - Google
Mountain View, CA | Full-time

About the Role:
We're seeking a Product Manager to lead machine learning initiatives and drive innovation in consumer products. You'll work with cross-functional teams to define product strategy, conduct user research, and deliver impactful features.

Key Responsibilities:
• Define product roadmap based on user research and business goals
• Lead cross-functional teams including engineering, design, and data science
• Apply machine learning insights to improve product recommendations
• Conduct A/B tests to validate product hypotheses
• Analyze product metrics using SQL and present insights to leadership
• Manage stakeholder relationships and communicate product vision
• Drive user research to understand customer needs and pain points

Requirements:
• 2+ years of experience in product management or related technical role
• Strong proficiency in Python and SQL for data analysis
• Experience with A/B testing and statistical analysis
• Proven track record of shipping successful products
• Excellent stakeholder management and communication skills
• Understanding of machine learning concepts and applications
• Experience with Agile methodologies
• MBA from top-tier institution preferred
• User research experience strongly preferred

Nice to Have:
• Background in software engineering
• Experience with consumer-facing products
• Data visualization skills
• Knowledge of ML algorithms and model deployment`;

export const SAMPLE_ATS_RESULTS = {
  cvName: "Sample_CV_Naveen_Kumar.pdf",
  overallScore: 78,

  critical_issues: [
    {
      title: "Contact Information Not Detected",
      impact: "Critical",
      impactScore: -15,
      problem: "ATS cannot detect your name, phone number, or LinkedIn URL. These fields appear in your header/footer, which most ATS systems cannot parse. This is the #1 reason qualified candidates get rejected - the ATS literally cannot identify who you are.",
      location: "Header (top of page, inside a text box or header section)",
      atsView: `[CONTACT INFORMATION - FAILED]
Name: [NOT DETECTED]
Phone: [NOT DETECTED]
Email: naveen.kumar@email.com ✓
LinkedIn: [NOT DETECTED]

⚠️ ATS Alert: Cannot identify candidate. This CV may be automatically rejected.`,
      solution: `1. Remove all header/footer sections from your document
2. Move contact information to the MAIN BODY of the document
3. Place contact info as the FIRST TEXT on page 1 (not in a text box)
4. Use this format:

Naveen Kumar
+91 98765 43210 | naveen.kumar@email.com | linkedin.com/in/naveenkumar
Bangalore, India

Then immediately follow with your first section (e.g., EDUCATION or WORK EXPERIENCE)`,
      beforeExample: `[HEADER - Not readable by ATS]
┌─────────────────────────────────────┐
│ Name: Naveen Kumar                  │
│ Phone: +91 98765 43210             │
│ LinkedIn: linkedin.com/in/...      │
└─────────────────────────────────────┘

EDUCATION
...`,
      afterExample: `Naveen Kumar
+91 98765 43210 | naveen.kumar@email.com | linkedin.com/in/naveenkumar
Bangalore, India

EDUCATION
...`,
      timeToFix: "5 minutes",
      scoreImpact: "+15% (78% → 93%)"
    },
    {
      title: "Skills Section Using Graphics/Visual Elements",
      impact: "Critical",
      impactScore: -10,
      problem: "Your skills are displayed as visual bar charts, progress bars, or graphic elements. ATS cannot read images or graphics, so it thinks you have ZERO skills listed. For technical roles, this is extremely damaging as skills are often the first filter.",
      location: "Skills section (page 1, displayed as visual bars or charts)",
      atsView: `[SKILLS SECTION - FAILED]
[Unable to parse graphic content]
[No skills detected]
[Image format not readable]

⚠️ ATS sees: NO SKILLS LISTED
Actual skills: UNKNOWN`,
      solution: `Remove ALL visual skill representations (bars, charts, circles, progress indicators).
Convert to plain text format. List skills with proficiency levels and years of experience.

Recommended format:

TECHNICAL SKILLS
• Programming: Python (Advanced, 5 years), Java (Advanced, 4 years), JavaScript (Intermediate, 3 years)
• Web Development: React (Advanced, 3 years), Node.js (Intermediate, 2 years), Express (Intermediate, 2 years)
• Databases: SQL (Advanced, 4 years), MongoDB (Intermediate, 2 years)
• Cloud & Tools: AWS (Intermediate, 2 years), Git (Advanced, 5 years)

PRODUCT SKILLS
• Data Analysis: Advanced (SQL, Python, Tableau)
• Agile Methodologies: Scrum, Kanban (3 years)
• Project Management: JIRA, Confluence`,
      beforeExample: `SKILLS
Python     ████████░░ 80%
Java       ███████░░░ 70%
React      ██████░░░░ 60%
[Visual bars - Not ATS readable]`,
      afterExample: `TECHNICAL SKILLS
• Python: Advanced (5 years) - Data analysis, ML models, Django
• Java: Advanced (4 years) - Android development, Spring Boot
• React: Intermediate (3 years) - Frontend development, Redux`,
      timeToFix: "10 minutes",
      scoreImpact: "+10% (88% → 98%)"
    },
    {
      title: "Two-Column Table Layout Detected",
      impact: "Critical",
      impactScore: -8,
      problem: "Your CV uses a two-column table layout (e.g., Education in left column, Work Experience in right column). ATS reads left-to-right across the ENTIRE page width, which completely scrambles your content. The system will mix sentences from both columns, breaking chronology and context.",
      location: "Entire CV layout (multiple sections in parallel columns)",
      atsView: `[PARSING ERROR - CONTENT SCRAMBLED]

IIM Bangalore... Worked at Amazon... MBA degree... Led team of 5...
Graduated 2022... Increased sales by 30%... Bachelor of Technology...
Built mobile application... Computer Science... Created REST APIs...

⚠️ Content is jumbled. Chronology broken. Context lost.
This makes you appear unorganized and confusing to recruiters.`,
      solution: `1. Remove ALL table-based layouts
2. Convert to single-column format
3. Use clear section headings
4. Ensure proper spacing between sections
5. Stack all content vertically

Recommended structure:

EDUCATION
[All education entries listed vertically]

WORK EXPERIENCE
[All work entries listed vertically]

PROJECTS
[All projects listed vertically]

SKILLS
[All skills listed vertically]`,
      beforeExample: `┌─────────────────┬─────────────────┐
│ EDUCATION       │ WORK EXPERIENCE │
│ IIM Bangalore   │ Amazon India    │
│ MBA 2022-2024   │ SWE Intern      │
│                 │ Aug 2022-Present│
│ IIT Delhi       │                 │
│ B.Tech 2018-22  │ Walmart Global  │
└─────────────────┴─────────────────┘`,
      afterExample: `EDUCATION
Master of Business Administration
IIM Bangalore | 2022 - 2024

Bachelor of Technology in Computer Science
IIT Delhi | 2018 - 2022

WORK EXPERIENCE
Amazon India - Software Engineer Intern
Bangalore | August 2022 - Present`,
      timeToFix: "20 minutes",
      scoreImpact: "+8% (93% → 98%)"
    }
  ],

  warnings: [
    {
      title: "Inconsistent Date Formatting",
      impact: "Medium",
      impactScore: -3,
      problem: "Your CV uses mixed date formats: 'August 2022 - Present', '2022 - 2024', 'May 2021'. ATS has difficulty parsing inconsistent formats, and it looks unprofessional to human reviewers.",
      location: "Work Experience, Education, and Projects sections",
      solution: "Choose ONE format and use it everywhere. Recommended: 'Month YYYY - Month YYYY' or 'MM/YYYY - MM/YYYY'. Examples: 'Jan 2022 - Present' or '01/2022 - Present'",
      example: "Instead of mixing 'August 2022', '2022-2024', 'May 2021', use: 'Aug 2022 - Present', 'June 2022 - May 2024', 'May 2021 - May 2021'",
      timeToFix: "5 minutes",
      scoreImpact: "+3%"
    },
    {
      title: "Non-Standard Section Heading",
      impact: "Low",
      impactScore: -2,
      problem: "Using 'Positions of Responsibility' instead of standard 'Leadership Experience' or 'Leadership & Activities'. ATS is trained on common headings.",
      location: "Section heading near end of CV",
      solution: "Use standard section headings: 'Work Experience', 'Education', 'Skills', 'Projects', 'Leadership Experience', 'Certifications'",
      example: "Change 'Positions of Responsibility' to 'Leadership Experience' or 'Leadership & Activities'",
      timeToFix: "1 minute",
      scoreImpact: "+2%"
    },
    {
      title: "Special Characters in Bullets",
      impact: "Low",
      impactScore: -2,
      problem: "Using non-standard bullet symbols that some ATS cannot parse correctly",
      location: "Throughout bullet points",
      solution: "Use standard bullet points: • (Alt+0149) or simple hyphens (-). Avoid: ►, ●, ◆, ■, ➤",
      example: "Replace custom bullets with standard • or -",
      timeToFix: "3 minutes",
      scoreImpact: "+2%"
    },
    {
      title: "Non-Standard Font Detected",
      impact: "Low",
      impactScore: -2,
      problem: "Using a custom or decorative font that may not render correctly in all ATS systems",
      location: "Entire document",
      solution: "Use ATS-safe fonts: Arial, Calibri, Times New Roman, Georgia, Helvetica. Font size: 10-12pt for body, 14-16pt for name",
      example: "Change font to Arial or Calibri, 11pt body text",
      timeToFix: "2 minutes",
      scoreImpact: "+2%"
    },
    {
      title: "Hyperlinks Not Displayed as Plain Text",
      impact: "Very Low",
      impactScore: -1,
      problem: "LinkedIn URL is a hyperlink. Some ATS strip hyperlinks and cannot extract the actual URL text.",
      location: "Contact information section",
      solution: "Display URLs as plain text: 'linkedin.com/in/naveenkumar' (not as blue clickable link)",
      example: "Remove hyperlink formatting, show as: linkedin.com/in/naveenkumar",
      timeToFix: "1 minute",
      scoreImpact: "+1%"
    }
  ],

  passed_checks: [
    "Email address detected correctly",
    "Work experience section identified",
    "Education section identified",
    "Bullet points parsed correctly (where not in tables)",
    "Company names detected (Amazon, Walmart)",
    "Job titles detected (Software Engineer Intern)",
    "Degrees identified (MBA, B.Tech)",
    "Institution names detected (IIM Bangalore, IIT Delhi)",
    "Graduation years parsed",
    "File format compatible (PDF)",
    "File size under 5MB (within limits)",
    "No password protection on file",
    "No embedded images within text content",
    "Standard page margins (sufficient whitespace)",
    "Readable font size (11pt+)",
    "Consistent spacing between sections",
    "Section breaks are clear",
    "No overlapping text elements",
    "Content stays within page boundaries",
    "Projects section identified",
    "Technical skills keywords detected (partial)",
    "No corrupted file issues",
    "Text is selectable (not image-based PDF)"
  ],

  ats_text_extraction: `========================================
EXTRACTED CONTENT (as ATS sees it)
========================================

[CONTACT INFORMATION - INCOMPLETE]
Name: [NOT DETECTED - In header/footer]
Email: naveen.kumar@email.com ✓
Phone: [NOT DETECTED - In header/footer]
LinkedIn: [NOT DETECTED - In header/footer]

⚠️ CRITICAL: ATS cannot identify candidate name

========================================

[EDUCATION SECTION - DETECTED ✓]

Master of Business Administration
IIM Bangalore
2022 - 2024
GPA: 3.8/4.0

Bachelor of Technology in Computer Science
IIT Delhi
2018 - 2022
GPA: 3.7/4.0

========================================

[WORK EXPERIENCE SECTION - DETECTED ✓]

Amazon India Software Engineer Intern
Bangalore India August 2022 Present

Worked on three mobile applications including two Android and one iOS
Designed built and maintained reusable and reliable Java code
Lead a team of three persons
Created RESTful API endpoints using node express and MongoDB

Walmart Global Tech Software Engineer Intern
Bangalore India January 2022 July 2022

Developed Own Your Inventory OYI application using React Native
OYI transformed inventory management system
Improved daily stand ups and operational efficiency

========================================

[PROJECTS SECTION - DETECTED ✓]

Covid Vaccine Tracker May 2021
Built a simple application using Kotlin

Stockify Stock Trend Prediction May 2021
Stockify is a Stock Trend Prediction Web Application in Python

E commerce Analytics Platform March 2021
Developed dashboard analyzing customer behavior patterns

========================================

[SKILLS SECTION - ERROR ✗]
[Unable to parse graphic content]
[Visual elements not readable]
[No skills extracted]

⚠️ CRITICAL: Skills section failed to parse

========================================

[POSITIONS OF RESPONSIBILITY - DETECTED ✓]

Technical Lead College Fest
Managed tech team for annual college festival
Coordinated with 15 volunteers

========================================
PARSING SUMMARY
========================================
Sections Successfully Parsed: 4 of 5
Critical Parsing Errors: 3
- Contact name: NOT DETECTED
- Contact phone: NOT DETECTED
- Skills section: FAILED (graphics)

Warnings: 5
- Inconsistent date formats
- Non-standard section headings
- Special characters in bullets
- Non-standard font
- Hyperlinked URLs

Overall ATS Compatibility: 78% (Fair)
Estimated Rejection Risk: MEDIUM-HIGH
========================================

RECOMMENDATION: Fix 3 critical issues immediately.
These issues alone cause 30-40% of qualified
candidates to be auto-rejected before human review.

Time to fix: ~40 minutes
Potential score increase: 78% → 98% (+20%)
========================================`,

  section_scores: {
    contact: { score: 40, detected: 'partial', issues: 'Name, phone, LinkedIn not detected (in header)' },
    experience: { score: 95, detected: 'yes', issues: 'All entries parsed correctly' },
    education: { score: 100, detected: 'yes', issues: 'Perfect parsing with GPA' },
    skills: { score: 0, detected: 'no', issues: 'Graphics not readable by ATS' },
    projects: { score: 90, detected: 'yes', issues: 'Minor date format inconsistency' },
    leadership: { score: 85, detected: 'yes', issues: 'Non-standard heading name' }
  },

  action_plan: {
    highPriority: [
      {
        task: "Move contact information from header to body",
        time: "5 min",
        impact: "+15%",
        difficulty: "Easy",
        instructions: "Copy name, phone, LinkedIn from header. Delete header. Paste as first line in document body."
      },
      {
        task: "Convert skill graphics to plain text list",
        time: "10 min",
        impact: "+10%",
        difficulty: "Easy",
        instructions: "Remove all skill bars/charts. Create text list: 'Python: Advanced (5 years)', etc."
      },
      {
        task: "Change from two-column to single-column layout",
        time: "20 min",
        impact: "+8%",
        difficulty: "Medium",
        instructions: "Remove table structure. Stack all sections vertically. Ensure proper spacing."
      }
    ],
    mediumPriority: [
      {
        task: "Standardize all date formats",
        time: "5 min",
        impact: "+3%",
        difficulty: "Easy",
        instructions: "Change all dates to format: 'Mon YYYY - Mon YYYY' (e.g., 'Aug 2022 - Present')"
      },
      {
        task: "Update section heading: 'Positions of Responsibility' → 'Leadership Experience'",
        time: "1 min",
        impact: "+2%",
        difficulty: "Easy",
        instructions: "Simple find and replace"
      },
      {
        task: "Replace special bullet characters with standard bullets",
        time: "3 min",
        impact: "+2%",
        difficulty: "Easy",
        instructions: "Use • (Alt+0149) or simple hyphens throughout"
      },
      {
        task: "Change font to Arial or Calibri",
        time: "2 min",
        impact: "+2%",
        difficulty: "Easy",
        instructions: "Select all, change font to Arial 11pt"
      },
      {
        task: "Remove hyperlink from LinkedIn URL",
        time: "1 min",
        impact: "+1%",
        difficulty: "Easy",
        instructions: "Right-click LinkedIn URL, 'Remove Hyperlink'"
      }
    ],
    totalImpact: "+19% (78% → 97%)",
    totalTime: "~47 minutes",
    competitiveAdvantage: "Moves you from 'Maybe' pile to 'Interview' pile. These fixes alone can 4x your response rate."
  }
};

export const SAMPLE_JD_MATCH_RESULTS = {
  cvName: "Sample_CV_Naveen_Kumar.pdf",
  jdInfo: {
    role: "Product Manager",
    company: "Google",
    location: "Mountain View, CA"
  },
  overallScore: 78,

  matchedKeywords: 18,
  partialMatches: 5,
  missingKeywords: 7,
  totalJDKeywords: 30,

  cvOnlyKeywords: [
    "Kotlin", "React Native", "College Fest", "Volunteer Coordination",
    "IIT Delhi", "IIM Bangalore", "Inventory Management", "REST APIs"
  ],

  jdOnlyKeywords: [
    "Machine Learning", "User Research", "A/B Testing", "SQL",
    "Stakeholder Management", "Product Roadmap", "Agile Methodologies"
  ],

  matchedKeywordsDetail: [
    { keyword: "Python", jdMentions: 5, cvMentions: 2, status: "matched", category: "technical" },
    { keyword: "Product Management", jdMentions: 6, cvMentions: 1, status: "under-represented", category: "domain" },
    { keyword: "React", jdMentions: 2, cvMentions: 2, status: "matched", category: "technical" },
    { keyword: "Team Leadership", jdMentions: 4, cvMentions: 2, status: "matched", category: "soft-skill" },
    { keyword: "Data Analysis", jdMentions: 3, cvMentions: 2, status: "matched", category: "domain" },
    { keyword: "Cross-functional", jdMentions: 3, cvMentions: 1, status: "under-represented", category: "soft-skill" },
    { keyword: "Engineering Background", jdMentions: 2, cvMentions: 3, status: "matched", category: "qualification" },
    { keyword: "MBA", jdMentions: 1, cvMentions: 1, status: "matched", category: "qualification" },
    { keyword: "Technical Skills", jdMentions: 4, cvMentions: 3, status: "matched", category: "general" },
    { keyword: "AWS", jdMentions: 1, cvMentions: 1, status: "matched", category: "technical" },
    { keyword: "Mobile Applications", jdMentions: 2, cvMentions: 2, status: "matched", category: "domain" },
    { keyword: "Git", jdMentions: 1, cvMentions: 1, status: "matched", category: "technical" },
    { keyword: "Node.js", jdMentions: 1, cvMentions: 2, status: "matched", category: "technical" },
    { keyword: "MongoDB", jdMentions: 1, cvMentions: 1, status: "matched", category: "technical" },
    { keyword: "Software Engineering", jdMentions: 2, cvMentions: 2, status: "matched", category: "domain" },
    { keyword: "Consumer Products", jdMentions: 2, cvMentions: 1, status: "under-represented", category: "domain" },
    { keyword: "Analytics", jdMentions: 2, cvMentions: 1, status: "under-represented", category: "domain" },
    { keyword: "Communication", jdMentions: 2, cvMentions: 1, status: "under-represented", category: "soft-skill" }
  ],

  missingKeywordsDetail: [
    {
      keyword: "Machine Learning",
      priority: "CRITICAL",
      jdFrequency: 6,
      impact: "+6%",
      context: "JD mentions 'machine learning' 6 times in key responsibilities and requirements. This is clearly a core requirement.",
      problem: "Your CV: ZERO mentions of 'machine learning' or 'ML'. Your e-commerce analytics project could easily be reframed as an ML project.",
      howToAdd: [
        {
          option: "Reframe existing project",
          before: "E-commerce Analytics Platform | March 2021\n• Developed dashboard analyzing customer behavior patterns",
          after: "E-commerce Analytics Platform with ML | March 2021\n• Built machine learning model to predict customer purchase behavior with 85% accuracy\n• Analyzed 50,000+ transactions using Python, pandas, scikit-learn\n• Deployed ML-powered dashboard for real-time customer insights",
          impact: "High - Shows direct ML experience"
        },
        {
          option: "Add to skills section",
          before: "Python, Java, React...",
          after: "TECHNICAL SKILLS\n• Machine Learning: Python (scikit-learn, pandas, numpy), predictive modeling, classification algorithms\n• Programming: Python, Java...",
          impact: "Medium - Shows knowledge"
        },
        {
          option: "Add coursework bullet",
          before: "IIM Bangalore | 2022 - 2024",
          after: "IIM Bangalore | 2022 - 2024\n• Relevant Coursework: Machine Learning for Business, Predictive Analytics, Data Mining",
          impact: "Low - Better than nothing"
        }
      ],
      timeToFix: "10-15 minutes",
      difficulty: "Medium"
    },
    {
      keyword: "User Research",
      priority: "CRITICAL",
      jdFrequency: 5,
      impact: "+5%",
      context: "JD emphasizes 'user research' and 'understanding customer needs' 5 times. Critical for PM role.",
      problem: "Your CV: ZERO mentions. Yet you surely gathered user feedback for your projects and internships.",
      howToAdd: [
        {
          option: "Add to Amazon internship",
          before: "• Worked on three mobile applications including two Android and one iOS",
          after: "• Led product development for 3 mobile applications (2 Android, 1 iOS); conducted user research (50+ interviews, 200+ survey responses) to identify pain points; achieved 4.5/5 App Store rating",
          impact: "High - Shows practical experience"
        },
        {
          option: "Add to project",
          before: "• Built a simple application using Kotlin",
          after: "• Built Covid Vaccine Tracker app using Kotlin; conducted user research with 30 participants to understand vaccine appointment pain points; incorporated feedback into design",
          impact: "Medium - Shows user-centric approach"
        }
      ],
      timeToFix: "8 minutes",
      difficulty: "Easy"
    },
    {
      keyword: "A/B Testing",
      priority: "HIGH",
      jdFrequency: 4,
      impact: "+4%",
      context: "JD requires 'A/B testing' experience to validate product decisions",
      problem: "Not mentioned in CV. Common for product/analytics work.",
      howToAdd: [
        {
          option: "Add to internship",
          before: "• Improved daily stand-ups and operational efficiency",
          after: "• Improved operational efficiency by 25% through A/B testing of workflow changes; ran 5 experiments with 100+ users",
          impact: "High"
        }
      ],
      timeToFix: "5 minutes",
      difficulty: "Easy"
    },
    {
      keyword: "SQL",
      priority: "HIGH",
      jdFrequency: 4,
      impact: "+4%",
      context: "JD explicitly requires 'SQL for data analysis'",
      problem: "SQL listed in skills but never demonstrated in experience",
      howToAdd: [
        {
          option: "Add to experience bullets",
          before: "• Developed dashboard analyzing customer behavior patterns",
          after: "• Built analytics dashboard using Python and SQL; wrote complex queries analyzing 100K+ transactions; identified top 10 customer segments",
          impact: "High - Shows practical usage"
        }
      ],
      timeToFix: "5 minutes",
      difficulty: "Easy"
    },
    {
      keyword: "Stakeholder Management",
      priority: "MEDIUM",
      jdFrequency: 3,
      impact: "+3%",
      context: "PM role requires communicating with diverse stakeholders",
      problem: "CV says 'led team' but doesn't mention stakeholder management",
      howToAdd: [
        {
          option: "Reframe leadership bullet",
          before: "• Lead a team of three persons",
          after: "• Led cross-functional team of 3 engineers; managed stakeholder expectations across product, design, and QA; delivered features on schedule",
          impact: "Medium"
        }
      ],
      timeToFix: "3 minutes",
      difficulty: "Easy"
    },
    {
      keyword: "Product Roadmap",
      priority: "MEDIUM",
      jdFrequency: 3,
      impact: "+3%",
      context: "Core PM responsibility",
      problem: "Never mentioned",
      howToAdd: [
        {
          option: "Add to internship",
          before: "• Worked on three mobile applications",
          after: "• Contributed to product roadmap for 3 mobile applications; prioritized features based on user feedback and business impact",
          impact: "Medium"
        }
      ],
      timeToFix: "4 minutes",
      difficulty: "Easy"
    },
    {
      keyword: "Agile Methodologies",
      priority: "LOW",
      jdFrequency: 2,
      impact: "+2%",
      context: "Nice to have",
      problem: "Agile listed in skills but not demonstrated",
      howToAdd: [
        {
          option: "Add to skills",
          before: "Agile",
          after: "Agile Methodologies: Scrum Master certification (in progress), daily standups, sprint planning (2 years)",
          impact: "Low"
        }
      ],
      timeToFix: "2 minutes",
      difficulty: "Easy"
    }
  ],

  partialMatchesDetail: [
    {
      cvSays: "Lead a team of three persons",
      jdPrefers: "Led cross-functional team",
      issue: "Too vague, grammatically incorrect ('Lead' should be 'Led'), doesn't specify cross-functional",
      fix: "Led cross-functional team of 3 engineers (backend, frontend, mobile) delivering features for 10,000+ users",
      impact: "+3%",
      difficulty: "Easy"
    },
    {
      cvSays: "Worked on three mobile applications",
      jdPrefers: "Owned product development / Shipped products",
      issue: "Passive language ('worked on'), no ownership, no outcomes",
      fix: "Owned product development for 3 mobile applications serving 10,000+ users; defined requirements, prioritized features, shipped 12 releases",
      impact: "+3%",
      difficulty: "Easy"
    },
    {
      cvSays: "Developed dashboard analyzing customer behavior patterns",
      jdPrefers: "Conducted user research and data analysis",
      issue: "No mention of user research or SQL, too technical",
      fix: "Conducted user research (30 interviews) and analyzed customer behavior using SQL and Python; built dashboard processing 100K+ transactions",
      impact: "+3%",
      difficulty: "Easy"
    },
    {
      cvSays: "Improved daily stand-ups and operational efficiency",
      jdPrefers: "Implemented Agile methodologies / Drove process improvements",
      issue: "Vague, no metrics, doesn't mention Agile",
      fix: "Implemented Agile (Scrum) methodologies improving sprint velocity by 35%; optimized daily standups reducing meeting time by 50%",
      impact: "+2%",
      difficulty: "Easy"
    },
    {
      cvSays: "Managed tech team for annual college festival",
      jdPrefers: "Managed cross-functional teams and stakeholders",
      issue: "Doesn't emphasize leadership or outcomes",
      fix: "Managed cross-functional tech team of 15 for college festival (5,000 attendees); coordinated with 4 stakeholder groups; delivered on-time launch",
      impact: "+2%",
      difficulty: "Easy"
    }
  ],

  strengths: [
    {
      title: "Strong Technical Background",
      match: "95%",
      details: "Your software engineering experience (Amazon, Walmart internships) and CS degree are highly relevant. JD prefers candidates with engineering background.",
      keywords: ["Python", "React", "Node.js", "MongoDB", "AWS", "Git"],
      leverage: "Emphasize how technical skills help you work with engineering teams and make data-driven decisions."
    },
    {
      title: "Top-Tier Education",
      match: "100%",
      details: "IIM MBA + IIT B.Tech exceeds requirements (JD asks for 'MBA from top-tier institution preferred'). This is a major competitive advantage.",
      keywords: ["IIM Bangalore", "IIT Delhi", "MBA", "Computer Science"],
      leverage: "Prominently display education. You're in top 1% of applicants by education pedigree."
    },
    {
      title: "Relevant Experience at Scale",
      match: "85%",
      details: "Amazon and Walmart internships show you've worked at companies with millions of users. Relevant for consumer product role at Google.",
      keywords: ["Amazon", "Walmart", "Mobile applications", "APIs"],
      leverage: "Quantify scale: How many users? How many transactions? What was the impact?"
    },
    {
      title: "Product Development Experience",
      match: "75%",
      details: "You've built multiple products (3 internship apps + 3 personal projects). Shows initiative and full-stack capability.",
      keywords: ["Mobile applications", "Web applications", "Full-stack"],
      leverage: "Reframe as 'product ownership' rather than 'development work'. Focus on decisions, not just coding."
    },
    {
      title: "Analytics & Data Skills",
      match: "80%",
      details: "E-commerce analytics project aligns with 'data-driven' emphasis in JD. Python for analysis is mentioned.",
      keywords: ["Data analysis", "Python", "Analytics", "Customer behavior"],
      leverage: "Expand on this project. Add metrics, insights discovered, business impact. This bridges engineering and PM."
    }
  ],

  weaknesses: [
    {
      title: "Missing Product Management Terminology",
      impact: "HIGH",
      problem: "Your CV uses engineering-heavy language: 'Built', 'Developed', 'Coded'. JD looks for PM language: 'Defined roadmap', 'Prioritized features', 'Drove strategy'.",
      fix: "Reframe bullets to show product thinking, not just execution. Example: 'Defined product requirements and prioritized features for 3 mobile apps' instead of 'Worked on three mobile applications'.",
      scoreImpact: "+8%",
      difficulty: "Medium - Requires rewriting multiple bullets"
    },
    {
      title: "No User Research Evidence",
      impact: "HIGH",
      problem: "JD mentions 'user research' 5 times. Your CV: 0 mentions. Yet you surely gathered user feedback.",
      fix: "Add user research to existing bullets: 'Conducted 50 user interviews...', 'Analyzed 200 survey responses...', etc.",
      scoreImpact: "+6%",
      difficulty: "Easy - Add to existing bullets"
    },
    {
      title: "Weak Metrics and Impact",
      impact: "MEDIUM",
      problem: "Most bullets lack quantified outcomes. Example: 'Improved operational efficiency' - by how much?",
      fix: "Add metrics to every bullet: users impacted, % improvement, $ revenue, time saved, adoption rate.",
      scoreImpact: "+5%",
      difficulty: "Easy - Research your project numbers"
    },
    {
      title: "Missing Machine Learning Keywords",
      impact: "MEDIUM",
      problem: "JD emphasizes ML 6 times. Your CV: 0 mentions. Your analytics project could easily be an ML project.",
      fix: "Reframe analytics project as ML project. Add ML to skills with specific libraries.",
      scoreImpact: "+6%",
      difficulty: "Medium - May need to learn some ML basics"
    },
    {
      title: "No A/B Testing or Experimentation",
      impact: "LOW",
      problem: "JD requires A/B testing experience. Not mentioned in CV.",
      fix: "Add to internship or project: 'Ran A/B test improving X by Y%'",
      scoreImpact: "+4%",
      difficulty: "Easy if you did it, Medium if you need to add it"
    }
  ],

  roleFramingExamples: [
    {
      section: "Amazon Internship - First Bullet",
      before: "Worked on three mobile applications including two Android and one iOS",
      beforeRating: 2,
      beforeLabel: "Engineering-focused, passive, no impact",
      after: "Owned product development for 3 mobile applications (2 Android, 1 iOS) serving 10,000+ users; conducted user research (50 interviews, 200 surveys); defined features prioritizing user pain points; collaborated with design and engineering teams; achieved 4.6/5 App Store rating with 95% crash-free rate",
      afterRating: 5,
      afterLabel: "Product-focused, active ownership, quantified impact",
      changes: [
        "'Worked on' → 'Owned product development' (shows ownership)",
        "Added user count (10,000+) for scale",
        "Added user research (interviews, surveys) - KEY for PM role",
        "Added 'defined features' and 'prioritizing' - PM language",
        "Added cross-functional collaboration",
        "Added outcomes (rating, stability) - shows impact"
      ],
      impactOnMatch: "+5% match score"
    },
    {
      section: "Walmart Internship - Second Bullet",
      before: "Improved daily stand-ups and operational efficiency",
      beforeRating: 2,
      beforeLabel: "Vague, no metrics, generic",
      after: "Implemented Agile (Scrum) methodologies increasing team velocity by 35%; optimized daily standups reducing meeting time from 30min to 15min; introduced sprint retrospectives improving team satisfaction scores by 40%",
      afterRating: 5,
      afterLabel: "Specific, quantified, shows process improvement",
      changes: [
        "Added 'Agile' and 'Scrum' keywords (JD requirement)",
        "Quantified velocity improvement (35%)",
        "Specific metrics on standups (30min → 15min)",
        "Added team impact (satisfaction scores)",
        "'Improved' → 'Implemented' and 'Optimized' (stronger verbs)"
      ],
      impactOnMatch: "+3% match score"
    },
    {
      section: "E-commerce Analytics Project",
      before: "Developed dashboard analyzing customer behavior patterns",
      beforeRating: 2,
      beforeLabel: "Too technical, no business context",
      after: "Built ML-powered analytics platform predicting customer purchase behavior with 85% accuracy; analyzed 100K+ transactions using Python, SQL, and scikit-learn; identified top 10 customer segments enabling targeted marketing; created dashboard for stakeholders driving 20% increase in conversion rate",
      afterRating: 5,
      afterLabel: "Shows ML, scale, business impact, stakeholder communication",
      changes: [
        "Added 'ML-powered' (critical missing keyword)",
        "Quantified scale (100K+ transactions)",
        "Added SQL (required skill)",
        "Business outcome (customer segments, conversion rate)",
        "Stakeholder communication (PM skill)",
        "Specific tech stack (Python, scikit-learn)"
      ],
      impactOnMatch: "+6% match score"
    }
  ],

  actionPlan: {
    immediate: [
      {
        priority: "CRITICAL",
        task: "Add 7 missing keywords naturally",
        keywords: ["Machine Learning", "User Research", "A/B Testing", "SQL", "Stakeholder Management", "Product Roadmap", "Agile"],
        time: "35-40 minutes",
        impact: "+15%",
        difficulty: "Medium",
        howTo: "Use 'How to Add' suggestions in Missing Keywords section above. Focus on reframing existing experience rather than inventing new work."
      },
      {
        priority: "CRITICAL",
        task: "Reframe 5 bullets from engineering to product language",
        time: "15 minutes",
        impact: "+8%",
        difficulty: "Easy",
        howTo: "Use Role Framing examples above. Change 'Built/Developed/Coded' to 'Owned/Defined/Drove'. Add user research, decision-making, cross-functional work."
      }
    ],
    shortTerm: [
      {
        priority: "HIGH",
        task: "Strengthen 5 partial matches",
        time: "12 minutes",
        impact: "+6%",
        difficulty: "Easy",
        howTo: "Use before/after examples in Partial Matches section. Add specifics, metrics, outcomes."
      },
      {
        priority: "HIGH",
        task: "Add quantified metrics to all bullets",
        time: "15 minutes",
        impact: "+5%",
        difficulty: "Medium",
        howTo: "For each bullet, add: # of users, % improvement, $ impact, time saved, or adoption rate. Research your projects if needed."
      }
    ],
    optional: [
      {
        priority: "MEDIUM",
        task: "Emphasize top-tier education",
        time: "5 minutes",
        impact: "+3%",
        difficulty: "Easy",
        howTo: "Move education to top (after name). Add 'relevant coursework' mentioning ML, Analytics, Product Management."
      },
      {
        priority: "LOW",
        task: "Add certifications or side projects",
        time: "10 minutes",
        impact: "+2%",
        difficulty: "Easy",
        howTo: "If you've done Coursera ML course or built side projects, add them. Shows initiative."
      }
    ],
    totalTransformation: {
      currentScore: "78% (Fair - Top 30% of applicants)",
      potentialScore: "96% (Excellent - Top 5% of applicants)",
      improvement: "+18%",
      totalTime: "~90 minutes of focused work",
      competitivePosition: {
        before: "Rank ~60th out of 200-300 applicants",
        after: "Rank ~10th out of 200-300 applicants",
        improvement: "6x better positioning"
      },
      interviewOdds: {
        before: "15-20% chance of interview",
        after: "70-80% chance of interview",
        improvement: "4x increase in interview likelihood"
      },
      keyInsight: "You have the credentials (IIM + IIT + FAANG internships). You just need to REFRAME your experience using product management language and fill in 7 critical keyword gaps. This is highly achievable in 90 minutes."
    }
  }
};

export const SAMPLE_ENHANCER_SECTIONS = [
  {
    name: "Personal Information",
    rating: 5,
    total_bullets: 1,
    bullets: [
      {
        original: "Naveen Kumar\nnaveen.kumar@email.com | +91 98765 43210 | linkedin.com/in/naveenkumar",
        issues: [],
        enhanced: false
      }
    ]
  },
  {
    name: "Work Experience",
    rating: 3,
    total_bullets: 6,
    bullets: [
      {
        original: "Worked on three mobile applications including two Android and one iOS",
        rating: 2,
        issues: [
          "Passive verb: 'Worked on' (weak action verb)",
          "No quantified metrics (how many users?)",
          "Too long without specifics (15 words of fluff)",
          "Missing impact/outcome (what was the result?)",
          "Vague description (what did you actually do?)"
        ],
        enhanced: true,
        current: "Led development of 3 mobile applications (2 Android, 1 iOS) serving 10,000+ users; architected reusable Java codebase improving code efficiency by 30%; managed cross-functional team of 5 developers; achieved 4.6/5 App Store rating with 95% crash-free rate",
        aiSuggestions: [
          {
            text: "Led development of 3 mobile applications (2 Android, 1 iOS) serving 10,000+ users; architected reusable Java codebase improving code efficiency by 30%; managed cross-functional team of 5 developers; achieved 4.6/5 App Store rating with 95% crash-free rate",
            rating: 5,
            improvements: [
              "✓ Strong action verb: 'Led' (instead of 'Worked on')",
              "✓ Quantified impact: 10,000+ users, 30% efficiency",
              "✓ Added team management: 5 developers",
              "✓ Clear outcomes: 4.6/5 rating, 95% stability",
              "✓ Professional framing: 'architected', 'managed cross-functional'"
            ]
          },
          {
            text: "Spearheaded mobile development for 3 high-impact applications (Android, iOS) with 10K+ downloads; designed scalable Java architecture reducing code duplication by 30%; coordinated 5-member engineering team; maintained 4.6/5 user rating with 95% crash-free sessions",
            rating: 5,
            improvements: [
              "✓ Power verb: 'Spearheaded' shows leadership",
              "✓ Impact-focused: 'high-impact', '10K+ downloads'",
              "✓ Technical depth: 'scalable architecture'",
              "✓ Team coordination emphasized"
            ]
          },
          {
            text: "Drove end-to-end development of 3 mobile products serving 10,000+ users across Android/iOS platforms; built reusable Java framework improving development velocity by 30%; led team of 5 achieving 4.6/5 App Store rating and industry-leading 95% stability",
            rating: 5,
            improvements: [
              "✓ Ownership: 'Drove end-to-end'",
              "✓ Product language: 'products' not 'applications'",
              "✓ Business impact: 'development velocity'",
              "✓ Competitive framing: 'industry-leading'"
            ]
          }
        ]
      },
      {
        original: "Designed, built and maintained reusable and reliable Java code",
        rating: 2,
        issues: [
          "Vague adjectives: 'reusable and reliable' (prove it with metrics)",
          "No quantified impact (how much code? what was reused?)",
          "Missing context (for what project/product?)",
          "No outcome (what was the benefit of this work?)",
          "Reads like job description, not achievement"
        ],
        enhanced: false,
        aiSuggestions: []
      },
      {
        original: "Lead a team of three persons",
        rating: 2,
        issues: [
          "Grammar error: 'Lead' should be 'Led' (past tense)",
          "Vague: 'three persons' (specify their roles/functions)",
          "No outcome or achievement (what did the team accomplish?)",
          "Missing 'cross-functional' context (important for PM roles)",
          "Too short - missed opportunity to show leadership impact"
        ],
        enhanced: false,
        aiSuggestions: []
      },
      {
        original: "Created RESTful API endpoints using node, express and MongoDB",
        rating: 2,
        issues: [
          "Too technical for PM/business roles (focus on impact, not tech stack)",
          "No business context (what was this for? why did it matter?)",
          "No scale/usage metrics (how many requests? how many users?)",
          "Missing impact (what business problem did this solve?)",
          "Reads like a task list, not an achievement"
        ],
        enhanced: false,
        aiSuggestions: []
      },
      {
        original: "Developed Own Your Inventory (OYI) application using React Native",
        rating: 3,
        issues: [
          "Missing impact (how did this help users/business?)",
          "No metrics (how many users? what was adoption?)",
          "Focus on tech (React Native) instead of outcome",
          "Could add team size or cross-functional work"
        ],
        enhanced: false,
        aiSuggestions: []
      },
      {
        original: "Improved daily stand-ups and operational efficiency",
        rating: 2,
        issues: [
          "Vague: 'improved' by how much?",
          "No quantified metrics (time saved? efficiency gain?)",
          "Generic statement - could apply to anyone",
          "Missing specifics on how you improved it"
        ],
        enhanced: false,
        aiSuggestions: []
      }
    ]
  },
  {
    name: "Projects",
    rating: 2,
    total_bullets: 3,
    bullets: [
      {
        original: "Built a simple application using Kotlin",
        rating: 1,
        issues: [
          "'Simple' undersells your work (never use this word)",
          "No user impact (how many people used it?)",
          "Missing problem statement (what problem did it solve?)",
          "No outcome metrics (downloads? ratings? feedback?)",
          "Way too short - expand with context and results"
        ],
        enhanced: false
      },
      {
        original: "Stockify is a Stock Trend Prediction Web Application in Python",
        rating: 2,
        issues: [
          "Written as description, not achievement",
          "No accuracy metrics (how accurate were predictions?)",
          "Missing scale (how much data? how many stocks?)",
          "No user adoption or impact mentioned",
          "Tech stack mentioned but no business value shown"
        ],
        enhanced: false
      },
      {
        original: "Developed dashboard analyzing customer behavior patterns",
        rating: 2,
        issues: [
          "No metrics (how many customers? patterns?)",
          "Missing business impact (did it increase sales?)",
          "No mention of insights discovered",
          "Could add ML/analytics methods used"
        ],
        enhanced: false
      }
    ]
  },
  {
    name: "Skills",
    rating: 3,
    total_bullets: 1,
    bullets: [
      {
        original: "Python, Java, React, Node.js, MongoDB, SQL, AWS, Git, Agile",
        rating: 3,
        issues: [
          "No proficiency levels (Advanced? Intermediate?)",
          "Missing years of experience for each",
          "Not categorized (Frontend, Backend, Cloud, etc.)",
          "Could add specific frameworks/tools within each"
        ],
        enhanced: false
      }
    ]
  },
  {
    name: "Education",
    rating: 4,
    total_bullets: 2,
    bullets: [
      {
        original: "Master of Business Administration\nIIM Bangalore | 2022 - 2024 | GPA: 3.8/4.0",
        rating: 4,
        issues: [
          "Could add relevant coursework",
          "Could mention academic achievements/awards",
          "Could add concentration/specialization"
        ],
        enhanced: false
      },
      {
        original: "Bachelor of Technology in Computer Science\nIIT Delhi | 2018 - 2022 | GPA: 3.7/4.0",
        rating: 4,
        issues: [
          "Could add relevant coursework",
          "Could mention projects or thesis"
        ],
        enhanced: false
      }
    ]
  },
  {
    name: "Positions of Responsibility",
    rating: 4,
    total_bullets: 2,
    bullets: [
      {
        original: "Managed tech team for annual college festival",
        rating: 3,
        issues: [
          "Could add team size",
          "Missing outcomes/metrics",
          "Could quantify festival size/attendance"
        ],
        enhanced: false
      },
      {
        original: "Coordinated with 15 volunteers",
        rating: 3,
        issues: [
          "Too short - expand with what you coordinated",
          "Missing outcomes",
          "Could combine with previous bullet"
        ],
        enhanced: false
      }
    ]
  }
];
