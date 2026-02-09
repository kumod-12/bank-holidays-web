/**
 * TypeScript types for Payload CMS data
 */

export interface Country {
  id: string;
  code: string;
  name: string;
  slug: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  type: 'state' | 'province' | 'territory' | 'city' | 'other';
  country: Country | string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'government' | 'official' | 'verified' | 'community';
  lastVerified?: string;
}

export interface FAQ {
  question: string;
  answer: SlateContent[];
  intent?: string;
}

export interface ExtensionTip {
  title: string;
  leaveDays: number;
  totalDays: number;
  description: SlateContent[];
}

export interface UpcomingDate {
  year: number;
  date: string;
  day?: string;
}

export interface ImageCredit {
  photographerName?: string;
  photographerUrl?: string;
  unsplashUrl?: string;
}

export interface QuickFacts {
  dateDisplay?: string;
  dayOfWeek?: string;
  holidayType?: string;
  bankHolidayStatus?: string;
}

export interface RegionMapping {
  region: Region | string;
  isObserved: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  year: number;
  country: Country | string;
  type: 'national' | 'regional' | 'bank' | 'optional';
  observedDate?: string;
  isRecurring: boolean;

  // SEO fields
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;

  // Visual
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: ImageCredit;

  // Rich content (Slate format)
  description?: SlateContent[];
  longDescription?: SlateContent[];
  history?: SlateContent[];
  traditions?: SlateContent[];
  celebrations?: SlateContent[];

  // Bank holiday info
  isBankHoliday?: boolean;
  bankHolidayDetails?: SlateContent[];
  applicableRegions?: string;

  // Data tables
  upcomingDates?: UpcomingDate[];

  // Engagement
  extensionTips?: ExtensionTip[];
  faqs?: FAQ[];

  // E-E-A-T
  authoritySource?: string;
  sourceUrl?: string;
  lastUpdated?: string;
  disclaimer?: SlateContent[];

  // Quick facts
  quickFacts?: QuickFacts;

  // Relationships
  sources?: (Source | string)[];
  regionMappings?: RegionMapping[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Slate content type (simplified)
export interface SlateContent {
  type?: string;
  children: Array<SlateContent | { text: string; bold?: boolean; italic?: boolean }>;
  [key: string]: any;
}

// API Response types
export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadSingleResponse<T> {
  id: string;
  [key: string]: any;
}

// Footer types
export interface FooterLink {
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;
}

export interface Footer {
  id: string;
  name: string;
  sections: FooterSection[];
  socialMedia: SocialMedia;
  copyright: string;
  isActive: boolean;
}

// Page types (for legal pages, about us, etc.)
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: SlateContent[];
  metaTitle?: string;
  metaDescription?: string;
  showInFooter?: boolean;
  footerSection?: 'quick-links' | 'legal' | 'resources';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
