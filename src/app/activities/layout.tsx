import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activities & Extracurriculars | Masud Rana (masuddev01)',
  description:
    'Explore hackathons, workshops, community involvement, and co-curricular activities of Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Activities',
    'masuddev01 hackathons',
    'masudranamdra workshops',
    'Software Engineer Community Activities',
  ],
  alternates: {
    canonical: '/activities',
  },
  openGraph: {
    title: 'Activities & Extracurriculars | Masud Rana (masuddev01)',
    description:
      'Explore hackathons, workshops, community involvement, and co-curricular activities of Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/activities',
  },
};

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
