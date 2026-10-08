export const videos = [
  {
    id: 1,
    title: "Movie Recommendation System Explained: Content-Based Filtering, TF-IDF & Cosine Similarity",
    description: "Understand the end-to-end architecture of a machine learning movie recommendation system: data preprocessing, TF-IDF vectorization, cosine similarity computation, Streamlit UI, and TMDB API integration.",
    youtube_id: "rVTSqba7UWk",
    youtubeUrl: "https://www.youtube.com/embed/rVTSqba7UWk",
    thumbnail: "https://img.youtube.com/vi/rVTSqba7UWk/maxresdefault.jpg",
    duration: "12:45",
    subjectId: "machine-learning",
    category: "ai-ml",
    subcategory: "Applied Machine Learning",
    order: 1,
    topicsCovered: [
      "Content-Based Filtering Principles",
      "Data Preprocessing & Feature Engineering",
      "TF-IDF Vectorization Mechanics",
      "Cosine Similarity Matrix Calculation",
      "Streamlit UI & TMDB API Integration"
    ],
    roadmap: [
      "Recommendation Systems Overview",
      "Content-Based vs Collaborative Filtering",
      "TF-IDF Vectorizer & Stopwords",
      "Cosine Similarity Mathematical Intuition",
      "Streamlit Deployment & Model Serialization"
    ],
    quick_summary: "Content-based recommendation systems extract feature vectors from metadata using TF-IDF and compute pairwise cosine similarity scores to recommend the top N closest items to a user's selection.",
    is_important: true,
    type: "Theory"
  },
  {
    id: 2,
    title: "Linear Regression in Machine Learning: Loss Function & Gradient Descent",
    description: "Learn how linear regression models continuous relationships, formulates the Mean Squared Error (MSE) cost function, and minimizes loss using gradient descent.",
    youtube_id: "2_-boldmaFQ",
    youtubeUrl: "https://www.youtube.com/embed/2_-boldmaFQ",
    thumbnail: "https://img.youtube.com/vi/2_-boldmaFQ/maxresdefault.jpg",
    duration: "4:50",
    subjectId: "machine-learning",
    category: "ai-ml",
    subcategory: "Supervised Learning",
    order: 2,
    topicsCovered: [
      "Linear Hypothesis (y = mx + c)",
      "Mean Squared Error (MSE) Cost Function",
      "Gradient Descent Parameter Update",
      "Learning Rate Hyperparameter"
    ],
    roadmap: [
      "Problem Formulation",
      "Hypothesis Function",
      "Loss Calculation",
      "Gradient Descent Step",
      "Convergence Check"
    ],
    quick_summary: "Linear Regression finds the optimal line that minimizes the sum of squared differences between predicted values and actual observations using iterative gradient updates.",
    is_important: true,
    type: "Numerical"
  },
  {
    id: 3,
    title: "Ordinary Least Squares & Best Fit Line Calculation",
    description: "Master the mathematical derivation of the Ordinary Least Squares (OLS) line of best fit, slope, intercept, and R-squared variance explanation.",
    youtube_id: "HiMaBCL-6Qg",
    youtubeUrl: "https://www.youtube.com/embed/HiMaBCL-6Qg",
    thumbnail: "https://img.youtube.com/vi/HiMaBCL-6Qg/maxresdefault.jpg",
    duration: "5:15",
    subjectId: "machine-learning",
    category: "ai-ml",
    subcategory: "Supervised Learning",
    order: 3,
    topicsCovered: [
      "Sum of Squared Residuals (SSR)",
      "Analytical Slope (m) & Intercept (c)",
      "Covariance and Variance Relationship",
      "R-Squared (Coefficient of Determination)"
    ],
    roadmap: [
      "Residual Definition",
      "Minimizing Squared Residuals",
      "Closed-Form Matrix Solution",
      "Goodness of Fit Analysis"
    ],
    quick_summary: "Ordinary Least Squares analytically computes the optimal slope and intercept that minimizes the total residual sum of squares without requiring iterative optimization.",
    is_important: true,
    type: "Numerical"
  },
  {
    id: 4,
    title: "Categorical Data Types in ML: Nominal, Ordinal, and Binary Feature Encoding",
    description: "Understand the distinctions between nominal, ordinal, and binary categorical variables and choose the appropriate encoding technique (One-Hot vs Label Encoding).",
    youtube_id: "-Rs2pnuBJF4",
    youtubeUrl: "https://www.youtube.com/embed/-Rs2pnuBJF4",
    thumbnail: "https://img.youtube.com/vi/-Rs2pnuBJF4/maxresdefault.jpg",
    duration: "4:40",
    subjectId: "machine-learning",
    category: "ai-ml",
    subcategory: "Data Preprocessing",
    order: 4,
    topicsCovered: [
      "Nominal Data (Unordered)",
      "Ordinal Data (Natural Ranking)",
      "Binary Variables (2-State)",
      "One-Hot Encoding vs Ordinal Encoding"
    ],
    roadmap: [
      "Categorical vs Numerical",
      "Nominal Encoding Strategies",
      "Ordinal Encoding Preservation",
      "Feature Matrix Expansion Trade-offs"
    ],
    quick_summary: "Different categorical data types require distinct preprocessing: ordinal features preserve ranking order, while nominal features use dummy/one-hot encoding to avoid false mathematical ordering.",
    is_important: true,
    type: "Theory"
  },
  {
    id: 5,
    title: "Artificial Intelligence vs Machine Learning vs Deep Learning Hierarchy",
    description: "Clear breakdown of the relationship between Artificial Intelligence, Machine Learning, and Deep Learning with practical engineering examples.",
    youtube_id: "5Ajp5oPinJs",
    youtubeUrl: "https://www.youtube.com/embed/5Ajp5oPinJs",
    thumbnail: "https://img.youtube.com/vi/5Ajp5oPinJs/maxresdefault.jpg",
    duration: "5:00",
    subjectId: "machine-learning",
    category: "ai-ml",
    subcategory: "AI Foundations",
    order: 5,
    topicsCovered: [
      "AI as the Overarching Goal",
      "ML as Statistical Pattern Recognition",
      "DL as Hierarchical Neural Representations",
      "Practical Decision Framework"
    ],
    roadmap: [
      "The Three Concentric Circles",
      "Symbolic AI vs Statistical ML",
      "Feature Engineering vs Deep Representation",
      "Modern Applications"
    ],
    quick_summary: "AI defines the goal of intelligent behavior; ML provides algorithms that learn patterns from data; DL utilizes deep neural network architectures to automatically learn hierarchical features.",
    is_important: true,
    type: "Theory"
  },
  {
    id: 6,
    title: "Relational SQL & Cloud Database Fundamentals",
    description: "Understand the relational data model, ACID guarantees, SQL query execution, and managed Cloud SQL deployments.",
    youtube_id: "SbTs57YD1CA",
    youtubeUrl: "https://www.youtube.com/embed/SbTs57YD1CA",
    thumbnail: "https://img.youtube.com/vi/SbTs57YD1CA/maxresdefault.jpg",
    duration: "5:10",
    subjectId: "dbms",
    category: "computer-science",
    subcategory: "Database Systems",
    order: 1,
    topicsCovered: [
      "Relational Tables & Primary Keys",
      "ACID Transaction Principles",
      "SQL Joins and Filtering",
      "Cloud SQL Architecture & High Availability"
    ],
    roadmap: [
      "Relational Fundamentals",
      "ACID Transaction Guarantees",
      "SQL Execution & Indexing",
      "Cloud Database Scaling"
    ],
    quick_summary: "Relational SQL databases enforce structured schemas and ACID transaction integrity, providing robust consistency guarantees for enterprise applications on-premise and in the cloud.",
    is_important: true,
    type: "Theory"
  }
];
