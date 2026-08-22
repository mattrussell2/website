// All written content for the site. Keep prose here; keep layout in index.html / index.js.

const me = (authors) => authors.replace(/M\. Russell/g, '<b>M. Russell</b>');

const pub = (authors, title, venue, links = []) => `
  <li>
    <span class="pub-authors">${me(authors)}</span>
    <span class="pub-title">${title}</span>
    <span class="pub-venue">${venue}</span>
    ${links.length ? `<span class="pub-links">${links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`).join('')}</span>` : ''}
  </li>`;

export const about = `
  <p class="eyebrow">About</p>
  <h1>Matthew Russell, PhD</h1>
  <p class="lede">Computer scientist working across physics, data, and human-computer interaction.</p>

  <p>I'm a software engineer in scientific computing at <b>Acceleron Fusion</b>. In practice the role runs closer to research engineering: alongside building software I do data and physics analysis, contribute to grant proposals, and help write research papers. Before my current role I completed a PhD in computer science at Tufts University, studying brain-computer interfaces in the Human-Computer Interaction Lab, studying under Professor Robert Jacob. Earlier still, I spent three years as an ordained Zen monk in residence at a monastery in the Catskills (DBZ). I love coding, statistics, learning, and teaching.</p>

  <h2>Now · Acceleron Fusion</h2>
  <p class="role">Software Engineer, Scientific Computing</p>
  <ul class="bullets">
    <li>Core technical ideation for a successfully funded <b>Genesis grant</b> proposal (≈5% acceptance rate), <i>Developing a Digital Replica of a Deuterium-Tritium Process Loop for Fusion Fuel Cycle Optimization</i> — combining PDE/ODE and neural-ODE process models, Bayesian calibration, unscented Kalman filtering for state prediction, agentic optimization, and an extensible software stack that supports other scientific processes. Work is slated to begin soon.</li>
    <li>Designed and built a custom <b>Bayesian optimization framework</b> for tuning particle-physics beamlines (BoTorch + G4beamline), with an interactive three.js visualization layer.</li>
    <li>Data analysis of both <b>ruby and Raman spectroscopy</b>, feeding directly into published results.</li>
    <li>Performed correctness validation and <b>GPU optimization</b> of the processing pipeline for over 7 TB of muon-catalyzed fusion data.</li>
    <li>Maintained a multi-tiered software stack supporting 10+ engineers, with components in MATLAB, Python, C++, CAD (SolidWorks), and C#.</li>
    <li>Built <b>CI/CD pipelines</b> integrating SVN repository checks with automated Slack notifications.</li>
    <li>Day-to-day cloud infrastructure on <b>AWS</b> (EC2, AMIs, and related services).</li>
  </ul>

  <h2>Before · Tufts University</h2>
  <ul class="bullets">
    <li>PhD, Computer Science (2025). Dissertation on prefrontal-cortex activation measured with fNIRS and EEG toward recognizing complex neurophysiological states.</li>
    <li>Lecturer for CS 15 (Data Structures, C++) and teaching assistant across graphics, concurrency, security, and intro CS.</li>
  </ul>

  <h2>Before that · Zen monastery</h2>
  <ul class="bullets">
    <li>Ordained Zen monk; three years of residential training and work practice at a Zen Buddhist monastery in the Catskill Mountains.</li>
    <li>Taught yoga at the monastery; 200-hour certified (NACYT-200) under Lex Gillan.</li>
  </ul>

  <h2>Off the clock</h2>
  <p>Happily married since 2016, with two daughters (born 2018 and 2020). Favorite activities outside of work include cooking, chess, crossword puzzles, camping, snowboarding, and rock climbing.</p>
`;

export const research = `
  <p class="eyebrow">Research</p>
  <h1>Scientific computing &amp; brain-computer interfaces</h1>
  <h2>Now · Fusion fuel-cycle digital replica</h2>
  <p>At Acceleron Fusion I led the core technical ideation for a funded Genesis grant, <i>Developing a Digital Replica of a Deuterium-Tritium Process Loop for Fusion Fuel Cycle Optimization</i>. The program builds a digital replica of a tritium-handling process loop: PDE/ODE and neural-ODE models of the physical process, Bayesian calibration against measurements, unscented Kalman filters for state prediction, and agentic optimization on top — on an extensible software stack designed to support other scientific processes as well.</p>
  <h2>PhD · Brain-computer interfaces</h2>
  <p>The Tufts Human-Computer Interaction Lab studies <em>implicit</em> brain-computer interfaces. Such interfaces leverage neural function without explicitly directed input from the user. My work explored functional near-infrared spectroscopy (fNIRS) and electroencephalography (EEG) based interfaces, and specifically pushed on three frontiers: state-of-the-art workload interfaces, using fNIRS to measure the cognitive effects of LLM-based tools, and cross-task "horizontal" state classification from EEG for future BCI designs.</p>

  <p class="linkrow">
    <a href="https://scholar.google.com/citations?authuser=1&user=2jTn8oIAAAAJ" target="_blank" rel="noopener">Google Scholar ↗</a>
    <a href="https://dl.tufts.edu/concern/pdfs/b2774940p" target="_blank" rel="noopener">Dissertation ↗</a>
    <a href="./assets/resume.pdf" target="_blank" rel="noopener">CV ↗</a>
  </p>

  <h2>Selected publications</h2>
  <ol class="pubs">
    ${pub('M. Russell', '"Beyond Workload: Paving the Road for the Next Generation of Implicit Prefrontal Cortex Based Brain-Computer Interfaces."', 'PhD Dissertation, Tufts University, 2025', [['Tufts DL', 'https://dl.tufts.edu/concern/pdfs/b2774940p']])}
    ${pub('M. Russell, S. Hincks, L. Wang, A. Babar, Z. Chen, Z. White, R.J.K. Jacob', '"Visualization and Workload with Implicit fNIRS-based BCI: Towards a Real-time Memory Prosthesis with fNIRS."', 'Frontiers in Neuroergonomics, 2025', [['Frontiers', 'https://www.frontiersin.org/journals/neuroergonomics/articles/10.3389/fnrgo.2025.1550629/full']])}
    ${pub('M. Russell, A. Shah, G. Blaney, J. Amores, M. Czerwinski, R.J.K. Jacob', '"Neural and Cognitive Impacts of AI: The Influence of Task Subjectivity on Human-LLM Collaboration."', 'In review', [['arXiv', 'https://arxiv.org/abs/2506.04167']])}
    ${pub('M. Russell, S. Youkeles, W. Xia, K. Zheng, A. Shah, R.J.K. Jacob', '"Neural Signatures Within and Between Chess Puzzle Solving and Standard Cognitive Tasks for Brain-Computer Interfaces: A Low-Cost Electroencephalography Study."', 'In review', [['arXiv', 'https://arxiv.org/abs/2505.07592']])}
    ${pub('A. Bosworth, M. Russell, R.J.K. Jacob', '"fNIRS as an Input to Brain-Computer Interfaces: A Review of Research from the Tufts Human-Computer Interaction Laboratory."', 'Photonics, 2019', [['MDPI', 'https://www.mdpi.com/2304-6732/6/3/90']])}
  </ol>

  <details class="more">
    <summary>All publications &amp; extended abstracts</summary>
    <h3>Publications</h3>
    <ol class="pubs">
      ${pub('J. Santaniello et al.', '"Towards Reinforcement Learning from Neural Feedback: Mapping fNIRS Signals to Agent Performance."', 'Proc. AAAI Conference on Artificial Intelligence, vol. 40, no. 21, 2026')}
      ${pub('T. Shibata, A. Borisenko, A. Hakone, T. August, L. Deligiannidis, C.H. Yu, M. Russell, A. Olwal, R.J.K. Jacob', '"An Implicit Dialogue Injection System for Interruption Management."', 'Proc. Augmented Human International Conference, 2019', [['PDF', 'http://www.cs.tufts.edu/~jacob/papers/shibata.ah19.pdf']])}
      ${pub('L. Hirshfield, D. Bergen-Cico, M. Costa, R.J.K. Jacob, S. Hincks, M. Russell', '"Measuring the Neural Correlates of Mindfulness with Functional Near-Infrared Spectroscopy."', 'Empirical Studies of Contemplative Practices, 2018', [['ResearchGate', 'https://www.researchgate.net/publication/329362205_Measuring_the_neural_correlates_of_mindfulness_with_functional_near-infrared_spectroscopy']])}
      ${pub('L. Hirshfield, R. Gulotta, S. Hirshfield, S. Hincks, M. Russell, R. Ward, T. Williams, R.J.K. Jacob', '"This is Your Brain on Interfaces: Enhancing Usability Testing with Functional Near-Infrared Spectroscopy."', 'Proc. ACM CHI, 2011', [['Tufts DL', 'https://dl.tufts.edu/concern/pdfs/j6731g17b']])}
      ${pub('L. Hirshfield, S. Hirshfield, S. Hincks, M. Russell, R. Ward, T. Williams', '"Trust in Human-Computer Interactions as Measured by Frustration, Surprise, and Workload."', 'Foundations of Augmented Cognition, 2011', [['DOI', 'https://doi.org/10.1007/978-3-642-21852-1_58']])}
    </ol>
    <h3>Extended abstracts</h3>
    <ol class="pubs">
      ${pub('M. Russell, Q. Zhong, K. Zheng, K. Hu, J. Santaniello, R.J.K. Jacob', '"LLM-Tools\' Effects on Users During Complex Decision-Making with fNIRS."', 'Neuroadaptive Technologies, 2025')}
      ${pub('M. Russell, W. Xia, S. Youkeles, R.J.K. Jacob', '"Neural Correlates of Move Quality During Chess Games: A Low-Cost EEG Study."', 'Neuroadaptive Technologies, 2025')}
      ${pub('M. Russell, R.J.K. Jacob', '"Very-Low Frequency Oscillations as a Correlate of Neural Activation."', 'Neuroadaptive Technologies, 2025')}
      ${pub('M. Russell, S. Hincks, L. Wang, A. Babar, Z. Chen, Z. White, R.J.K. Jacob', '"Visualization and Workload with Implicit fNIRS-based BCI."', 'Frontiers in Neuroergonomics, 2024', [['Abstract', 'https://docs.google.com/document/d/1VdMBq5D_OBP05FAcHxzDrbkEnZ9wTBgS/edit?usp=sharing&ouid=111220556167885590355&rtpof=true&sd=true']])}
    </ol>
  </details>
`;

export const teaching = `
  <p class="eyebrow">Teaching</p>
  <h2>Lecturer</h2>
  <ul class="courses">
    <li><span>CS 15 · Data Structures (C++)</span><span class="meta">Summer 2020, Summer 2023</span></li>
  </ul>
  <h2>Teaching assistant</h2>
  <ul class="courses">
    <li><span>CS 15 · Data Structures (C++)</span><span class="meta">7 semesters</span></li>
    <li><span>CS 175 · Computer Graphics (C++)</span><span class="meta">2 semesters</span></li>
    <li><span>CS 50CP · Concurrency (Erlang, Python)</span></li>
    <li><span>CS 116 · Cybersecurity</span></li>
    <li><span>CS 10 · Introduction to Computer Science (Python)</span></li>
  </ul>
`;

// Order matches the cube faces in index.js.
export const projectList = [
  { name: 'Gradescope autograder',       blurb: 'Containerized C++ autograding framework used for CS 15.', href: 'https://www.github.com/mattrussell2/gradescope-autograder' },
  { name: 'CUDA ray tracer',             blurb: 'GPU path tracer written in CUDA.',                          href: 'https://www.github.com/mattrussell2/cuda_raytracer' },
  { name: 'Games',                       blurb: 'Backgammon and friends.',                                    href: 'https://www.github.com/mattrussell2/games' },
  { name: 'VS Code C++ unit tests',      blurb: 'Extension for running C++ unit tests inside VS Code.',       href: 'https://www.github.com/mattrussell2/vscode-cpp-unit-test' },
  { name: 'Data-structures visualizer',  blurb: 'Interactive heap / tree visualizations.',                    href: 'https://mattrussell2.github.io/data-structures-vis/' },
  { name: 'This website',                blurb: 'three.js, custom water shader, a rocket and a submarine.',  href: 'https://github.com/mattrussell2/website' },
];

const tools = [
  ['Python', 'python-plain.svg'], ['C++', 'cplusplus-original.svg'], ['R', 'r-original.svg'], ['MATLAB', 'matlab-plain.svg', 'dark'],
  ['JavaScript', 'javascript-original.svg'], ['three.js', 'threejs-original.svg', 'dark'], ['Java', 'java-original.svg'], ['Bash', 'bash-original.svg'],
  ['pandas', 'pandas-original.svg', 'dark'], ['PostgreSQL', 'postgresql-original.svg'],
  ['Docker', 'docker-original.svg'], ['AWS', 'amazonwebservices-plain-wordmark.svg', 'dark'], ['Git', 'git-original.svg'], ['Linux', 'linux-plain.svg', 'dark'],
];

export const software = `
  <p class="eyebrow">Software</p>
  <p>Full-stack software generalist, comfortable picking up any language or framework the problem calls for. Strong on CI/CD, cloud deployment, and the numerical side: optimization, statistics, and simulation tooling for scientists.</p>
  <h2>Toolset</h2>
  <ul class="tools">
    ${tools.map(([name, icon, cls]) => `<li>${icon ? `<img class="${cls || ''}" src="./assets/logos/${icon}" alt="">` : ''}${name}</li>`).join('')}
  </ul>
  <h2>Selected projects</h2>
  <ul class="projects">
    ${projectList.map(p => `<li><a href="${p.href}" target="_blank" rel="noopener"><span class="name">${p.name} ↗</span><span class="blurb">${p.blurb}</span></a></li>`).join('')}
  </ul>
  <p class="linkrow"><a href="https://github.com/mattrussell2" target="_blank" rel="noopener">All repositories on GitHub ↗</a></p>
`;
