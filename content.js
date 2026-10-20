// Edit project content here. Optional image: "assets/your-figure.jpg".
window.PROJECTS = [
  {
    "id": "cortical",
    "featured": true,
    "category": "NeuroAI",
    "year": "2026 \u00b7 Ongoing",
    "title": "Cortical networks from EEG",
    "subtitle": "Source-localised EEG \u00b7 Graph neural networks",
    "text": "Using graph models to study source-localised EEG and compare patterns in Alzheimer\u2019s disease and frontotemporal dementia.",
    "detail": "At the Cajal Institute, CSIC, I work with Dr. Guiomar Niso on source-localised EEG and cortical graph models for Alzheimer\u2019s disease versus frontotemporal dementia classification. The model combines Personalized PageRank diffusion over an anatomical graph with spectral-profile cosine attention. Participant-level splits address temporal epoch leakage; topology ablations and cortical Grad-CAM maps help examine what the graph contributes.",
    "kind": "network",
    "tags": [
      "MNE-Python",
      "PyTorch Geometric",
      "EEG"
    ],
    "status": "Manuscript in preparation"
  },
  {
    "id": "binary",
    "featured": true,
    "category": "Graph learning",
    "year": "2026 \u00b7 Preprint",
    "title": "Compact graph representations",
    "subtitle": "Randomised operator sketching \u00b7 Binary embeddings",
    "text": "Finding compact ways to represent large networks while keeping useful information for graph-learning tasks.",
    "detail": "My first-author preprint studies extremely fast, compact binary graph representations via randomised operator sketching. This work is part of my master\u2019s research with Dr. Saptarshi Bej at IDEA Lab, IISER Thiruvananthapuram. The next direction is scalable graph condensation: building compact proxies that retain useful multi-scale structure.",
    "kind": "binary",
    "tags": [
      "Graph representation",
      "Sketching",
      "Scalability"
    ],
    "status": "Preprint \u00b7 under review",
    "url": "https://arxiv.org/abs/2609.32641"
  },
  {
    "id": "ibl",
    "category": "Neural decoding",
    "year": "2025",
    "title": "Decoding neural activity",
    "subtitle": "Neuropixels \u00b7 Low-dimensional dynamics",
    "text": "Studying how recordings from visual and motor brain regions relate to a mouse\u2019s perceptual choices.",
    "detail": "Using International Brain Laboratory Neuropixels data, I decoded mouse perceptual choices with PCA and generalised linear models. The project explores low-dimensional subspace trajectories across visual and motor neural populations.",
    "kind": "traces",
    "tags": [
      "Neuropixels",
      "PCA",
      "GLMs"
    ],
    "status": "Research project"
  },
  {
    "id": "spikes",
    "category": "Neural decoding",
    "year": "2025\u20132026",
    "title": "Spike2Image",
    "subtitle": "Spike2Image \u00b7 Biologically inspired decoding",
    "text": "Reconstructing images from simulated spike trains to compare different neural encoding strategies.",
    "detail": "Spike2Image evaluates four neural encoding schemes through an image reconstruction task. A 3D CNN decoder reconstructs visual stimuli from sparse spike trains; Poisson coding gave the highest fidelity among the evaluated schemes. This project studies encoding and decoding with synthetic spikes, rather than recorded neuronal responses.",
    "kind": "spikes",
    "tags": [
      "Spiking representations",
      "3D CNN",
      "Visual decoding"
    ],
    "status": "Selected project"
  },
  {
    "id": "imaging",
    "category": "NeuroAI",
    "year": "2024\u20132025",
    "title": "MRI and CT reconstruction",
    "subtitle": "Computational imaging \u00b7 MRI & tomography",
    "text": "Recovering images from incomplete measurements, with work on MRI susceptibility mapping and CT reconstruction.",
    "detail": "With Dr. Raji Susan Mathew at IISER TVM, I implemented nonlinear phase unwrapping and background field removal for quantitative susceptibility mapping. I also worked on 3D sparse-angle tomographic reconstruction with Deep Image Prior and total-variation regularisation.",
    "kind": "imaging",
    "tags": [
      "QSM",
      "Deep Image Prior",
      "Inverse problems"
    ],
    "status": "Undergraduate research"
  },
  {
    "id": "motor",
    "category": "Neural decoding",
    "year": "2025",
    "title": "Motor imagery EEG classification",
    "subtitle": "Motor imagery \u00b7 Oscillatory representations",
    "text": "Classifying imagined movements from EEG using signal processing and machine learning.",
    "detail": "I built an MNE-Python pipeline using common spatial patterns and time-frequency features for six-class motor imagery classification. This project benchmarked XGBoost and other machine-learning approaches against CNN\u2013LSTM models.",
    "kind": "traces",
    "tags": [
      "MNE-Python",
      "Motor imagery",
      "Time-frequency features"
    ],
    "status": "Selected project"
  }
];

// Add your own drawings to assets/, then set each image path below.
// Empty paths display paper placeholders, never invented artwork.
window.SKETCHES = [
  {
    "title": "Sketch 01",
    "image": "",
    "caption": ""
  },
  {
    "title": "Sketch 02",
    "image": "",
    "caption": ""
  },
  {
    "title": "Sketch 03",
    "image": "",
    "caption": ""
  }
];
