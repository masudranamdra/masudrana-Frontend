import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Hire Masud Rana | Full Stack Engineer (masuddev01)',
  description:
    'Get in touch with Masud Rana (masudranamdra, masuddev01) for contract work, full-time engineering roles, SaaS consulting, or technical inquiries.',
  keywords: [
    'Contact Masud Rana',
    'Hire masuddev01',
    'masudranamdra contact',
    'Hire Full Stack Developer',
    'Next.js Consultant Bangladesh',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Hire Masud Rana | Full Stack Engineer (masuddev01)',
    description:
      'Get in touch with Masud Rana (masudranamdra, masuddev01) for contract work, full-time engineering roles, or SaaS consulting.',
    url: 'https://masuddev01.vercel.app/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
