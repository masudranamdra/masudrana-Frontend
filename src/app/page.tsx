import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { TimelineSection } from '../components/sections/TimelineSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { TestimonialSection } from '../components/sections/TestimonialSection';
import { BlogSection } from '../components/sections/BlogSection';
import { ActivitySection } from '../components/sections/ActivitySection';
import { ArticlesSection } from '../components/sections/ArticlesSection';
import { ContactSection } from '../components/sections/ContactSection';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-[#0F172A] selection:bg-blue-500/30 selection:text-blue-900" suppressHydrationWarning>
      {/* Header Menu */}
      <Navbar />

      {/* Main Contents sections */}
      <main className="flex-grow">
        <HeroSection />
        <AboutSection isHomepage={true} />
        <ProjectsSection />
        <TimelineSection />
        <SkillsSection />
        <TestimonialSection />
        <BlogSection />
        <ActivitySection />
        <ArticlesSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
