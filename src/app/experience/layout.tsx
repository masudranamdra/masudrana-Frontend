import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work Experience & History | Masud Rana (masudranamdra)',
  description:
    'Professional software engineering work history, career milestones, roles, and technical leadership experience of Masud Rana (masuddev01).',
  keywords: [
    'Masud Rana Experience',
    'masuddev01 career',
    'masudranamdra work history',
    'Software Engineer Work Experience',
    'Full Stack Engineer Resume',
  ],
  alternates: {
    canonical: '/experience',
  },
  openGraph: {
    title: 'Work Experience & History | Masud Rana (masudranamdra)',
    description:
      'Professional software engineering work history, career milestones, and technical leadership experience of Masud Rana (masuddev01).',
    url: 'https://masuddev01.vercel.app/experience',
  },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
