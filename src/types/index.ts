export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'public';
  avatar?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  documentLink?: string;
  image: {
    url: string;
    publicId?: string;
  };
  activities?: string[];
  clientName?: string;
  timeline?: string;
  role?: string;
  documentDetails?: {
    text: string;
    images: string[];
  };
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  title: string;
  description: string;
  icon: string;
  colorTheme: string;
  coreCompetencies: {
    name: string;
    icon: string;
  }[];
  tools: {
    name: string;
    icon: string;
    level: number;
    color: string;
  }[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: {
    url: string;
    publicId?: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
  author: {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  _id: string;
  title: string;
  externalLink: string;
  category: string;
  tags: string[];
  previewImage: {
    url: string;
    publicId?: string;
  };
  summary: string;
  isFeatured: boolean;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  position: string;
  company: string;
  rating: number;
  reviewContent: string;
  avatar?: {
    url: string;
    publicId?: string;
  };
  isFeatured: boolean;
  isApproved?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration?: string;
  category: 'Work' | 'Education' | 'Course' | 'Award' | 'Project' | 'Other';
  icon: string;
  image?: {
    url: string;
    publicId?: string;
  };
  fullDetails?: string;
  order: number;
  
  // Generic flags
  isFeatured: boolean;
  isPublished: boolean;
  isCurrent: boolean;

  // Work specific
  companyName?: string;
  employmentType?: string;
  location?: string;
  responsibilities?: string[];
  technologies?: string[];
  companyWebsite?: string;

  // Education specific
  degree?: string;
  department?: string;
  instituteName?: string;
  session?: string;
  cgpa?: string;
  academicAchievements?: string[];

  // Course specific
  platform?: string;
  instructor?: string;
  completionDate?: string;
  skillsLearned?: string[];
  credentialLink?: string;

  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  url: string;
  publicId?: string;
  isProtected: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryVideo {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  platform: 'youtube' | 'vimeo' | 'drive' | 'other';
  isProtected: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAsset {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  publicId?: string;
  type: 'resume' | 'pdf' | 'presentation' | 'other';
  tags: string[];
  isProtected: boolean;
  category: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  dribbble?: string;
  medium?: string;
}

export interface ConfigSettings {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: SocialLinks;
  siteDescription: string;
  seoKeywords: string[];
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  siteLogo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutStat {
  label: string;
  value: string;
  icon: string;
  description?: string;
  colorClass?: string;
}

export interface AboutLifestyleImage {
  url: string;
  publicId?: string;
}

export interface AboutSocialLink {
  platform: string;
  url: string;
  icon?: string;
  label?: string;
}

export interface AboutSettings {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  missionStatement: string;
  fullDescription: string;
  imageUrl: string;
  resumeUrl: string;
  stats: AboutStat[];
  highlights: string[];
  professionalSummary?: string;
  whoIAm?: string;
  philosophy?: string;
  coreValues?: string[];
  currentFocus?: string[];
  email?: string;
  location?: string;
  socialLinks?: AboutSocialLink[];
  lifestyleText: string;
  dailyLifeActivities: string[];
  lifestyleImages: AboutLifestyleImage[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}
