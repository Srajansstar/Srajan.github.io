// Edit project content here.
window.PROJECTS = [
  {
    "id": "condensation",
    "featured": false,
    "category": "Graph learning",
    "year": "2026 · Major Thesis",
    "title": "Hypergraph & Graph Condensation",
    "subtitle": "Complex Network Topologies · Algebraic Condensation",
    "text": "Synthesizing compact graph and hypergraph proxies from large-scale networks via algebraic condensation, preserving multi-scale spectral properties and motif distributions.",
    "detail": "Major thesis project at IDEA Lab, IISER TVM under Dr. Saptarshi Bej. Synthesizes compact graph and hypergraph proxies from large networks via algebraic condensation, preserving multi-scale spectral properties and higher-order motif distributions. Formulates gradient-free alignment objectives to couple discrete sketches with continuous representations, enabling memory-efficient GNN training on constrained hardware.",
    "kind": "binary",
    "tags": [
      "Ongoing",
      "Graph Condensation",
      "Hypergraphs",
      "Spectral Proxies",
      "Scalable GNNs"
    ],
    "status": "Ongoing · Major Thesis"
  },
  {
    "id": "binary",
    "featured": true,
    "category": "Graph learning",
    "year": "2026 · First Author Preprint",
    "title": "Fast Binary Graph Representations",
    "subtitle": "Randomized Operator Sketching · Randomized Nyström Sampling",
    "text": "Achieved 0.46s average latency across 10 benchmarks (9x to 2900x faster than baselines), matching continuous GNN accuracy with compact binary hash vectors.",
    "detail": "First-author preprint under review (arXiv:2609.32641). Developed an algebraic hashing method via randomized Nyström operator sampling to produce extremely fast, compact binary node representations. Across 10 benchmarks, achieved 0.46s average latency (9x to 2900x faster than competitive baselines) while matching continuous GNN accuracy (up to 76.1%) with discrete binary vectors.",
    "kind": "binary",
    "tags": [
      "Binary Embeddings",
      "Randomized Sketching",
      "Nyström Operator",
      "First Author",
      "Scalability"
    ],
    "status": "Preprint · Under review",
    "url": "https://arxiv.org/abs/2609.32641"
  },
  {
    "id": "cortical",
    "featured": true,
    "category": "NeuroAI",
    "year": "2026 · Ongoing",
    "title": "Cortical networks from EEG",
    "subtitle": "Source-localised EEG · Graph neural networks",
    "text": "Using graph models to study source-localised EEG and compare patterns in Alzheimer’s disease and frontotemporal dementia.",
    "detail": "At the Cajal Institute, CSIC, I work with Dr. Guiomar Niso on source-localised EEG and cortical graph models for Alzheimer’s disease versus frontotemporal dementia classification. The model combines Personalized PageRank diffusion over an anatomical graph with spectral-profile cosine attention. Participant-level splits address temporal epoch leakage; topology ablations and cortical Grad-CAM maps help examine what the graph contributes.",
    "kind": "network",
    "tags": [
      "MNE-Python",
      "PyTorch Geometric",
      "EEG",
      "NeuroAI"
    ],
    "status": "Manuscript in preparation"
  },
  {
    "id": "ibl",
    "featured": false,
    "category": "Neural decoding",
    "year": "2025",
    "title": "Decoding neural activity",
    "subtitle": "Neuropixels · Low-dimensional dynamics",
    "text": "Studying how recordings from visual and motor brain regions relate to a mouse’s perceptual choices.",
    "detail": "Using International Brain Laboratory Neuropixels data, I decoded mouse perceptual choices with PCA and generalised linear models. The project explores low-dimensional subspace trajectories across visual and motor neural populations.",
    "kind": "traces",
    "tags": [
      "Neuropixels",
      "PCA",
      "GLMs",
      "Neural Decoding"
    ],
    "status": "Research project",
    "github": "https://github.com/Srajansstar/IBL-Neural-Analysis"
  },
  {
    "id": "spikes",
    "featured": false,
    "category": "Neural decoding",
    "year": "2025-2026",
    "title": "Spike2Image",
    "subtitle": "Biologically inspired visual decoding",
    "text": "Reconstructing images from simulated spike trains using 3D CNNs to compare neural encoding strategies.",
    "detail": "Spike2Image evaluates four neural encoding schemes through an image reconstruction task. A 3D CNN decoder reconstructs visual stimuli from sparse spike trains; Poisson coding achieved highest fidelity among the evaluated schemes. Published on IEEE Xplore.",
    "kind": "spikes",
    "tags": [
      "Spiking representations",
      "3D CNN",
      "Visual decoding",
      "IEEE Xplore"
    ],
    "status": "Selected project",
    "url": "https://ieeexplore.ieee.org/document/11349096"
  },
  {
    "id": "imaging",
    "featured": false,
    "category": "NeuroAI",
    "year": "2024-2025",
    "title": "MRI and CT reconstruction",
    "subtitle": "Computational imaging · MRI & tomography",
    "text": "Recovering images from incomplete measurements with quantitative susceptibility mapping and tomographic reconstruction.",
    "detail": "With Dr. Raji Susan Mathew at IISER TVM, I implemented nonlinear phase unwrapping and background field removal for quantitative susceptibility mapping (QSM). I also worked on 3D sparse-angle tomographic reconstruction with Deep Image Prior and total-variation regularisation.",
    "kind": "imaging",
    "tags": [
      "QSM",
      "Deep Image Prior",
      "Inverse problems",
      "MRI"
    ],
    "status": "Undergraduate research"
  },
  {
    "id": "motor",
    "featured": false,
    "category": "Neural decoding",
    "year": "2025",
    "title": "Motor imagery EEG classification",
    "subtitle": "Motor imagery · Oscillatory representations",
    "text": "Classifying imagined movements from EEG using CSP spatial filtering and machine learning pipelines.",
    "detail": "Built an MNE-Python pipeline using common spatial patterns (CSP) and time-frequency features for six-class motor imagery classification, achieving 92.8% accuracy and benchmarking XGBoost against CNN-LSTM models.",
    "kind": "traces",
    "tags": [
      "MNE-Python",
      "Motor imagery",
      "Time-frequency",
      "CSP Filtering"
    ],
    "status": "Selected project",
    "github": "https://github.com/Srajansstar/-EEG-Classification-fingers"
  }
];

// Srajan's original hand-drawn artwork
window.SKETCHES = [
  {
    "image": "assets/sketch-01.jpg",
    "orientation": "portrait"
  },
  {
    "image": "assets/sketch-02.jpg",
    "orientation": "portrait"
  },
  {
    "image": "assets/sketch-03.jpg",
    "orientation": "landscape"
  }
];
