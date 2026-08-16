import React from 'react';

interface JsonLdProps {
  siteUrl?: string;
}

export const JsonLd: React.FC<JsonLdProps> = ({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masuddev01.vercel.app',
}) => {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Masud Rana',
    alternateName: ['masudranamdra', 'masuddev01', 'Masud Rana Portfolio'],
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    jobTitle: 'Senior Full Stack Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Independent Software Consultant & SaaS Engineer',
    },
    description:
      'Senior Full Stack Software Engineer specializing in Next.js, React, Node.js, TypeScript, and high-performance Web / Mobile Applications.',
    sameAs: [
      'https://github.com/masud-rana',
      'https://linkedin.com/in/masud-rana',
      'https://facebook.com',
      'https://youtube.com',
      'https://instagram.com',
      'https://twitter.com/masudranamdra',
    ],
    knowsAbout: [
      'Software Engineering',
      'Full Stack Development',
      'React.js',
      'Next.js',
      'Node.js',
      'TypeScript',
      'REST APIs',
      'GraphQL',
      'Web Application Architecture',
      'SaaS Development',
      'Tailwind CSS',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dinajpur',
      addressCountry: 'Bangladesh',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Masud Rana Portfolio',
    alternateName: ['masuddev01 Portfolio', 'masudranamdra Portfolio'],
    description:
      'Official portfolio website of Masud Rana (masuddev01, masudranamdra) - Senior Full Stack Software Engineer.',
    publisher: {
      '@id': `${siteUrl}/#person`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/projects?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${siteUrl}/about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Projects',
        item: `${siteUrl}/projects`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Experience',
        item: `${siteUrl}/experience`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Skills',
        item: `${siteUrl}/skills`,
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Blogs',
        item: `${siteUrl}/blogs`,
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Contact',
        item: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
