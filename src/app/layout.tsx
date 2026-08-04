import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ConfigProvider } from '../context/ConfigContext';
import { AboutProvider } from '../context/AboutContext';
import { ThemeProvider } from '../context/ThemeContext';
import { HydrationErrorFilter } from '../components/HydrationErrorFilter';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Professional Portfolio SaaS Platform',
  description: 'Manage projects, skills, timelines, documents, and media vault assets dynamically from a premium SaaS dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. Block setAttribute for bis_skin_checked
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

                  // 2. MutationObserver to strip bis_skin_checked if injected by browser extensions
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
                  
                  // 3. Apply initial Dark Mode
                  var isDark = localStorage.getItem('isDark');
                  if (isDark === 'true' || (isDark === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  // 4. Suppress console.error & window error events for extension hydration mismatches
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
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body suppressHydrationWarning className={`${outfit.className} min-h-screen antialiased`}>
        <HydrationErrorFilter />
        <ThemeProvider>
          <AuthProvider>
            <ConfigProvider>
              <AboutProvider>
                {children}
              </AboutProvider>
            </ConfigProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

