export interface Profile {
  name: string;
  firstName: string;
  role: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  resumeSummary: string;
  subLine: string;
  quote: string;
  github: string;
  linkedin: string;
  resumePath: string;
  dept: string;
  idNo: string;
  validTill: string;
}

export interface NavItem {
  name: string;
  href: string;
  index: string;
}

export interface SkillItem {
  id: string;
  name: string;
  symbol: string;
  atomicNumber: number;
  family: "Languages" | "Web & Backend" | "AI / Data" | "Fundamentals" | "Tools";
  iconType: "brand" | "concept";
  iconName: string;
  color?: string;
  projects: string[];
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  subDescription: string;
  features: string[];
  tech: string[];
  github: string;
  live: string;
}

export interface CertificationItem {
  id: string;
  index: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  place: string;
  score?: string;
  type: "education" | "experience";
  detail: string;
}

export interface AchievementItem {
  id: string;
  index: string;
  number: number;
  isDecimal?: boolean;
  prefix?: string;
  suffix?: string;
  label: string;
  caption: string;
  detail: string;
  platform: string;
  logo: string;
  brandColor: string;
  glow: string;
}

export const PROFILE: Profile = {
  name: "Jatin Khandelwal",
  firstName: "JATIN",
  role: "Full Stack Developer",
  email: "jatinkhandelwal662@gmail.com",
  phone: "+91 7838529756",
  phoneHref: "tel:+917838529756",
  location: "New Delhi, India",
  resumeSummary:
    "Second-year B.Tech (Industrial IoT) student with hands-on experience in frontend development (HTML, CSS, JavaScript, Chart.js dashboards) and backend APIs (Node.js, FastAPI), and currently learning machine learning with PyTorch. Top 30 at Hack4Delhi 2026, 1st place at Ideate-it-Up 2026.",
  subLine:
    "Engineering voice-first civic platforms, real-time command dashboards, and occlusion-robust geospatial pipelines.",
  quote:
    "Hands-on full-stack development meets robust geospatial architectures and machine learning systems.",
  github: "https://github.com/jatinkhandelwal662-jk",
  linkedin: "https://linkedin.com/in/jatin-khandelwal08",
  resumePath: "/Jatin_Khandelwal_Resume.pdf",
  dept: "Industrial Internet of Things (IIoT)",
  idNo: "USAR-2025-IIOT",
  validTill: "2029",
};

export const NAV: NavItem[] = [
  { name: "About", href: "#about", index: "01" },
  { name: "Skills", href: "#skills", index: "02" },
  { name: "Work", href: "#work", index: "03" },
  { name: "Certifications", href: "#certifications", index: "04" },
  { name: "Experience", href: "#experience", index: "05" },
  { name: "Achievements", href: "#achievements", index: "06" },
  { name: "Contact", href: "#contact", index: "07" },
];

export const SKILL_GROUPS = [
  "All",
  "Languages",
  "Web & Backend",
  "AI / Data",
  "Fundamentals",
  "Tools",
] as const;

export const SKILLS: SkillItem[] = [
  {
    id: "cpp",
    name: "C++",
    symbol: "Cp",
    atomicNumber: 1,
    family: "Languages",
    iconType: "brand",
    iconName: "cplusplus",
    projects: ["Data Structures & Algorithms", "High Performance Computations"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    symbol: "Js",
    atomicNumber: 2,
    family: "Languages",
    iconType: "brand",
    iconName: "javascript",
    projects: ["Delhi Sudarshan", "Full-Stack Web Platforms"],
  },
  {
    id: "python",
    name: "Python",
    symbol: "Py",
    atomicNumber: 3,
    family: "Languages",
    iconType: "brand",
    iconName: "python",
    projects: ["Project S.E.T.U", "Machine Learning Pipeline"],
  },
  {
    id: "html5",
    name: "HTML5",
    symbol: "H5",
    atomicNumber: 4,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "html5",
    projects: ["Delhi Sudarshan", "Zero-UI Dashboard Frontend"],
  },
  {
    id: "css3",
    name: "CSS3",
    symbol: "C3",
    atomicNumber: 5,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "css3",
    projects: ["Delhi Sudarshan", "Responsive UI Interfaces"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    symbol: "No",
    atomicNumber: 6,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "nodejs",
    projects: ["Delhi Sudarshan", "Stateless Tunneling Middleware"],
  },
  {
    id: "express",
    name: "Express.js",
    symbol: "Ex",
    atomicNumber: 7,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "express",
    projects: ["Delhi Sudarshan", "Backend REST Handlers"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    symbol: "Fa",
    atomicNumber: 8,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "fastapi",
    projects: ["Project S.E.T.U", "Geospatial Inference Service"],
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    symbol: "Ra",
    atomicNumber: 9,
    family: "Web & Backend",
    iconType: "concept",
    iconName: "api",
    projects: ["Delhi Sudarshan", "Project S.E.T.U"],
  },
  {
    id: "chartjs",
    name: "Chart.js",
    symbol: "Cj",
    atomicNumber: 10,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "chartjs",
    projects: ["Delhi Sudarshan Dashboard", "Department Resolution Rates"],
  },
  {
    id: "leaflet",
    name: "Leaflet.js",
    symbol: "Lf",
    atomicNumber: 11,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "leaflet",
    projects: ["Project S.E.T.U", "Interactive Road Topology Mapping"],
  },
  {
    id: "twilio",
    name: "Twilio API",
    symbol: "Tw",
    atomicNumber: 12,
    family: "Web & Backend",
    iconType: "brand",
    iconName: "twilio",
    projects: ["Delhi Sudarshan Voice Gateway"],
  },
  {
    id: "pytorch",
    name: "PyTorch",
    symbol: "Pt",
    atomicNumber: 13,
    family: "AI / Data",
    iconType: "brand",
    iconName: "pytorch",
    projects: ["Project S.E.T.U", "Deep Learning Research"],
  },
  {
    id: "transunet",
    name: "Hybrid TransUNet",
    symbol: "Tu",
    atomicNumber: 14,
    family: "AI / Data",
    iconType: "concept",
    iconName: "network",
    projects: ["Project S.E.T.U Road Extraction"],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    symbol: "Ds",
    atomicNumber: 15,
    family: "Fundamentals",
    iconType: "concept",
    iconName: "tree",
    projects: ["Project S.E.T.U (MST, Union-Find)", "Algorithmic Challenges"],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    symbol: "Da",
    atomicNumber: 16,
    family: "Fundamentals",
    iconType: "concept",
    iconName: "graph",
    projects: ["Betweenness-Centrality Analysis", "Resolution Metrics"],
  },
  {
    id: "networking",
    name: "Computer Networking (basics)",
    symbol: "Cn",
    atomicNumber: 17,
    family: "Fundamentals",
    iconType: "concept",
    iconName: "network",
    projects: ["Stateless Tunneling", "Client-Server Protocols"],
  },
  {
    id: "git-github",
    name: "Git / GitHub",
    symbol: "Gt",
    atomicNumber: 18,
    family: "Tools",
    iconType: "brand",
    iconName: "github",
    projects: ["All Open-Source Repositories & Collaboration"],
  },
  {
    id: "docker",
    name: "Docker",
    symbol: "Dk",
    atomicNumber: 19,
    family: "Tools",
    iconType: "brand",
    iconName: "docker",
    projects: ["Containerized Services & Environment Reproducibility"],
  },
  {
    id: "vercel",
    name: "Vercel",
    symbol: "Vc",
    atomicNumber: 20,
    family: "Tools",
    iconType: "brand",
    iconName: "vercel",
    projects: ["Delhi Sudarshan Frontend", "Project S.E.T.U Web App"],
  },
  {
    id: "render",
    name: "Render",
    symbol: "Rn",
    atomicNumber: 21,
    family: "Tools",
    iconType: "brand",
    iconName: "render",
    projects: ["Cloud API Deployments", "Stateless Backend Services"],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "delhi-sudarshan",
    index: "01",
    title: "Delhi Sudarshan",
    kicker: "AI-Powered Civic Command Center · Hack4Delhi 2026, IEEE NSUT",
    description:
      "Built a voice-first, zero-UI civic grievance platform as part of 4-member Team TARS, letting citizens lodge and track complaints without a mobile app.",
    subDescription:
      "Designed a stateless “legacy-tunneling” middleware and a real-time Chart.js dashboard tracking department-wise resolution rates; ranked Top 30 (Certificate of Merit).",
    features: [
      "Voice-first zero-UI platform: lodge and monitor civic issues with no mobile app",
      "Stateless legacy-tunneling middleware unifying municipal department endpoints",
      "Real-time analytical Chart.js dashboard measuring resolution rates",
      "Developed with 4-member Team TARS; recognized in Top 30 with Certificate of Merit",
    ],
    tech: ["Node.js", "Express.js", "JavaScript", "Chart.js", "Twilio"],
    github: "https://github.com/jatinkhandelwal662-jk/Delhi-Sudarshan",
    live: "https://delhi-sudarshan-frontend.vercel.app",
  },
  {
    id: "project-setu",
    index: "02",
    title: "Project S.E.T.U",
    kicker: "Occlusion-Robust Road Extraction · ISRO BAH 2026",
    description:
      "Co-developed, with a 4-member team, a geospatial pipeline that reconstructs disconnected road networks from occluded satellite imagery using a Hybrid TransUNet model.",
    subDescription:
      "Implemented graph-based topology healing (Minimum Spanning Tree, Union-Find) and betweenness-centrality analysis to flag critical infrastructure. Participated in ISRO BAH 2026.",
    features: [
      "Geospatial reconstruction of broken roads under heavy cloud and tree occlusions",
      "Hybrid TransUNet combining convolutional inductive bias with vision transformers",
      "Graph topology healing utilizing Minimum Spanning Tree and Union-Find",
      "Betweenness-centrality calculation to identify vulnerable transit arteries",
    ],
    tech: ["Python", "PyTorch", "FastAPI", "Leaflet.js"],
    github: "https://github.com/jatinkhandelwal662-jk/Project-S.E.T.U",
    live: "https://project-s-e-t-u.vercel.app",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cisco-iot",
    index: "01",
    title: "Introduction to IoT & Digital Transformation",
    issuer: "Cisco",
    date: "Sep 2025",
  },
];

export const EDUCATION_EXPERIENCE_TIMELINE: TimelineItem[] = [
  {
    id: "tradophile",
    year: "Oct 2025 – Present",
    title: "Core Member, Entrepreneurship Team",
    place: "Tradophile, GGSIPU EDC",
    type: "experience",
    detail:
      "Contributed to planning and execution of finance and entrepreneurship initiatives.",
  },
  {
    id: "acts-edc",
    year: "Sep 2025 – Present",
    title: "Team Member",
    place: "ACTS-EDC, GGSIPU East Campus",
    type: "experience",
    detail:
      "Coordinated on-ground execution and logistics for Brainwave 2026, a large-scale campus hackathon, working with faculty, mentors and organising teams.",
  },
  {
    id: "ggsipu",
    year: "2025 – 2029 (Expected)",
    title: "B.Tech, Industrial Internet of Things (IIoT)",
    place: "University School of Automation and Robotics (USAR), GGSIPU Delhi",
    score: "CGPA: 9.0 / 10 (First Year)",
    type: "education",
    detail:
      "Currently 2nd year student in Industrial Internet of Things. Maintained a 9.0 / 10 CGPA in first year.",
  },
  {
    id: "class-xii",
    year: "2025",
    title: "Class XII Senior Secondary",
    place: "Senior Secondary Board Examination",
    score: "89%",
    type: "education",
    detail:
      "Graduated with 89% aggregate with core focus in mathematics, sciences and computer science.",
  },
  {
    id: "class-x",
    year: "2023",
    title: "Class X Secondary Education",
    place: "Secondary School Examination",
    score: "93%",
    type: "education",
    detail:
      "Completed secondary education with 93% distinction across foundational disciplines.",
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "ideate-it-up",
    index: "01 / 05",
    number: 1,
    suffix: "st",
    label: "1st Place Winner",
    caption: "Ideate-it-Up 2026 · IGDTUW (Mar 2026)",
    detail:
      "Won 1st Place as Team Antigravity; solution pitch comprehensively evaluated and awarded by faculty.",
    platform: "IGDTUW",
    logo: "/logos/leetcode.svg",
    brandColor: "#FFA116",
    glow: "rgba(255, 161, 22, 0.18)",
  },
  {
    id: "hack4delhi",
    index: "02 / 05",
    number: 30,
    prefix: "Top ",
    suffix: "",
    label: "Certificate of Merit",
    caption: "Hack4Delhi 2026 · IEEE NSUT",
    detail:
      "Secured Top 30 ranking with Certificate of Merit for Delhi Sudarshan voice-first civic command system.",
    platform: "IEEE NSUT",
    logo: "/logos/geeksforgeeks.svg",
    brandColor: "#2F8D46",
    glow: "rgba(47, 141, 70, 0.18)",
  },
  {
    id: "isro-bah",
    index: "03 / 05",
    number: 2026,
    prefix: "BAH ",
    suffix: "",
    label: "National Participant",
    caption: "ISRO Bharatiya Antariksh Hackathon (Aug 2026)",
    detail:
      "Participated with Project S.E.T.U for occlusion-robust road topology reconstruction from satellite data.",
    platform: "ISRO",
    logo: "/logos/hackerrank.svg",
    brandColor: "#00EA64",
    glow: "rgba(0, 234, 100, 0.18)",
  },
  {
    id: "darkcode-rising",
    index: "04 / 05",
    number: 21,
    prefix: "Top ",
    suffix: "",
    label: "Finalist",
    caption: "DarkCode Rising · TechDome",
    detail:
      "Ranked Top 21 Finalist among nationwide competitors in high-speed algorithmic programming.",
    platform: "TechDome",
    logo: "/logos/codechef.svg",
    brandColor: "#5B4638",
    glow: "rgba(91, 70, 56, 0.18)",
  },
  {
    id: "academic-cgpa",
    index: "05 / 05",
    number: 9.0,
    isDecimal: true,
    suffix: " / 10",
    label: "Academic Standing",
    caption: "CGPA 9.0 · USAR GGSIPU",
    detail:
      "Earned 9.0 CGPA across first-year engineering coursework in Industrial Internet of Things.",
    platform: "Cisco IoT",
    logo: "/logos/cisco.svg",
    brandColor: "#049FD9",
    glow: "rgba(4, 159, 217, 0.18)",
  },
];
