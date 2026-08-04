'use client';

import { useEffect } from 'react';

export function HydrationErrorFilter() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isHydrationError = (msg: string) =>
        msg.includes('bis_skin_checked') ||
        msg.includes('A tree hydrated but some attributes') ||
        msg.includes('Hydration failed because the initial UI') ||
        msg.includes('There was an error while hydrating') ||
        msg.includes('Text content does not match server-rendered HTML') ||
        msg.includes('did not match. Server:');

      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        const errorMsg = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].message) || '';
        if (isHydrationError(errorMsg)) {
          return;
        }
        originalConsoleError(...args);
      };

      const handleWindowError = (e: ErrorEvent) => {
        const msg = e.message || (e.error && e.error.message) || '';
        if (isHydrationError(msg)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };

      window.addEventListener('error', handleWindowError, true);
      return () => {
        window.removeEventListener('error', handleWindowError, true);
      };
    }
  }, []);

  return null;
}
