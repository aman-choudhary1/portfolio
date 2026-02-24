import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  html,
  css,
  reactjs,
  nodejs,
  mongodb,
  git,
  java,
  next,
  vmeet,
  tailwind,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Experience",
  },
  {
    id: "skills",
    title: "Skills",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full Stack Developer",
    icon: web,
    description: "Building scalable web applications end-to-end",
  },
  {
    title: "Backend Engineer",
    icon: backend,
    description: "REST APIs, microservices & database optimization",
  },
  {
    title: "Frontend Developer",
    icon: mobile,
    description: "Modern, responsive & interactive user interfaces",
  },
  {
    title: "AI / ML Enthusiast",
    icon: creator,
    description: "NLP, Transformers & Generative AI exploration",
  },
];

const technologies = [
  { name: "JavaScript", icon: javascript },
  { name: "React JS", icon: reactjs },
  { name: "Next.js", icon: next },
  { name: "Node JS", icon: nodejs },
  { name: "HTML 5", icon: html },
  { name: "CSS 3", icon: css },
  { name: "MongoDB", icon: mongodb },
  { name: "Tailwind", icon: tailwind },
  { name: "Three JS", icon: threejs },
  { name: "git", icon: git },
  { name: "Java", icon: java },
];

const experiences = [
  {
    title: "Software Developer (Project Assistant)",
    company_name: "IIT Bhilai (IBITF)",
    icon: backend,
    iconBg: "#0a192f",
    date: "May 2024 - Present",
    points: [
      "Designed and implemented full stack government platforms using Node.js, Express.js, React.js, and PostgreSQL, serving thousands of users statewide.",
      "Engineered REST APIs and backend services for analytics dashboards enabling real-time data visualization.",
      "Optimized PostgreSQL queries for analytics and reporting systems, improving query performance significantly.",
      "Implemented authentication and secure role-based access control for government applications.",
      "Developed backend serving 50,000+ schools and administrative users across the state.",
    ],
    keyProjects: [
      {
        name: "Vidya Samiksha Kendra (VSK)",
        description: "Developed dashboards for statewide school performance tracking, enabling real-time analytics and monitoring of 50,000+ schools.",
      },
      {
        name: "Text Book Corporation (TBC)",
        description: "Built analytics and reporting tools to monitor textbook distribution, successfully tracking delivery of 2Cr+ books to 50,000+ schools.",
      },
    ],
  },
];

const education = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "Bhilai Institute of Technology, Durg",
    period: "2020 - 2023",
    score: "CGPA: 8.3",
    icon: "🎓",
  },
  {
    degree: "Diploma, Computer Science & Engineering",
    institution: "Chhattisgarh Swami Vivekanand Technical University",
    period: "2016 - 2019",
    score: "CGPA: 6.9",
    icon: "📜",
  },
];

const certifications = [
  {
    name: "UI Technologies and Python",
    issuer: "Naresh I Technologies",
    icon: "🏆",
  },
  {
    name: "Cloud Applications with Node.js and React",
    issuer: "IBM",
    icon: "☁️",
  },
];

const projects = [
  {
    name: "Full Stack E-Commerce Platform",
    description:
      "A complete e-commerce application with admin dashboard built using the MERN stack. Features include REST APIs, product management, user authentication, shopping cart, order tracking, and a comprehensive admin panel for managing products, orders, and users.",
    tags: [
      { name: "MongoDB", color: "green-text-gradient" },
      { name: "Express.js", color: "orange-text-gradient" },
      { name: "React.js", color: "blue-text-gradient" },
      { name: "Node.js", color: "green-text-gradient" },
    ],
    image: vmeet,
    source_code_link: "https://github.com/aman-choudhary1",
  },
  {
    name: "VMeet - Virtual Meeting Platform",
    description:
      "A real-time virtual meeting platform enabling video communication, one-on-one and group meetings, real-time chat, and screen sharing. Built with WebRTC for peer-to-peer video, Firebase for secure authentication and real-time user interaction.",
    tags: [
      { name: "React.js", color: "blue-text-gradient" },
      { name: "Firebase", color: "orange-text-gradient" },
      { name: "WebRTC", color: "pink-text-gradient" },
    ],
    image: vmeet,
    source_code_link: "https://github.com/aman-choudhary1/vmeet",
  },
];

const stats = [
  { value: "1.8+", label: "Years Experience" },
  { value: "50K+", label: "Users Served" },
  { value: "5+", label: "Projects Built" },
  { value: "2Cr+", label: "Books Tracked" },
];

const socialLinks = {
  github: "https://github.com/aman-choudhary1",
  linkedin: "https://linkedin.com/in/aman-choudhary1",
  email: "aman.choudhary7722@gmail.com",
  phone: "7000081495",
};

export { services, technologies, experiences, education, certifications, projects, stats, socialLinks };