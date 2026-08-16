import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications & Written Articles | Masud Rana (masuddev01)',
  description:
    'Featured tech publications, engineering writeups, and software articles written by Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Articles',
    'masuddev01 publications',
    'masudranamdra software writeups',
    'Software Architecture Articles',
  ],
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Publications & Written Articles | Masud Rana (masuddev01)',
    description:
      'Featured tech publications, engineering writeups, and software articles written by Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/articles',
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
