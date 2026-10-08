export const categories = [
  {
    id: "computer-science",
    slug: "computer-science",
    name: "Computer Science & Core Systems",
    description: "Operating systems, computer networks, database systems, and system design.",
    icon: "Layers",
    theme_color: "#00F0FF",
    subcategories: [
      {
        name: "Database Systems",
        slug: "database-systems",
        items: [
          { id: "dbms", slug: "dbms", title: "Database Management Systems", description: "Normalization, SQL, indexing, and ACID transactions.", thumbnail: "/images/thumb_dbms.png", videoCount: 6, duration: "32m" }
        ]
      },
      {
        name: "Operating Systems",
        slug: "operating-systems",
        items: [
          { id: "os", slug: "os", title: "Operating Systems", description: "Process scheduling, deadlocks, memory management, and paging.", thumbnail: "/images/thumb_os.png", videoCount: 5, duration: "28m" }
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    slug: "ai-ml",
    name: "AI & Machine Learning",
    description: "Core machine learning algorithms, deep neural architectures, and statistical foundations.",
    icon: "Sparkles",
    theme_color: "#7B61FF",
    subcategories: [
      {
        name: "Machine Learning Foundations",
        slug: "ml-foundations",
        items: [
          { id: "ai-ml", slug: "ai-ml", title: "Machine Learning Core", description: "Linear models, decision trees, loss functions, and neural networks.", thumbnail: "/images/thumb_ml.png", videoCount: 6, duration: "35m" }
        ]
      },
      {
        name: "Data Science & Mathematics",
        slug: "data-science-math",
        items: [
          { id: "statistics", slug: "statistics", title: "Engineering Statistics", description: "Probability distributions, central tendency, hypothesis testing.", thumbnail: "/images/thumb_stats.png", videoCount: 4, duration: "22m" }
        ]
      }
    ]
  },
  {
    id: "web-dev",
    slug: "web-dev",
    name: "Software & Web Engineering",
    description: "Modern full-stack architectures, API design, React hooks, and asynchronous systems.",
    icon: "Zap",
    theme_color: "#00F0FF",
    subcategories: [
      {
        name: "Modern Frontend & Fullstack",
        slug: "frontend-fullstack",
        items: [
          { id: "web-dev", slug: "web-dev", title: "Fullstack Web Engineering", description: "React component architecture, state management, and REST APIs.", thumbnail: "/images/thumb_web.png", videoCount: 5, duration: "25m" }
        ]
      }
    ]
  }
];
