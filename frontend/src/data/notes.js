export const notes = [
  {
    id: "normalization-note",
    title: "Normalization Notes",
    subjectId: "dbms",
    videoId: "normalization-dbms",
    category: "semester",
    subcategory: "Semester 5",
    tags: ["DBMS", "Normalization", "Database"],
    description: "Master 1NF, 2NF, 3NF, and BCNF with high-precision examples and clear logic.",
    type: "Theory",
    content: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.",
    pdf: "#",
    thumbnail: "/images/v_thumb_dbms.png",
    examPoints: [
      "1NF: Atomic values, no repeating groups.",
      "2NF: 1NF + No partial dependency.",
      "3NF: 2NF + No transitive dependency.",
      "BCNF: 3NF + Every determinant is a candidate key."
    ]
  },
  {
    id: "neural-networks-intro",
    title: "Neural Networks Fundamentals",
    subjectId: "ai-ml",
    videoId: "neural-networks-intro-vid",
    category: "ai-ml",
    subcategory: "Semester 7",
    tags: ["AI", "ML", "Neural Networks"],
    description: "Understand the architecture of neurons, layers, and activation functions in minutes.",
    type: "Cheat Sheet",
    content: "Neural networks are inspired by the human brain. They consist of input, hidden, and output layers. Activation functions define the output of a neuron given an input or set of inputs.",
    pdf: "#",
    thumbnail: "/images/v_thumb_nn.png",
    examPoints: [
      "Backpropagation is the key training algorithm.",
      "ReLU is the most common activation function.",
      "Weights and Biases are the learnable parameters."
    ]
  },
  {
    id: "react-hooks-guide",
    title: "React Hooks Simplified",
    subjectId: "web-dev",
    videoId: "react-hooks-vid",
    category: "web-dev",
    subcategory: "Semester 5",
    tags: ["React", "Hooks"],
    description: "Deploy useState, useEffect, and useContext like a pro in your web applications.",
    type: "Guide",
    content: "Hooks allow you to use state and other React features without writing a class. They provide a more functional approach to building components.",
    pdf: "#",
    thumbnail: "/images/v_thumb_react.png"
  }
];
