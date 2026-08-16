import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery & Moments | Masud Rana (masuddev01)',
  description:
    'Visual photo gallery, tech event snapshots, workspace, and life moments of Masud Rana (masudranamdra, masuddev01).',
  keywords: [
    'Masud Rana Gallery',
    'masuddev01 photos',
    'masudranamdra images',
    'Developer Gallery',
  ],
  alternates: {
    canonical: '/gallery/images',
  },
  openGraph: {
    title: 'Photo Gallery & Moments | Masud Rana (masuddev01)',
    description:
      'Visual photo gallery, tech event snapshots, workspace, and life moments of Masud Rana (masudranamdra, masuddev01).',
    url: 'https://masuddev01.vercel.app/gallery/images',
  },
};

export default function GalleryImagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
