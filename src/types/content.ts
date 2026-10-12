export interface MediaAsset {
  id: string;
  type: "image" | "video";
  src?: string;
  poster?: string;
  alt: string;
  caption?: string;
  /** Duração do vídeo em segundos. */
  duration?: number;
}

export interface ActionLink { label: string; href: string }
export interface Heading { text: string; accent: string }
export interface Category { id: string; label: string }
export interface StoryBlock { label?: string; title: string; text: string }
export interface ProjectHighlight { icon: "shield" | "headset" | "chart"; title: string; text: string }

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  introduction: string;
  categoryIds: string[];
  tag: string;
  visible: boolean;
  order: number;
  cover: MediaAsset;
  presentation: MediaAsset;
  gallery: MediaAsset[];
  facts: { label: string; value: string }[];
  story: StoryBlock[];
  heading?: Heading;
  year?: string;
  background?: string;
  highlights?: ProjectHighlight[];
}

interface BaseSection { id: string; visible: boolean; order: number }
export interface HeroSection extends BaseSection {
  type: "hero";
  eyebrow: string;
  heading: Heading;
  description: string;
}
export interface FeaturedSection extends BaseSection {
  type: "featured";
  projectId: string;
  badge: string;
  actionLabel: string;
}
export interface ProjectsSection extends BaseSection {
  type: "projects";
  eyebrow: string;
  heading: Heading;
  columns: 2 | 3;
}
export interface ContactSection extends BaseSection {
  type: "contact";
  heading: Heading;
  description: string;
  actionLabel: string;
}
export type PageSection = HeroSection | FeaturedSection | ProjectsSection | ContactSection;

export interface InfoPage {
  slug: string;
  eyebrow: string;
  heading: Heading;
  description: string;
  blocks: { title: string; text: string }[];
}

export interface PageContent {
  schemaVersion: 1;
  metadata: { title: string; description: string };
  brand: { name: string; tagline: string; logo: string; background: string };
  navigation: ActionLink[];
  contact: { email: string; location: string; actionLabel: string };
  categories: Category[];
  projects: Project[];
  sections: PageSection[];
  pages: InfoPage[];
  footer: {
    exploreLabel: string;
    contactLabel: string;
    copyright: string;
    signature: string;
    socialLinks: ActionLink[];
    legalLinks: ActionLink[];
  };
  ui: {
    allCategories: string;
    projectSingular: string;
    projectPlural: string;
    detailsLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    resetFilters: string;
    coverPlaceholder: string;
    videoPlaceholder: string;
    unavailableTitle: string;
    unavailableDescription: string;
    close: string;
    play: string;
    previous: string;
    next: string;
    backToProjects: string;
    projectsLabel: string;
    watchPresentation: string;
    highlightsLabel: string;
    nextProject: string;
    projectContactTitle: string;
    projectContactAction: string;
    galleryLabel: string;
    menuLabel: string;
    skipToContent: string;
    notFoundTitle: string;
    notFoundDescription: string;
    errorTitle: string;
    errorDescription: string;
    retry: string;
  };
}
