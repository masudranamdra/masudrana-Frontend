import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Technical Articles | Masud Rana (masuddev01)',
  description:
    'Read insightful tech blogs, software architecture tutorials, Web dev guides, and thoughts by Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Blog',
    'masuddev01 articles',
    'masudranamdra tech blog',
    'Web Development Tutorials',
    'React Next.js Node.js Guides',
  ],
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Blog & Technical Articles | Masud Rana (masuddev01)',
    description:
      'Read insightful tech blogs, software architecture tutorials, and web development guides by Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/blogs',
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
