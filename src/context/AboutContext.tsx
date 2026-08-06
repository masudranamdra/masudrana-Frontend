'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../lib/api';

export interface AboutData {
  basic: {
    fullName: string;
    tagline: string;
    shortBio: string;
    coverImage: { url: string; publicId?: string };
    profileImage: { url: string; publicId?: string };
    mission: string;
    vision: string;
    contactEmail: string;
    location: string;
    availability?: string;
    resumeUrl: string;
    socialLinks: { platform: string; url: string; icon?: string; label?: string }[];
  };
  settings: {
    theme: string;
    globalAnimation: string;
    showStory: boolean;
    showEducation: boolean;
    showExperience: boolean;
    showSkills: boolean;
  };
  professional?: {
    professionalSummary?: string;
    whoIAm?: string;
    philosophy?: string;
    stats?: any[];
  };
  lifestyle?: {
    lifestyleText?: string;
    lifestyleImages?: any[];
  };
  timelines: any[];
  faqs: any[];
  gallery: any[];
  projects: any[];
  testimonials: any[];
  skills: any[];
}

interface AboutContextProps {
  about: AboutData | null;
  loading: boolean;
  fetchAbout: () => Promise<void>;
}

const AboutContext = createContext<AboutContextProps | undefined>(undefined);

export const AboutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const res = await API.get('/about'); // Matches getFullAbout controller
      if (res.data && res.data.success) {
        setAbout(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch About data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <AboutContext.Provider value={{ about, loading, fetchAbout }}>
      {children}
    </AboutContext.Provider>
  );
};

export const useAbout = (): AboutContextProps => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error('useAbout must be used within an AboutProvider');
  }
  return context;
};
