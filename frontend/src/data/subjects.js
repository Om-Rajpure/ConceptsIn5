export const subjects = [
  {
    id: "statistics",
    name: "Statistics (AIDS)",
    description: "Master statistics concepts quickly with structured videos, notes, and exam-ready insights.",
    duration: "~60 mins",
    roadmap: [
      { id: "v1", title: "Basics of Statistics" },
      { id: "v2", title: "Mean, Median, Mode" },
      { id: "v3", title: "Probability" },
      { id: "v4", title: "Distributions" },
      { id: "v5", title: "Hypothesis Testing" }
    ],
    importantTopics: ["Mean, Median, Mode", "Standard Deviation", "Probability Distributions"],
    videos: [
      {
        id: "v1",
        title: "01. Introduction to Statistics",
        description: "Why statistics matters in AI and Data Science. Foundations and terminology.",
        youtube: "https://youtube.com/watch?v=s1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "5:30",
        topics: ["Definition", "Types of Data", "Population vs Sample"],
        notes: "Statistics is the science of learning from data. Basic types include Descriptive and Inferential."
      },
      {
        id: "v2",
        title: "02. Central Tendency: Mean, Median, Mode",
        description: "The most important basics for any exam. Understand the difference correctly.",
        youtube: "https://youtube.com/watch?v=s2",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "6:15",
        topics: ["Mean calculation", "Median for odd/even", "Mode & Outliers"],
        notes: "Mean is sensitive to outliers. Median is the middle value. Mode is the most frequent."
      },
      {
        id: "v3",
        title: "03. Probability Essentials",
        description: "The math behind randomness. Essential for Machine Learning.",
        youtube: "https://youtube.com/watch?v=s3",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "8:45",
        topics: ["Events", "Sample Space", "Conditional Probability"],
        notes: "P(A|B) = P(A and B) / P(B). Fundamental for Bayesian models."
      }
    ]
  },
  {
    id: "web-computing",
    name: "Web Computing",
    description: "From HTTP basics to modern frameworks. Learn web architecture through structured videos.",
    duration: "~75 mins",
    roadmap: [
      { id: "w1", title: "Web Architecture" },
      { id: "w2", title: "HTTP Protocol" },
      { id: "w3", title: "DOM Secrets" },
      { id: "w4", title: "Next.js Intro" }
    ],
    importantTopics: ["HTTP/HTTPS", "DOM Manipulation", "REST APIs"],
    videos: [
      {
        id: "w1",
        title: "01. Web Architecture Explained",
        description: "How the internet actually works. Client-server model in depth.",
        youtube: "https://youtube.com/watch?v=w1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "7:20",
        topics: ["DNS", "IP", "Client-Server"],
        notes: "The web is a system of public components that work together."
      }
    ]
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "The core of AI simplified. Watch, learn, and implement ML models.",
    duration: "~90 mins",
    roadmap: [
      { id: "m1", title: "Linear Regression" },
      { id: "m2", title: "Logistic Regression" },
      { id: "m3", title: "Neural Networks" },
      { id: "m4", title: "Model Tuning" }
    ],
    importantTopics: ["Gradient Descent", "Loss Functions", "Backpropagation"],
    videos: [
      {
        id: "m1",
        title: "01. Linear Regression Fundamentals",
        description: "Predicting outcomes with math. The simplest yet most powerful ML model.",
        youtube: "https://youtube.com/watch?v=m1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "10:15",
        topics: ["Best fit line", "R-squared", "MSE"],
        notes: "Y = mX + c. We minimize the Mean Squared Error to find the best line."
      }
    ]
  },
  {
    id: "dav",
    name: "Data Analytics & Visualization (DAV)",
    description: "Turn raw data into lethal insights. Master visualization using real datasets.",
    duration: "~50 mins",
    roadmap: [
      { id: "d1", title: "Data Cleaning" },
      { id: "d2", title: "Exploratory Data Analysis" },
      { id: "d3", title: "Visualization Patterns" }
    ],
    importantTopics: ["Pandas Basics", "Choosing Charts", "Data Storytelling"],
    videos: [
      {
        id: "d1",
        title: "01. Data Cleaning at Scale",
        description: "Preparation is 80% of the work. Clean your data like a pro.",
        youtube: "https://youtube.com/watch?v=d1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "9:30",
        topics: ["Missing values", "Outliers", "Data Types"],
        notes: "Garbage in, garbage out. Cleaning is the most critical step in DA."
      }
    ]
  },
  {
    id: "mini-projects",
    name: "Mini Projects",
    description: "Build high-impact projects with step-by-step guidance. Fast implementation.",
    duration: "Varies",
    roadmap: [
      { id: "p1", title: "Automated Portfolio" },
      { id: "p2", title: "AI Chatbot" }
    ],
    importantTopics: ["GitHub Actions", "API Integration", "Deployment"],
    videos: [
      {
        id: "p1",
        title: "Build an Automated Portfolio",
        description: "Deploy a personal site that updates from your GitHub activity.",
        youtube: "https://youtube.com/watch?v=p1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "15:00",
        topics: ["GitHub API", "React", "Actions"],
        notes: "Automate your presence. High signal for recruiters."
      }
    ]
  },
  // Skeleton Data for New Subjects
  ...[
    "cn", "se", "cloud-computing", "ai-basics", "dl-intro", "gen-ai-llm", "ai-agents",
    "frontend-basics", "node-express", "web-security", "aws-basics",
    "timetable-gen", "vaccines-app", "facultymind", "dbms", "os"
  ].map(id => ({
    id,
    name: id.toUpperCase().replace(/-/g, ' '),
    description: `Master ${id} with structured videos and notes.`,
    duration: "Varies",
    roadmap: [{ id: "temp", title: "Introduction" }],
    importantTopics: ["Topic 1", "Topic 2"],
    videos: [{ id: "temp", title: "Coming Soon", description: "Module incoming.", youtube: "", thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg", duration: "5:00", topics: ["Intro"], notes: "Notes coming soon." }]
  }))
];
