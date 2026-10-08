export const notes = [
  {
    id: 1,
    title: "DBMS Normalization & Functional Dependencies Cheat Sheet",
    subjectId: "dbms",
    videoId: 1,
    category: "computer-science",
    subcategory: "Database Systems",
    tags: ["DBMS", "Normalization", "SQL", "Exam-Ready"],
    type: "Cheat Sheet",
    description: "High-yield summary of 1NF, 2NF, 3NF, and BCNF rules with dependency diagrams and common exam traps.",
    content: `## Database Normalization Summary

### 1. First Normal Form (1NF)
- **Rule:** Every column must contain atomic (indivisible) values, and each record must be unique.
- **Violation:** Multivalued attributes (e.g., storing multiple phone numbers in one string).

### 2. Second Normal Form (2NF)
- **Rule:** Table must be in 1NF **AND** have no Partial Dependencies.
- **Partial Dependency:** A non-prime attribute depends on only a *part* of a composite candidate key.
- **Remedy:** Decompose table into separate relations where attributes depend on the full key.

### 3. Third Normal Form (3NF)
- **Rule:** Table must be in 2NF **AND** have no Transitive Dependencies.
- **Condition:** For every functional dependency $X \\rightarrow Y$, either:
  1. $X$ is a Superkey, OR
  2. $Y$ is a Prime Attribute (member of candidate key).

### 4. Boyce-Codd Normal Form (BCNF)
- **Rule:** A stricter version of 3NF. For every non-trivial dependency $X \\rightarrow Y$, **$X$ MUST be a Superkey**.`,
    examPoints: [
      "1NF: Atomic values only. No repeating groups.",
      "2NF: No partial dependency on composite candidate keys.",
      "3NF: For X -> Y, X is superkey OR Y is prime attribute.",
      "BCNF: For every X -> Y, X must strictly be a superkey."
    ],
    thumbnail: "/images/thumb_dbms.png"
  },
  {
    id: 2,
    title: "Operating Systems: CPU Scheduling & Gantt Chart Formulas",
    subjectId: "os",
    videoId: 2,
    category: "computer-science",
    subcategory: "Operating Systems",
    tags: ["OS", "CPU Scheduling", "Gantt Chart", "Formulas"],
    type: "Formulas",
    description: "Formulas and algorithms for FCFS, SJF, SRTF, and Round Robin scheduling with turnaround & waiting time formulas.",
    content: `## CPU Scheduling Formulas & Metrics

### Core Time Equations
1. **Completion Time ($CT$):** Time at which process finishes execution.
2. **Turnaround Time ($TAT$):**
   $$TAT = CT - \\text{Arrival Time } (AT)$$
3. **Waiting Time ($WT$):**
   $$WT = TAT - \\text{Burst Time } (BT)$$
4. **Response Time ($RT$):**
   $$RT = \\text{Time of first CPU allocation} - AT$$

### Algorithm Summary
- **FCFS (First-Come, First-Served):** Non-preemptive. Suffers from Convoy Effect when a long burst process arrives first.
- **SJF (Shortest Job First):** Optimal for minimizing average waiting time, but can cause starvation for long processes.
- **Round Robin:** Preemptive using fixed Time Quantum ($q$). Ideal for time-sharing systems.`,
    examPoints: [
      "Turnaround Time = Completion Time - Arrival Time",
      "Waiting Time = Turnaround Time - Burst Time",
      "SJF gives minimum average waiting time but requires prior burst knowledge.",
      "Time Quantum too large -> behaves like FCFS; too small -> high context switch overhead."
    ],
    thumbnail: "/images/thumb_os.png"
  },
  {
    id: 3,
    title: "Deadlock Conditions & Banker's Algorithm Safety Guide",
    subjectId: "os",
    videoId: 3,
    category: "computer-science",
    subcategory: "Operating Systems",
    tags: ["OS", "Deadlock", "Banker's Algorithm", "Cheat Sheet"],
    type: "Cheat Sheet",
    description: "The 4 Coffman conditions, Resource Allocation Graphs, and Banker's safety matrix step-by-step.",
    content: `## Deadlock Conditions & Banker's Algorithm

### The 4 Necessary Coffman Conditions:
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** Process holds allocated resources while waiting for additional ones.
3. **No Preemption:** Resources cannot be forcibly taken from a process.
4. **Circular Wait:** Closed loop of processes where each waits for a resource held by the next.

### Banker's Algorithm Matrices:
- **Available $[m]$:** Vector of available instances of each resource type.
- **Max $[n \\times m]$:** Maximum demand of each process.
- **Allocation $[n \\times m]$:** Resources currently assigned.
- **Need Matrix:**
  $$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$$`,
    examPoints: [
      "All 4 Coffman conditions must hold simultaneously for a deadlock to occur.",
      "Deadlock Prevention: Invalidate at least one of the 4 conditions.",
      "Deadlock Avoidance: Banker's algorithm checks for a safe sequence before allocating.",
      "Safe state != Deadlock-free forever, but guarantees a safe execution sequence exists."
    ],
    thumbnail: "/images/thumb_os.png"
  },
  {
    id: 4,
    title: "Neural Networks Architecture & Forward Pass Equations",
    subjectId: "ai-ml",
    videoId: 4,
    category: "ai-ml",
    subcategory: "Machine Learning Foundations",
    tags: ["AI", "Machine Learning", "Neural Networks", "Deep Learning"],
    type: "Formulas",
    description: "Mathematical formulation of artificial neurons, dot products, biases, and activation function equations.",
    content: `## Neural Network Forward Propagation

### 1. Neuron Computation
For input vector $\\mathbf{x} = [x_1, x_2, \\dots, x_n]$ and weights $\\mathbf{w}$:
$$z = \\sum_{i=1}^n w_i x_i + b = \\mathbf{w}^T \\mathbf{x} + b$$
$$a = \\sigma(z)$$

### 2. Common Activation Functions
- **Sigmoid:** $\\sigma(z) = \\frac{1}{1 + e^{-z}} \\in (0, 1)$
- **ReLU (Rectified Linear Unit):** $f(z) = \\max(0, z)$ (solves vanishing gradient for positive values)
- **Softmax (Multi-class output):**
  $$P(y=k) = \\frac{e^{z_k}}{\\sum_j e^{z_j}}$$`,
    examPoints: [
      "Linear transformations stacked without activation functions reduce to a single linear model.",
      "ReLU is computationally efficient and avoids vanishing gradient for z > 0.",
      "Softmax normalizes raw logits into a valid probability distribution summing to 1.0."
    ],
    thumbnail: "/images/thumb_ai.png"
  },
  {
    id: 5,
    title: "Engineering Statistics: Distributions & Central Limit Theorem",
    subjectId: "statistics",
    videoId: 5,
    category: "ai-ml",
    subcategory: "Data Science & Mathematics",
    tags: ["Statistics", "Math", "CLT", "Distributions"],
    type: "Guide",
    description: "Essential statistical distributions, variance properties, and Central Limit Theorem application for computer science.",
    content: `## Engineering Statistics & Probability

### 1. Central Limit Theorem (CLT)
As sample size $n$ increases ($n \\ge 30$), the distribution of the sample mean $\\bar{X}$ approaches a Normal distribution:
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$
regardless of the underlying distribution of the population.

### 2. Properties of Variance
- $\\text{Var}(c) = 0$
- $\\text{Var}(aX + b) = a^2 \\text{Var}(X)$
- Standard Deviation: $\\sigma = \\sqrt{\\text{Var}(X)}$`,
    examPoints: [
      "CLT applies even if original data is skewed, provided sample size is sufficiently large (n >= 30).",
      "Standard Error of the Mean = sigma / sqrt(n).",
      "Median is preferred over Mean when dealing with heavily skewed data or extreme outliers."
    ],
    thumbnail: "/images/thumb_stats.png"
  },
  {
    id: 6,
    title: "React Hooks Architecture & Rules Reference Guide",
    subjectId: "web-dev",
    videoId: 6,
    category: "web-dev",
    subcategory: "Modern Frontend & Fullstack",
    tags: ["React", "JavaScript", "Frontend", "Guide"],
    type: "Guide",
    description: "The 2 Golden Rules of Hooks, dependency array gotchas, and cleanup patterns for memory safety.",
    content: `## React Hooks Architecture & Reference

### The 2 Golden Rules of React Hooks:
1. **Only Call Hooks at the Top Level:** Do not call hooks inside loops, conditions, or nested functions.
2. **Only Call Hooks from React Functions:** Call them from React functional components or custom hooks.

### useEffect Dependency Rules:
- **Empty Array \`[]\`:** Runs only on initial mount, cleanup runs on unmount.
- **With Dependencies \`[a, b]\`:** Runs on mount and re-runs when \`a\` or \`b\` change by reference (\`Object.is\`).
- **No Array:** Runs on every render (high risk of performance degradation).`,
    examPoints: [
      "Hooks rely on stable call order across renders (internally managed as a linked list in fiber node).",
      "Always clean up event listeners and timers in useEffect return function.",
      "useMemo caches computed values; useCallback caches function references."
    ],
    thumbnail: "/images/thumb_web.png"
  }
];
