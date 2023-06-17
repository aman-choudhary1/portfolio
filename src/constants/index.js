import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    java,
    bharti,
    bit,
    naresh,
    micro,
    next,
    vmeet,
    netflix,
    shareme,
    threejs,
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Web Developer",
      icon: web,
    },
    {
      title: "Java Developer",
      icon: mobile,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },
    {
      title: "Full Stack Developer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Next js",
      icon: next,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "tailwind",
      icon: tailwind,
    },
    {
      name: "Java",
      icon: java,
    },
  ];
  
  const experiences = [
    {
      title: "Diploma",
      company_name: "Computer Science and Engineering",
      icon: bharti,
      iconBg: "#383E56",
      date: "August 2016 - July 2019",
      points: [
        "College - Bharti College of Engineering and Technology (BCET), Durg",
        "University - Chhattisgarh Swami Vivekanand Technical University (CSVTU)",
        "Score - 6.8 CGPA",
        "I have a diploma in Computer Science and Engineering, equipping me with practical skills and knowledge to excel in the field of technology.",
      ],
    },
    {
      title: "BTech",
      company_name: "Computer Science and Engineering",
      icon: bit,
      iconBg: "#E6DEDD",
      date: "August 2019 - July 2023",
      points: [
        "College - Bhilai Institute Of Technology, Durg",
        "University - Chhattisgarh Swami Vivekanand Technical University (CSVTU)",
        "Score - 7.9 CGPA",
        "I hold a BTech degree in Computer Science and Engineering, equipped with a strong foundation in technology and problem-solving skills.",
      ],
    },
    {
      title: "UI Technology | Python",
      company_name: "Traning in Naresh IT Hyderabad",
      icon: naresh,
      iconBg: "#383E56",
      date: "Sept 2019 - Jan 2020",
      points: [
        "Usually, UI stands for User Interface which mainly comes under the human-interaction field. The main objective of UI Technology is to to make the user’s interaction as very simple and most efficient. UI helps us to decrease the gap between requirements and implementation over structured systems associated with the programming language. This UI Technologies Training helps the aspirants to learn the complete concept from beginner stage to advanced stage",
        "Python is a general-purpose interpreted, interactive, object-oriented, and high-level programming language. Python has been one of the premier, flexible, and powerful open-source language that is easy to learn, easy to use, and has powerful libraries for data manipulation and analysis",
      ],
    },
    {
      title: "Future Ready Talent",
      company_name: "Internship Program by Microsoft",
      icon: micro,
      iconBg: "#E6DEDD",
      date: "Apr 2022 - May 2022",
      points: [
        "Future Ready Talent is a virtual internship platform with an opportunity to learn the in-demand azure cloud & security skills aligned to industry needs. The program aims at preparing learners work towards solving business challenges and creating innovative solutions using the power of Microsoft Azure & GitHub tools.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "VMEET",
      description:
        "VMEET is Web-based video communication service that allows users to meet with each other by one on one or in a group meeting and allow real time chat and share screen with each other.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "typescript",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: vmeet,
      source_code_link: "https://github.com/aman-choudhary1/vmeet",
    },
    {
      name: "Netflix - Clone",
      description:
        "The Netflix Clone Project is a streaming platform that replicates the popular features of Netflix, offering a vast library of movies, TV shows, and documentaries. the Netflix Clone App built using React js Tailwind CSS, Next.JS, Prisma, MongoDB, and NextAuth.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "Nextjs",
          color: "green-text-gradient",
        },
        {
          name: "Tailwind",
          color: "pink-text-gradient",
        },
        {
          name: "MongoDB",
          color: "green-text-gradient",
        },
      ],
      image: netflix,
      source_code_link: "https://github.com/",
    },
    {
      name: "shareme",
      description:
        "shareme is an image sharing and social media service designed to enable saving and discovery of information that allows users to visually share, and discover new interests by posting (known as 'pinning') images or videos.",
      tags: [
        {
          name: "reactjs",
          color: "blue-text-gradient",
        },
        {
          name: "sanity",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: shareme,
      source_code_link: "https://github.com/aman-choudhary1/shareMe",
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects };