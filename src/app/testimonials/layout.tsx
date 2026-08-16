import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client & Peer Testimonials | Masud Rana (masuddev01)',
  description:
    'Recommendations, endorsements, and reviews from clients, colleagues, and collaborators working with Masud Rana (masudranamdra).',
  keywords: [
    'Masud Rana Testimonials',
    'masuddev01 recommendations',
    'masudranamdra reviews',
    'Software Engineer Endorsements',
  ],
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    title: 'Client & Peer Testimonials | Masud Rana (masuddev01)',
    description:
      'Recommendations, endorsements, and reviews from clients, colleagues, and collaborators working with Masud Rana (masudranamdra).',
    url: 'https://masuddev01.vercel.app/testimonials',
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
