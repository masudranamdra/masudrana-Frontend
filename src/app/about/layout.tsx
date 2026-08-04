import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/about/basic`, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    const json = await res.json();
    const basic = json.data;

    if (!basic) {
      return {
        title: 'About | Professional Portfolio',
        description: 'Discover my journey, skills, and professional experience.',
      };
    }

    return {
      title: `About ${basic.fullName} | ${basic.tagline || 'Professional Portfolio'}`,
      description: basic.shortBio || 'Discover my journey, skills, and professional experience.',
      openGraph: {
        title: `About ${basic.fullName}`,
        description: basic.shortBio,
        images: basic.coverImage?.url ? [{ url: basic.coverImage.url }] : (basic.profileImage?.url ? [{ url: basic.profileImage.url }] : []),
      },
      alternates: {
        canonical: '/about',
      },
    };
  } catch (error) {
    return {
      title: 'About | Professional Portfolio',
      description: 'Discover my journey, skills, and professional experience.',
    };
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 
        This layout is a Server Component, meaning generateMetadata runs on the server.
        The children (AboutJourneyPage) is a Client Component. 
        This is the recommended Next.js App Router pattern for SEO + Client Interactivity.
      */}
      {children}
    </>
  );
}
