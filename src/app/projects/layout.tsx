import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Projects & Applications | Masud Rana (masuddev01)',
  description:
    'Explore full stack web apps, SaaS platforms, open-source repositories, and technical engineering projects built by Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Projects',
    'masuddev01 projects',
    'masudranamdra apps',
    'Full Stack Web Applications',
    'Next.js SaaS Projects',
    'React Repositories',
    'Node.js REST API Projects',
  ],
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Software Projects & Applications | Masud Rana (masuddev01)',
    description:
      'Explore full stack web apps, SaaS platforms, and technical engineering projects built by Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
