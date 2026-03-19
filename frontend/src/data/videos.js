export const videos = [
  {
    id: "normalization-dbms",
    title: "Normalization in DBMS",
    description: "Understand normalization with simple terms and clear logical steps.",
    youtubeUrl: "https://www.youtube.com/embed/7V-L_8Z5_2U",
    thumbnail: "https://img.youtube.com/vi/7V-L_8Z5_2U/maxresdefault.jpg",
    duration: "8:20",
    subjectId: "dbms",
    category: "semester",
    semester: "Semester 5",
    topicsCovered: ["1NF", "2NF", "3NF", "BCNF"],
    isImportant: true,
    order: 1,
    notes: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.",
    examPoints: [
      "1NF: Atomic values, no repeating groups.",
      "2NF: 1NF + No partial dependency.",
      "3NF: 2NF + No transitive dependency.",
      "BCNF: 3NF + Every determinant is a candidate key."
    ]
  },
  {
    id: "mean-median-mode",
    title: "Central Tendency: Mean, Median, Mode",
    description: "The most important basics for any exam. Understand the difference correctly.",
    youtubeUrl: "https://www.youtube.com/embed/s2",
    thumbnail: "/images/hero_bg.png",
    duration: "6:15",
    subjectId: "statistics",
    category: "semester",
    semester: "Semester 5",
    topicsCovered: ["Mean calculation", "Median for odd/even", "Mode & Outliers"],
    isImportant: true,
    order: 2,
    notes: "Mean is the average and is sensitive to outliers. Median is the middle value and is more robust. Mode is the most frequent value. For a skewed distribution, Median is often better than Mean.",
    examPoints: [
      "Mean = Sum of elements / Number of elements.",
      "Median: Middle term after sorting. If even, average of middle two.",
      "Mode: Highest frequency element."
    ]
  },
  {
    id: "intro-stats",
    title: "Introduction to Statistics",
    description: "Why statistics matters in AI and Data Science. Foundations and terminology.",
    youtubeUrl: "https://www.youtube.com/embed/s1",
    thumbnail: "/images/hero_bg.png",
    duration: "5:30",
    subjectId: "statistics",
    category: "semester",
    semester: "Semester 5",
    topicsCovered: ["Definition", "Types of Data", "Population vs Sample"],
    isImportant: false,
    order: 1,
    notes: "Statistics is the science of learning from data. Basic types include Descriptive (summarizing data) and Inferential (making predictions). In AI, we use statistics to understand data distributions and model performance.",
    examPoints: [
      "Descriptive Statistics: Mean, Median, Mode, Variance.",
      "Inferential Statistics: Hypothesis testing, P-values.",
      "Sample vs Population: Sample is a subset of the population."
    ]
  },
  {
    id: "neural-networks-intro-vid",
    title: "Neural Networks Fundamentals",
    description: "Understand the architecture of neurons, layers, and activation functions in minutes.",
    youtubeUrl: "https://www.youtube.com/embed/example2",
    thumbnail: "/images/v_thumb_nn.png",
    duration: "8:00",
    subjectId: "ai-ml",
    category: "ai-ml",
    semester: "Semester 7",
    topicsCovered: ["Architecture", "Neurons", "Layers", "Activation Functions"],
    isImportant: true,
    order: 1,
    notes: "Neural networks are inspired by the human brain. They consist of input, hidden, and output layers. Activation functions define the output of a neuron given an input or set of inputs.",
    examPoints: [
      "Backpropagation is the key training algorithm.",
      "ReLU is the most common activation function.",
      "Weights and Biases are the learnable parameters."
    ]
  },
  {
    id: "react-hooks-vid",
    title: "React Hooks Simplified",
    description: "Master useState, useEffect, and useContext in high-octane 5-minute packets.",
    youtubeUrl: "https://www.youtube.com/embed/example3",
    thumbnail: "/images/v_thumb_react.png",
    duration: "5:45",
    subjectId: "web-dev",
    category: "web-dev",
    semester: "Semester 5",
    topicsCovered: ["useState", "useEffect", "useContext"],
    isImportant: true,
    order: 1,
    notes: "Hooks allow you to use state and other React features without writing a class. They provide a more functional approach to building components.",
    examPoints: [
      "Only call Hooks at the top level.",
      "Only call Hooks from React functions.",
      "Rules of Hooks ensure consistent state management."
    ]
  }
];
