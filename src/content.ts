export const profile = {
  name: 'Nayana S Parthan',
  shortName: 'Nayana',
  email: 'nayanasparthan@gmail.com',
  phone: '+91 99611 94496',
  location: 'Thiruvananthapuram, Kerala, India',
  role: 'Full Stack Developer · AI/ML Developer',
  introduction: 'I build thoughtful web applications and explore how machine learning can solve practical problems, with a special interest in AI-driven healthcare.',
  summary: 'Full Stack Developer with experience building scalable, user-friendly applications using Java, Spring Boot, React.js, and MySQL. I work across UI development, REST APIs, database management, and backend optimization, alongside hands-on experience in machine learning, data analysis, and predictive systems.',
  journey: [
    {
      name: 'Discover', label: 'START WITH THE QUESTION',
      title: ['Start with', 'the right question.'],
      copy: 'Understand who needs the product, what the data can show, and what a useful result should feel like.',
      footnote: 'CURIOSITY BEFORE CODE.',
    },
    {
      name: 'Connect', label: 'BRING THE LAYERS TOGETHER',
      title: ['Make every', 'layer work together.'],
      copy: 'Bring the interface, application logic, APIs, and data into a clear, maintainable flow.',
      footnote: 'CLEAR STRUCTURE. USEFUL CONNECTIONS.',
    },
    {
      name: 'Build', label: 'TURN IDEAS INTO SOFTWARE',
      title: ['Build for', 'the real world.'],
      copy: 'Develop responsive experiences, implement useful features, and apply machine learning to practical problems.',
      footnote: 'GOOD IDEAS DESERVE GOOD ENGINEERING.',
    },
    {
      name: 'Improve', label: 'LEARN AND REFINE',
      title: ['Test the result.', 'Learn. Refine.'],
      copy: 'Check endpoints, assess model performance, solve issues, and keep improving quality and reliability.',
      footnote: 'QUALITY IN EVERY ITERATION.',
    },
  ],
};

export const process = [
  { name: 'Discover', tagline: 'Understand the problem and the people.', description: 'Start with the purpose of the application or analysis. Identify what information is available and what the finished experience needs to make easier.' },
  { name: 'Prepare', tagline: 'Give the work a clear foundation.', description: 'Prepare and clean data, explore it through analysis and visualization, and establish a structure for the application and its APIs.' },
  { name: 'Build', tagline: 'Turn a plan into something useful.', description: 'Develop responsive interfaces and backend features, or build a machine learning model with tools suited to the problem.' },
  { name: 'Evaluate', tagline: 'Check the details. Keep improving.', description: 'Test API endpoints, review model performance with accuracy measures and classification reports, fix issues, and refine the result.' },
];

export const experience = [
  {
    role: 'Full Stack Developer',
    company: 'IPCS Global',
    location: 'Thiruvananthapuram, India',
    dates: 'May 2025 — Present',
    highlights: [
      'Built and deployed end-to-end applications with Java, Spring Boot, React.js, and MySQL.',
      'Created dynamic interfaces with HTML5, CSS3, React.js, and Bootstrap 4 and 5.',
      'Implemented authentication, CRUD workflows, responsive dashboards, and real-time data synchronization.',
      'Worked with cross-functional teams in Agile methodology and sprint cycles.',
    ],
  },
  {
    role: 'Java Programmer',
    company: 'Mynute Innovations',
    location: 'Thiruvananthapuram, India',
    dates: 'November 2023 — April 2025',
    highlights: [
      'Developed responsive web applications with Spring Boot, React.js, Hibernate, and MVC architecture.',
      'Created and consumed RESTful APIs, and used Postman for endpoint testing, debugging, and documentation.',
      'Worked with design and QA teams on code quality, functionality, and user experience.',
      'Contributed to Agile sprints, bug fixing, and CI pipelines using Maven and Gradle.',
      'Improved application performance and reliability by refactoring code and optimizing SQL queries.',
    ],
  },
  {
    role: 'AI/ML Developer',
    company: 'StackUp Learning Hub',
    location: 'Technopark, Kazhakkoottam, Thiruvananthapuram, India',
    dates: '',
    highlights: [
      'Built machine learning solutions through data preprocessing, visualization, model building, and predictive analysis.',
      'Applied Python and machine learning algorithms to practical, production-oriented projects.',
      'Used advanced data preprocessing and exploratory data analysis methods to prepare datasets.',
      'Applied AI to real-world problems while continuously developing technical skills.',
    ],
  },
];

export const projects = [
  {
    number: '01',
    name: 'Medicus App',
    subtitle: 'Healthcare Management System',
    category: 'FULL STACK · HEALTHCARE',
    description: 'A clinic operations and patient care application designed around clear workflows for patients, doctors, and appointments.',
    details: [
      'Built appointment scheduling, patient registration, and real-time doctor availability modules.',
      'Connected the React.js frontend and Spring Boot backend through RESTful APIs.',
      'Used MySQL with Hibernate/JPA for reliable data persistence and created responsive interfaces with Bootstrap.',
    ],
    technologies: ['Java', 'Spring Boot', 'React.js', 'MySQL', 'Hibernate', 'REST API'],
    tone: 'lilac',
    mark: 'M',
  },
  {
    number: '02',
    name: 'Drugs Management System',
    subtitle: 'DMS · Inventory Management',
    category: 'FULL STACK · PHARMACY',
    description: 'A web-based system for maintaining pharmaceutical records and keeping stock information accurate.',
    details: [
      'Added CRUD workflows for drug records, inventory, and expiry date tracking.',
      'Built backend processing with Spring Boot and efficient query design.',
      'Designed an approachable interface for day-to-day data management and reporting.',
    ],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
    tone: 'peach',
    mark: 'Rx',
  },
  {
    number: '03',
    name: 'Diabetes Prediction System',
    subtitle: 'Machine Learning · Predictive Analysis',
    category: 'AI / ML · HEALTHCARE',
    description: 'A classification project that estimates diabetes risk and evaluates model performance against the data.',
    details: [
      'Built Decision Tree and Random Forest classifiers for diabetes risk prediction.',
      'Explored and visualized data using Pandas, NumPy, Matplotlib, and Seaborn.',
      'Evaluated results with a confusion matrix, accuracy scores, and classification reports.',
    ],
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
    tone: 'sage',
    mark: '01',
  },
  {
    number: '04',
    name: 'Titanic Survival Prediction',
    subtitle: 'Machine Learning · Classification',
    category: 'AI / ML · DATA',
    description: 'A classification model that predicts passenger survival using the historical Titanic dataset.',
    details: [
      'Prepared the dataset and carried out exploratory data analysis.',
      'Trained a classification model to predict passenger survival outcomes.',
      'Reviewed model performance with a confusion matrix, accuracy metrics, and classification reports.',
    ],
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
    tone: 'blue',
    mark: 'T',
  },
  {
    number: '05',
    name: 'To-Do List Web Application',
    subtitle: 'Interactive Task Manager',
    category: 'FRONTEND · WEB APP',
    description: 'A responsive task manager for keeping everyday work organized in a clean, simple interface.',
    details: [
      'Implemented add, edit, delete, and mark-complete task actions.',
      'Designed responsive layouts with modern styling and smooth animations.',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    tone: 'rose',
    mark: '✓',
  },
];

export const skillGroups = [
  { title: 'Programming languages', items: ['Java', 'Python', 'SQL', 'JavaScript'], icon: 'code' },
  { title: 'Frontend', items: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap 4 & 5', 'Angular'], icon: 'layout' },
  { title: 'Backend & APIs', items: ['Java', 'Spring Boot', 'Quarkus', 'REST API', 'Microservices'], icon: 'server' },
  { title: 'Database & ORM', items: ['MySQL', 'Hibernate / JPA'], icon: 'database' },
  { title: 'AI & machine learning', items: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning basics', 'Predictive analysis'], icon: 'brain' },
  { title: 'Python & data', items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Data cleaning', 'Preprocessing', 'EDA', 'Data visualization'], icon: 'chart' },
  { title: 'ML algorithms', items: ['Linear Regression', 'Decision Tree', 'Random Forest', 'Classification', 'Regression models'], icon: 'spark' },
  { title: 'Tools & delivery', items: ['Postman API', 'Maven', 'Gradle', 'Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'IntelliJ IDEA', 'AWS basics', 'Kubernetes basics', 'CI/CD pipelines'], icon: 'tool' },
  { title: 'Engineering practice', items: ['MVC architecture', 'Object-oriented programming', 'Microservices architecture', 'Problem solving', 'Team collaboration', 'Communication', 'Agile methodology', 'Analytical thinking', 'Project management', 'Quick learning'], icon: 'layers' },
];

export const education = [
  { degree: 'Master of Science (M.Sc.)', subject: 'Computer Science', institution: 'Indira Gandhi National Open University (IGNOU)', dates: 'January 2026 — Present' },
  { degree: 'Bachelor of Science (B.Sc.)', subject: 'Computer Science', institution: 'IHRD College of Applied Science, Kundara, Kollam, India', dates: '' },
];

export const languages = [
  { name: 'English', level: 'Professional working proficiency' },
  { name: 'Malayalam', level: 'Native' },
  { name: 'Hindi', level: '' },
  { name: 'Tamil', level: '' },
];
