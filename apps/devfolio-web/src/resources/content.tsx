import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Edy",
  lastName: "Cu",
  name: `Edy Cu`,
  role: "Full-Stack Engineer & AI Specialist",
  avatar: "/images/avatar.jpg",
  email: "edy.cu@live.com",
  location: "Asia/Jakarta",
  languages: ["English", "Bahasa Indonesia"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about engineering and AI</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/edycutjong",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://linkedin.com/in/edy-cu-tjong",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building scalable systems & AI solutions</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">DataPulse Analytics</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured Project
        </Text>
      </Row>
    ),
    href: "/work/datapulse-analytics",
  },
  subline: (
    <>
      I'm Edy, a <Text as="span" size="xl" weight="strong">Full-Stack Engineer & AI Specialist</Text> building <br /> scalable web applications and data-driven systems.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Jakarta`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Edy is a Jakarta-based Full-Stack Engineer with expertise in building scalable
        web applications, data-driven systems, and integrating artificial intelligence solutions.
        Specialized in Python, Go, TypeScript, and modern cloud infrastructure.
      </>
    ),
  },
  work: {
    display: false,
    title: "Work Experience",
    experiences: [
      {
        company: "DataPulse Analytics",
        timeframe: "2023 - Present",
        role: "Lead Engineer",
        achievements: [
          <>
            Built a high-performance analytics engine processing millions of data points
            in real-time using Python and Go.
          </>,
          <>
            Architected microservices infrastructure with Kubernetes, achieving 99.9% uptime
            and 50% reduction in infrastructure costs.
          </>,
        ],
        images: [],
      },
      {
        company: "Previous Company",
        timeframe: "2020 - 2023",
        role: "Senior Software Engineer",
        achievements: [
          <>
            Led development of AI-powered recommendation engine, increasing user engagement by 40%.
          </>,
          <>
            Implemented CI/CD pipelines and automated testing, reducing deployment time by 60%.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false,
    title: "Education",
    institutions: [
      {
        name: "Computer Science",
        description: <>Bachelor's degree in Computer Science with focus on AI/ML.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Backend Development",
        description: (
          <>Building high-performance APIs and microservices with Python, Go, and Node.js.</>
        ),
        tags: [
          { name: "Python" },
          { name: "Node.js" },
          { name: "Django" },
          { name: "Flask" },
          { name: "PostgreSQL" },
          { name: "Redis" },
          { name: "Docker" },
          { name: "GraphQL" },
        ],
        images: [],
      },
      {
        title: "AI & Machine Learning",
        description: (
          <>Developing ML models and data pipelines with TensorFlow, PyTorch, and LLMs.</>
        ),
        tags: [
          { name: "TensorFlow" },
          { name: "PyTorch" },
          { name: "Scikit-learn" },
          { name: "Pandas" },
          { name: "NumPy" },
          { name: "OpenCV" },
          { name: "LLMs" },
          { name: "NLP" },
        ],
        images: [],
      },
      {
        title: "Frontend Development",
        description: (
          <>Creating modern, responsive web interfaces with React and TypeScript.</>
        ),
        tags: [
          { name: "React" },
          { name: "TypeScript" },
          { name: "Next.js" },
          { name: "Vue.js" },
          { name: "Tailwind CSS" },
          { name: "HTML5" },
          { name: "CSS3" },
          { name: "JavaScript" },
        ],
        images: [],
      },
      {
        title: "Cloud & DevOps",
        description: (
          <>Architecting cloud infrastructure with AWS, Kubernetes, and modern DevOps practices.</>
        ),
        tags: [
          { name: "AWS" },
          { name: "Azure" },
          { name: "GCP" },
          { name: "CI/CD" },
          { name: "Terraform" },
          { name: "Kubernetes" },
          { name: "Prometheus" },
          { name: "Git" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about engineering and AI...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Engineering projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery };
