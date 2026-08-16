import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Demos & Presentations | Masud Rana (masuddev01)',
  description:
    'Watch project demonstration videos, tech talks, coding demos, and presentations by Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Videos',
    'masuddev01 project demos',
    'masudranamdra presentations',
    'Software Engineer Demo Videos',
  ],
  alternates: {
    canonical: '/gallery/videos',
  },
  openGraph: {
    title: 'Video Demos & Presentations | Masud Rana (masuddev01)',
    description:
      'Watch project demonstration videos, tech talks, coding demos, and presentations by Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/gallery/videos',
  },
};

export default function GalleryVideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
