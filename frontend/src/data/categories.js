export const categories = [
  {
    id: "semester",
    name: "Semester Subjects",
    description: "Explore subjects organized semester-wise with structured video-based learning.",
    subcategories: [
      {
        name: "Semester 5",
        items: [
          { id: "web-computing", title: "Web Computing", description: "Modern web architecture and React.", thumbnail: "/images/thumb_web.png", videoCount: 12, duration: "60m" },
          { id: "os", title: "Operating Systems", description: "Kernels, threads, and scheduling.", thumbnail: "/images/thumb_os.png", videoCount: 15, duration: "75m" }
        ]
      },
      {
        name: "Semester 6",
        items: [
          { id: "cn", title: "Computer Networks", description: "TCP/IP, OSI, and network security.", thumbnail: "/images/thumb_subjects.png", videoCount: 10, duration: "50m" },
          { id: "se", title: "Software Engineering", description: "SDLC and high-level design.", thumbnail: "/images/thumb_subjects.png", videoCount: 8, duration: "40m" }
        ]
      },
      {
        name: "Semester 7",
        items: [
          { id: "machine-learning", title: "Machine Learning (Core)", description: "Advanced ML models for major projects.", thumbnail: "/images/thumb_ml.png", videoCount: 14, duration: "70m" }
        ]
      },
      {
        name: "Semester 8",
        items: [
          { id: "cloud-computing", title: "Cloud Computing", description: "Deployment at scale.", thumbnail: "/images/thumb_subjects.png", videoCount: 6, duration: "30m" }
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    description: "Master the algorithms that power the future. From basics to autonomous agents.",
    subcategories: [
      {
        name: "Artificial Intelligence",
        items: [
          { id: "ai-basics", title: "AI Fundamentals", description: "Search algorithms and heuristics.", thumbnail: "/images/thumb_ml.png", videoCount: 10, duration: "50m" }
        ]
      },
      {
        name: "Machine Learning",
        items: [
          { id: "machine-learning", title: "ML Core", description: "Regression, Classification, and Clustering.", thumbnail: "/images/thumb_ml.png", videoCount: 18, duration: "90m" }
        ]
      },
      {
        name: "Deep Learning",
        items: [
          { id: "dl-intro", title: "Neural Networks", description: "Backpropagation and CNNs.", thumbnail: "/images/thumb_ai.png", videoCount: 12, duration: "60m" }
        ]
      },
      {
        name: "Generative AI",
        items: [
          { id: "gen-ai-llm", title: "LLMs & Transformers", description: "Prompt engineering and fine-tuning.", thumbnail: "/images/thumb_ai.png", videoCount: 8, duration: "40m" }
        ]
      },
      {
        name: "Agentic AI",
        items: [
          { id: "ai-agents", title: "Autonomous Agents", description: "Building goal-oriented AI systems.", thumbnail: "/images/thumb_ai.png", videoCount: 6, duration: "30m" }
        ]
      }
    ]
  },
  {
    id: "web-dev",
    name: "Web Development",
    description: "Modern web engineering. From HTML to AWS deployment.",
    subcategories: [
      {
        name: "Frontend",
        items: [
          { id: "frontend-basics", title: "HTML, CSS, JS", description: "The foundations of the web.", thumbnail: "/images/thumb_web.png", videoCount: 20, duration: "100m" }
        ]
      },
      {
        name: "Advanced Frontend",
        items: [
          { id: "web-computing", title: "React Ecosystem", description: "Hooks, State, and Next.js.", thumbnail: "/images/thumb_web.png", videoCount: 15, duration: "75m" }
        ]
      },
      {
        name: "Backend",
        items: [
          { id: "node-express", title: "Node.js & Express", description: "Building scalable APIs.", thumbnail: "/images/thumb_web.png", videoCount: 12, duration: "60m" }
        ]
      },
      {
        name: "Database",
        items: [
          { id: "dbms", title: "DB Architecture", description: "PostgreSQL, MongoDB, and Redis.", thumbnail: "/images/thumb_dbms.png", videoCount: 15, duration: "75m" }
        ]
      },
      {
        name: "Security",
        items: [
          { id: "web-security", title: "Web Security (OWASP)", description: "Preventing lethal vulnerabilities.", thumbnail: "/images/thumb_web.png", videoCount: 8, duration: "40m" }
        ]
      },
      {
        name: "Deployment & AWS",
        items: [
          { id: "aws-basics", title: "Cloud Deployment", description: "EC2, S3, and CloudFront.", thumbnail: "/images/thumb_projects.png", videoCount: 10, duration: "50m" }
        ]
      }
    ]
  },
  {
    id: "mini-projects",
    name: "Mini Projects",
    description: "Build high-impact projects with step-by-step guidance. Fast implementation.",
    subcategories: [
      {
        name: "Featured Projects",
        items: [
          { id: "timetable-gen", title: "Timetable Generator", description: "Advanced scheduling algorithm project.", thumbnail: "/images/thumb_projects.png", videoCount: 4, duration: "25m" },
          { id: "vaccines-app", title: "Vaccines App", description: "Full-stack healthcare project.", thumbnail: "/images/thumb_projects.png", videoCount: 6, duration: "35m" },
          { id: "facultymind", title: "FacultyMind AI", description: "Expert-system AI application.", thumbnail: "/images/thumb_ai.png", videoCount: 8, duration: "45m" }
        ]
      }
    ]
  }
];
