// All the words and links on the site live here. Edit this file first.
// The Projects, About and Work entries are starting points: check every line
// is accurate and add your own before you publish.
const github = 'https://github.com/a-huss20'

// One list of skills, used by the About card and the spinning cloud on the Home page.
// Edit the names, add or remove items, or change a colour here.
const skillCategories = [
  { id: 'languages', label: 'Languages', color: '#fb4b4e', items: ['Python', 'C++', 'Java'] },
  { id: 'ai', label: 'AI', color: '#ffcbdd', items: ['RAG', 'Local LLMs', 'Llama', 'Qwen'] },
  { id: 'tools', label: 'Tools', color: '#ffb27a', items: ['Streamlit', 'AnythingLLM', 'ServiceOne'] },
  {
    id: 'foundations',
    label: 'Foundations',
    color: '#ff7aa8',
    items: ['Discrete maths', 'Theory of computation', 'Graph algorithms', 'Compilers', 'Concurrency'],
  },
  {
    id: 'it',
    label: 'Networking & IT',
    color: '#ffe3b0',
    items: ['Cisco / CCNA', 'IT support', 'Device audits', 'Project coordination'],
  },
]
const skillGroups = skillCategories.map(({ label, items }) => ({ group: label, items }))

export const site = {
  name: 'Aftab Hussaini',
  initials: 'AH',

  email: 'aftabhussaini.work@gmail.com',
  github,
  linkedin: 'https://www.linkedin.com/in/aftab-hussaini-1364b340b/',

  // Each entry becomes a page route and a navbar button.
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'About', to: '/about' },
    { label: 'Work', to: '/work' },
  ],

  hero: {
    eyebrow: 'Hello, world.',
    role: 'Computer Science (Artificial Intelligence) student',
    scroll: 'Scroll',
  },

  projects: {
    eyebrow: 'Things I have built',
    intro: 'A few of the projects I have worked on, from language tooling to practical AI apps.',
    items: [
      {
        title: 'Timetable PDF extractor',
        status: 'In progress',
        description:
          'A downloadable tool that reads a timetable or unit outline PDF, uses a local or API language model to pull out classes and assessment dates, and shows them in a Streamlit interface.',
        tags: ['Python', 'Streamlit', 'LLMs'],
        href: `${github}/timetable-extractor`,
      },
      {
        title: 'SLR(1) parser in C++17',
        status: 'Coursework',
        description:
          'A parser built from scratch for an object-oriented subset of C, with the grammar, parsing tables and design decisions written up in a technical report.',
        tags: ['C++17', 'Compilers', 'Parsing'],
        href: `${github}/slr1-parser`,
      },
      {
        title: 'Local RAG workspace',
        status: 'Personal',
        description:
          'A retrieval-augmented workspace built with self-hosted AnythingLLM, answering questions over my own documents using open-weight models that run on my own machine.',
        tags: ['RAG', 'AnythingLLM', 'Local LLMs'],
        href: `${github}/rag-workspace`,
      },
    ],
  },

  about: {
    eyebrow: 'A bit about me',
    intro: 'Student, problem solver and tinkerer with a soft spot for AI.',
    paragraphs: [
      'I am finishing a Bachelor of Computer Science, majoring in Artificial Intelligence, at Flinders University.',
      'Alongside my studies I work in IT support at the university, helping students and staff get unstuck every day. It keeps me close to real people and real problems.',
      'Outside of coursework I like building practical tools with language models, and I enjoy the theory side of computing too: networking, discrete mathematics and the theory of computation.',
    ],
    facts: [
      { label: 'Studying', value: 'Bachelor of Computer Science (Artificial Intelligence)' },
      { label: 'University', value: 'Flinders University' },
      { label: 'Interests', value: 'Applied AI, compilers, networking' },
    ],
    skills: skillGroups,
  },

  skills: {
    eyebrow: 'What I work with',
    intro: 'The languages, tools and ideas I use most. Pick a category to light it up, or drag the cloud to spin it.',
    hint: 'Drag to spin',
    categories: skillCategories,
  },

  work: {
    eyebrow: 'Where I have worked',
    intro: 'Roles that taught me to support people, coordinate projects and communicate clearly.',
    jobs: [
      {
        role: 'IT Support Officer',
        company: 'Flinders Connect, Flinders University',
        period: 'Jul 2025 – Present',
        points: [
          'First-line support for students and staff.',
          'Log, triage and resolve requests in the ServiceOne ticketing queue.',
        ],
      },
      {
        role: 'Network Refresh Project Officer',
        company: 'Flinders University',
        period: 'From Oct 2025',
        points: [
          'Supported the senior Project Manager on a university-wide infrastructure upgrade.',
          'Coordinated device audits across campuses and liaised with vendors.',
        ],
      },
      {
        role: 'Junior Administrative Assistant',
        company: 'Creative Coatings, Adelaide',
        period: 'May 2024 – Jul 2025',
        points: ['Supported day-to-day office administration for the business.'],
      },
    ],
  },
}
