export const ABOUT_TEXT = `Hi, I'm Ben! A software engineer with a passion for technology and problem-solving.

My current interests include full-stack development, security research/tooling, and developer tooling.

When I'm not coding, you can find me creating music in FL Studio or writing about tech on my blog.

I enjoy thought-provoking shows like Severance, Slow Horses, and Silo (I highly recommend the books too).

PS: Try pressing ~ to access something interesting...`;

export const PROJECTS = [
  {
    title: 'R6-DISSECT',
    description: "A multi-year project where I'm reverse-engineering a binary video game replay file format.",
    tags: ['Reverse Engineering', 'Binary Analysis', 'Go'],
    githubUrl: 'https://github.com/redraskal/r6-dissect',
  },
  {
    title: 'CLIPS',
    description: 'Self-hosted video game clips website.',
    tags: ['TypeScript', 'Bun', 'Monolith', 'FFmpeg', 'SQLite'],
    githubUrl: 'https://github.com/redraskal/clips',
  },
  {
    title: 'THIS WEBSITE',
    description: 'My personal website, hosted on Vercel.',
    tags: ['TypeScript', 'Next.js', 'tailwindcss', '@react-three/fiber'],
    githubUrl: 'https://github.com/redraskal/ctos.sh',
  },
];

export const EXPERIENCE = [
  {
    title: 'INFORMATION SECURITY INTERN',
    company: 'Graybar',
    period: '2022 - 2023',
    description:
      'Developed and deployed security solutions in Go, Python, & TypeScript while analyzing suspicious activity using Microsoft Defender, Proofpoint, and SecurityTrails.',
  },
  {
    title: 'SOFTWARE DEVELOPER',
    company: 'Noxcrew Online LTD',
    period: '2020 - 2022',
    description:
      'Built Java & Kotlin microservices and gameplay systems using NATS, KeyDB, PostgreSQL, and Kubernetes while collaborating with game designers in a Scrum environment.',
  },
];

export const CONTACT_INFO = {
  email: 'ben@ctos.sh',
  github: 'redraskal',
  linkedin: 'benjamin-ryan-xjmwx',
  publicKeys: 'github.com/redraskal.keys',
};
