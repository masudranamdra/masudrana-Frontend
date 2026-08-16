import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ConfigProvider } from '../context/ConfigContext';
import { AboutProvider } from '../context/AboutContext';
import { ThemeProvider } from '../context/ThemeContext';
import { HydrationErrorFilter } from '../components/HydrationErrorFilter';
import { JsonLd } from '../components/JsonLd';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masuddev01.vercel.app';
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION || 'YOUR_GSC_VERIFICATION_CODE';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090D1A',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Masud Rana (masuddev01) | Senior Full Stack Software Engineer',
    template: '%s | Masud Rana (masudranamdra)',
  },
  description:
    'Official portfolio of Masud Rana (masudranamdra, masuddev01) - Senior Full Stack Engineer specializing in React, Next.js, Node.js, TypeScript, and SaaS solutions.',
  keywords: [
    'Masud Rana',
    'masudranamdra',
    'masuddev01',
    'Full Stack Engineer',
    'Software Engineer',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'TypeScript Engineer',
    'Frontend Developer',
    'Backend Engineer',
    'SaaS Architect',
    'Web Developer Portfolio',
    'Bangladesh Developer',
  ],
  authors: [{ name: 'Masud Rana', url: siteUrl }],
  creator: 'Masud Rana (masudranamdra)',
  publisher: 'Masud Rana (masuddev01)',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Masud Rana (masuddev01) | Senior Full Stack Software Engineer',
    description:
      'Official portfolio of Masud Rana (masudranamdra, masuddev01) - Senior Full Stack Engineer specializing in Next.js, React, Node.js, and SaaS platforms.',
    siteName: 'Masud Rana Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Masud Rana - Senior Full Stack Software Engineer (masudranamdra, masuddev01)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masud Rana (masuddev01) | Senior Full Stack Software Engineer',
    description:
      'Official portfolio of Masud Rana (masudranamdra, masuddev01) - Full Stack Engineer specializing in Next.js, React & Node.js.',
    creator: '@masudranamdra',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: gscVerification,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect external resource domains for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />

        {/* Structured Data (JSON-LD) */}
        <JsonLd siteUrl={siteUrl} />

        {/* Anti-hydration / Browser Extension Patch Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var orgSet = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, value) {
                    if (name === 'bis_skin_checked') return;
                    orgSet.apply(this, arguments);
                  };

                  var orgSetNS = Element.prototype.setAttributeNS;
                  Element.prototype.setAttributeNS = function(ns, name, value) {
                    if (name === 'bis_skin_checked') return;
                    orgSetNS.apply(this, arguments);
                  };

                  if (typeof MutationObserver !== 'undefined') {
                    var observer = new MutationObserver(function(mutations) {
                      for (var i = 0; i < mutations.length; i++) {
                        var m = mutations[i];
                        if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                          m.target.removeAttribute('bis_skin_checked');
                        } else if (m.addedNodes) {
                          for (var j = 0; j < m.addedNodes.length; j++) {
                            var n = m.addedNodes[j];
                            if (n.nodeType === 1) {
                              if (n.hasAttribute('bis_skin_checked')) n.removeAttribute('bis_skin_checked');
                              var children = n.querySelectorAll ? n.querySelectorAll('[bis_skin_checked]') : [];
                              for (var k = 0; k < children.length; k++) {
                                children[k].removeAttribute('bis_skin_checked');
                              }
                            }
                          }
                        }
                      }
                    });
                    observer.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      childList: true,
                      attributeFilter: ['bis_skin_checked']
                    });
                  }
                  
                  var isDark = localStorage.getItem('isDark');
                  if (isDark === 'true' || (isDark === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  var isHydrationMsg = function(msg) {
                    return (
                      typeof msg === 'string' &&
                      (msg.indexOf('bis_skin_checked') !== -1 ||
                       msg.indexOf('A tree hydrated but some attributes') !== -1 ||
                       msg.indexOf('Hydration failed because the initial UI') !== -1 ||
                       msg.indexOf('There was an error while hydrating') ||
                       msg.indexOf('Text content does not match server-rendered HTML') ||
                       msg.indexOf('did not match. Server:'))
                    );
                  };

                  var originalConsoleError = console.error;
                  console.error = function() {
                    var args = Array.prototype.slice.call(arguments);
                    var msg = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].message) || '';
                    if (isHydrationMsg(msg)) return;
                    originalConsoleError.apply(console, args);
                  };

                  window.addEventListener('error', function(e) {
                    var msg = e.message || (e.error && e.error.message) || '';
                    if (isHydrationMsg(msg)) {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                    }
                  }, true);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Google Sign-In Script */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body suppressHydrationWarning className={`${outfit.className} min-h-screen antialiased`}>
        {/* Google Analytics 4 (GA4) Tag */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <HydrationErrorFilter />
        <ThemeProvider>
          <AuthProvider>
            <ConfigProvider>
              <AboutProvider>{children}</AboutProvider>
            </ConfigProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
