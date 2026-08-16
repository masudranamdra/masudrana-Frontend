import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Skills & Tech Stack | Masud Rana (masuddev01)',
  description:
    'Comprehensive technical skills, programming languages, backend & frontend frameworks, and developer tools mastered by Masud Rana (masudranamdra).',
  keywords: [
    'Masud Rana Skills',
    'masuddev01 tech stack',
    'React Next.js Node.js TypeScript Skills',
    'Full Stack Software Engineer Skills',
  ],
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: 'Technical Skills & Tech Stack | Masud Rana (masuddev01)',
    description:
      'Comprehensive technical skills, programming languages, frameworks, and developer tools mastered by Masud Rana (masudranamdra).',
    url: 'https://masuddev01.vercel.app/skills',
  },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
