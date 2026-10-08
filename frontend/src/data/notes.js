export const notes = [
  {
    id: 1,
    title: "Movie Recommendation System: TF-IDF & Cosine Similarity Architecture",
    subjectId: "machine-learning",
    videoId: 1,
    category: "ai-ml",
    subcategory: "Applied Machine Learning",
    tags: ["Machine Learning", "Recommendation Systems", "TF-IDF", "Cosine Similarity", "Python"],
    type: "Study Guide",
    description: "End-to-end technical guide for content-based movie recommendation: TF-IDF vectorization mathematics, cosine similarity matrices, and Streamlit deployment.",
    content: `## Content-Based Recommendation System Architecture

### 1. The Core Objective
A Content-Based Recommendation System recommends items to a user based on the similarity between item metadata (e.g., genres, keywords, cast, overview) rather than collective user behavior.

### 2. Feature Extraction: TF-IDF Vectorization
Textual descriptions and tag soups are converted into numerical feature vectors using **Term Frequency-Inverse Document Frequency (TF-IDF)**:

$$\\text{TF}(t, d) = \\frac{\\text{Count of term } t \\text{ in document } d}{\\text{Total words in document } d}$$

$$\\text{IDF}(t, D) = \\log\\left(\\frac{N}{1 + |\\{d \\in D : t \\in d\\}|}\\right)$$

$$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\text{IDF}(t, D)$$

- **Why TF-IDF?** Penalizes common English words ("the", "is") while amplifying distinguishing keywords ("cyberpunk", "quantum", "dystopia").

### 3. Measuring Closeness: Cosine Similarity
To measure the similarity between two $n$-dimensional movie vectors $\\mathbf{A}$ and $\\mathbf{B}$:

$$\\cos(\\theta) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|} = \\frac{\\sum_{i=1}^n A_i B_i}{\\sqrt{\\sum_{i=1}^n A_i^2} \\sqrt{\\sum_{i=1}^n B_i^2}}$$

- Output range: $[0, 1]$ (for non-negative TF-IDF vectors).
- $1.0$ indicates identical direction (highest similarity), $0.0$ indicates orthogonal/unrelated topics.

### 4. Implementation Pipeline
1. **Data Preprocessing:** Extract genres, keywords, cast from TMDB 5000 dataset, apply lowercase normalization and stemming.
2. **Matrix Construction:** Generate $5000 \\times 5000$ pairwise similarity matrix using Scikit-Learn.
3. **Model Persistence:** Serialize preprocessed dataframe and similarity matrix using Python \`pickle\` (\`.pkl\`).
4. **Interactive UI:** Streamlit dropdown menu triggers TMDB API queries to render high-resolution movie posters dynamically.`,
    examPoints: [
      "Content-Based: Recommends items based on item attributes, not user history.",
      "TF-IDF: Balances term frequency with corpus rarity to highlight distinctive keywords.",
      "Cosine Similarity: Measures angle between vectors regardless of document length.",
      "Pickle (.pkl): Efficiently serializes precomputed similarity matrices for low-latency retrieval."
    ],
    thumbnail: "https://img.youtube.com/vi/rVTSqba7UWk/maxresdefault.jpg"
  },
  {
    id: 2,
    title: "Linear Regression: Cost Function Formulation & Gradient Descent",
    subjectId: "machine-learning",
    videoId: 2,
    category: "ai-ml",
    subcategory: "Supervised Learning",
    tags: ["Machine Learning", "Linear Regression", "Gradient Descent", "Loss Functions"],
    type: "Study Guide",
    description: "Mathematical formulation of Linear Regression, Mean Squared Error (MSE), partial derivatives, and parameter update rules.",
    content: `## Linear Regression Mechanics

### 1. Hypothesis Function
For single-variable linear regression:

$$\\hat{y} = h_\\theta(x) = \\theta_0 + \\theta_1 x = mx + c$$

Where $\\theta_1$ (or $m$) is the slope/weight, and $\\theta_0$ (or $c$) is the intercept/bias.

### 2. Cost Function (Mean Squared Error)
The goal is to find parameters $\\theta$ that minimize the sum of squared differences between predictions and true labels:

$$J(\\theta_0, \\theta_1) = \\frac{1}{2m} \\sum_{i=1}^m \\left( h_\\theta(x^{(i)}) - y^{(i)} \\right)^2$$

### 3. Gradient Descent Optimization
Parameters are updated iteratively in the direction of the steepest descent:

$$\\theta_j := \\theta_j - \\alpha \\frac{\\partial}{\\partial \\theta_j} J(\\theta_0, \\theta_1)$$

Where $\\alpha$ is the **Learning Rate**:
- If $\\alpha$ is too small: Convergence is extremely slow.
- If $\\alpha$ is too large: Gradient descent can overshoot the minimum and diverge.`,
    examPoints: [
      "MSE Cost Function is convex (parabolic bowl), guaranteeing a global minimum.",
      "Gradient vector points in the direction of greatest increase; we subtract to minimize loss.",
      "Learning rate alpha governs step size per iteration."
    ],
    thumbnail: "https://img.youtube.com/vi/2_-boldmaFQ/maxresdefault.jpg"
  },
  {
    id: 3,
    title: "Ordinary Least Squares (OLS) Derivation & Best Fit Line",
    subjectId: "machine-learning",
    videoId: 3,
    category: "ai-ml",
    subcategory: "Supervised Learning",
    tags: ["Linear Algebra", "OLS", "Statistics", "Formulas"],
    type: "Formulas",
    description: "Closed-form analytical solution for the line of best fit using Covariance and Variance.",
    content: `## Ordinary Least Squares (OLS) Closed-Form Solution

### 1. Analytical Formulas
Rather than using iterative gradient descent, OLS calculates the exact optimal parameters analytically:

$$m = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^n (x_i - \\bar{x})^2} = \\frac{\\text{Cov}(X, Y)}{\\text{Var}(X)}$$

$$c = \\bar{y} - m \\bar{x}$$

### 2. Coefficient of Determination ($R^2$)
Measures the proportion of variance in the dependent variable explained by the linear model:

$$R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}} = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$

- $R^2 = 1.0$: Perfect fit.
- $R^2 = 0.0$: Model predicts no better than the mean of $Y$.`,
    examPoints: [
      "OLS computes global optimal slope via Cov(X, Y) / Var(X).",
      "Regression line always passes through the centroid point (x̄, ȳ).",
      "R-squared represents the fraction of total variance explained by the model."
    ],
    thumbnail: "https://img.youtube.com/vi/HiMaBCL-6Qg/maxresdefault.jpg"
  },
  {
    id: 4,
    title: "Categorical Feature Engineering: Nominal, Ordinal & Binary Data",
    subjectId: "machine-learning",
    videoId: 4,
    category: "ai-ml",
    subcategory: "Data Preprocessing",
    tags: ["Data Preprocessing", "Feature Engineering", "Categorical Data", "Encoding"],
    type: "Cheat Sheet",
    description: "Comprehensive guide to classifying categorical variables and applying One-Hot vs Label Encoding without inducing false relationships.",
    content: `## Categorical Data Encoding in ML

### 1. Data Type Classifications
- **Nominal Data:** Distinct categories with NO intrinsic ranking (e.g., Colors, Cities, Blood Groups).
- **Ordinal Data:** Categories with a clear, meaningful hierarchy (e.g., Education: High School < Bachelor < Master < PhD; Rating: Low < Medium < High).
- **Binary Data:** Exactly two mutually exclusive categories (e.g., Yes/No, True/False, Male/Female).

### 2. Encoding Strategies
1. **One-Hot Encoding:** Creates a binary column for each category. Use for Nominal features with low cardinality ($< 15$ unique values).
2. **Ordinal / Label Encoding:** Maps categories to sequential integers ($0, 1, 2, \\dots$). Use ONLY when ranking holds true mathematical meaning.
3. **Target Encoding:** Replaces categories with the average target value. Useful for high-cardinality nominal data.`,
    examPoints: [
      "Never use Label Encoding on Nominal data (models will infer false numerical magnitude).",
      "One-Hot Encoding can cause the Curse of Dimensionality if cardinality is high.",
      "Drop one dummy column (drop_first=True) to prevent multicollinearity in linear models."
    ],
    thumbnail: "https://img.youtube.com/vi/-Rs2pnuBJF4/maxresdefault.jpg"
  },
  {
    id: 5,
    title: "AI vs Machine Learning vs Deep Learning Architectural Hierarchy",
    subjectId: "machine-learning",
    videoId: 5,
    category: "ai-ml",
    subcategory: "AI Foundations",
    tags: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Overview"],
    type: "Study Guide",
    description: "Conceptual breakdown of the AI umbrella: rule-based systems, statistical machine learning, and representation learning via deep neural nets.",
    content: `## The AI, ML & Deep Learning Spectrum

### 1. The Concentric Hierarchy
$$\\text{Artificial Intelligence} \\supset \\text{Machine Learning} \\supset \\text{Deep Learning}$$

- **Artificial Intelligence (1950s+):** Any technique enabling computers to mimic human intelligence (symbolic AI, expert systems, planning algorithms).
- **Machine Learning (1980s+):** Algorithms that parse data, learn from it, and make predictions without being explicitly hard-coded (SVM, Decision Trees, Linear Models).
- **Deep Learning (2010s+):** Multi-layered artificial neural networks capable of end-to-end representation learning from raw data (images, audio, unstructured text).`,
    examPoints: [
      "AI is the goal; ML is the method; DL is the deep neural architecture.",
      "Classical ML requires manual feature engineering; DL learns representations directly.",
      "DL requires large datasets and GPU acceleration to outperform classical ML."
    ],
    thumbnail: "https://img.youtube.com/vi/5Ajp5oPinJs/maxresdefault.jpg"
  },
  {
    id: 6,
    title: "Relational Database Management (RDBMS) & ACID Guarantees",
    subjectId: "dbms",
    videoId: 6,
    category: "computer-science",
    subcategory: "Database Systems",
    tags: ["DBMS", "SQL", "ACID", "Cloud Databases"],
    type: "Cheat Sheet",
    description: "Core relational principles, schema relationships, ACID transaction guarantees, and cloud database deployment architecture.",
    content: `## Relational DBMS & ACID Guarantees

### 1. The ACID Transaction Properties
- **Atomicity:** All operations in a transaction succeed, or the entire transaction is rolled back ("all or nothing").
- **Consistency:** Transactions transition the database from one valid state to another, satisfying all constraints.
- **Isolation:** Concurrent transactions execute without interfering with one another.
- **Durability:** Once committed, changes survive system crashes and power failures.

### 2. Cloud SQL Architecture
Managed Cloud SQL services (e.g., PostgreSQL on AWS RDS/Render/Cloud SQL) automate replication, failover, and point-in-time recovery while preserving strict relational schema guarantees.`,
    examPoints: [
      "Atomicity is enforced via undo logs and rollback mechanisms.",
      "Durability is guaranteed through Write-Ahead Logging (WAL).",
      "Isolation levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable."
    ],
    thumbnail: "https://img.youtube.com/vi/SbTs57YD1CA/maxresdefault.jpg"
  }
];
