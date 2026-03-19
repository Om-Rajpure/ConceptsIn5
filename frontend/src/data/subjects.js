const baseSubjects = [
  {
    id: "statistics",
    name: "Statistics (AIDS)",
    description: "Master statistics concepts quickly with structured videos, notes, and exam-ready insights.",
    duration: "~60 mins",
    roadmap: [
      { id: "intro-stats", title: "Basics of Statistics" },
      { id: "mean-median-mode", title: "Mean, Median, Mode" },
      { id: "probability-essentials", title: "Probability" },
      { id: "distributions", title: "Distributions" },
      { id: "hypothesis-testing", title: "Hypothesis Testing" }
    ],
    importantTopics: ["Mean, Median, Mode", "Standard Deviation", "Probability Distributions"],
    videos: [
      {
        id: "intro-stats",
        title: "Introduction to Statistics",
        description: "Why statistics matters in AI and Data Science. Foundations and terminology.",
        youtubeUrl: "https://www.youtube.com/embed/s1",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "5:30",
        subject: "Statistics",
        category: "Semester",
        semester: "Semester 5",
        topicsCovered: ["Definition", "Types of Data", "Population vs Sample"],
        notes: "Statistics is the science of learning from data. Basic types include Descriptive (summarizing data) and Inferential (making predictions). In AI, we use statistics to understand data distributions and model performance.",
        examPoints: [
          "Descriptive Statistics: Mean, Median, Mode, Variance.",
          "Inferential Statistics: Hypothesis testing, P-values.",
          "Sample vs Population: Sample is a subset of the population."
        ]
      },
      {
        id: "mean-median-mode",
        title: "Central Tendency: Mean, Median, Mode",
        description: "The most important basics for any exam. Understand the difference correctly.",
        youtubeUrl: "https://www.youtube.com/embed/s2",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "6:15",
        subject: "Statistics",
        category: "Semester",
        semester: "Semester 5",
        topicsCovered: ["Mean calculation", "Median for odd/even", "Mode & Outliers"],
        notes: "Mean is the average and is sensitive to outliers. Median is the middle value and is more robust. Mode is the most frequent value. For a skewed distribution, Median is often better than Mean.",
        examPoints: [
          "Mean = Sum of elements / Number of elements.",
          "Median: Middle term after sorting. If even, average of middle two.",
          "Mode: Highest frequency element."
        ]
      }
    ]
  },
  {
    id: "dbms",
    name: "Data Base Management Systems",
    description: "Master SQL, Normalization, and Transactions with structured learning.",
    duration: "~80 mins",
    roadmap: [
      { id: "dbms-intro", title: "Introduction" },
      { id: "normalization-dbms", title: "Normalization" },
      { id: "sql-queries", title: "SQL Mastery" }
    ],
    importantTopics: ["Normalization", "Indexing", "ACID Properties"],
    videos: [
      {
        id: "normalization-dbms",
        title: "Normalization in DBMS",
        description: "Understand normalization with simple terms and clear logical steps.",
        youtubeUrl: "https://www.youtube.com/embed/example_dbms",
        thumbnail: "https://img.youtube.com/vi/placeholder/maxresdefault.jpg",
        duration: "8:20",
        subject: "DBMS",
        category: "Semester",
        semester: "Semester 5",
        topicsCovered: ["1NF", "2NF", "3NF", "BCNF"],
        notes: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.",
        examPoints: [
          "1NF: Atomic values, no repeating groups.",
          "2NF: 1NF + No partial dependency.",
          "3NF: 2NF + No transitive dependency.",
          "BCNF: 3NF + Every determinant is a candidate key."
        ]
      }
    ]
  }
];

export const subjects = baseSubjects.map(subject => ({
  ...subject,
  videos: subject.videos.map(v => ({
    ...v,
    // Add defaults if missing, ensure youtubeUrl is proper embed
    youtubeUrl: v.youtubeUrl ? v.youtubeUrl : (v.id === "normalization-dbms" ? "https://www.youtube.com/embed/7V-L_8Z5_2U" : "https://www.youtube.com/embed/placeholder"),
    topicsCovered: v.topicsCovered || v.topics || [],
    examPoints: v.examPoints || ["Point 1", "Point 2"],
    subject: subject.name,
    category: v.category || "Semester",
    semester: v.semester || "Semester 5"
  }))
}));
