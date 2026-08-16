import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certificates & Professional Documents | Masud Rana (masuddev01)',
  description:
    'Verified certifications, degrees, research documents, and official credentials of Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Certificates',
    'masuddev01 credentials',
    'masudranamdra research documents',
    'Software Engineering Certification',
  ],
  alternates: {
    canonical: '/documents',
  },
  openGraph: {
    title: 'Certificates & Professional Documents | Masud Rana (masuddev01)',
    description:
      'Verified certifications, degrees, research documents, and official credentials of Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/documents',
  },
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
