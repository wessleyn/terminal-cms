// Define API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define ProfileAvatar type for use across components
export interface ProfileAvatar {
  id: string;
  url: string;
  publicId: string | null;
  isNew?: boolean;
}

// Define ProfileData structure for the profile page
export interface ProfileData {
  id: string;
  name: string;
  greeting: string;
  tagline: string;
  description: string;
  workEmail: string;
  displayName?: string; // Computed field (greeting + name)
  avatars: ProfileAvatar[];
  currentAvatarIndex: number;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    order?: number;
  }>;
}

// Default profile data for initialization
export const DEFAULT_PROFILE = {
  name: "John Doe",
  greeting: "Hello, I am",
  tagline: "Full Stack Developer & Open Source Enthusiast",
  description: "I build modern web applications with TypeScript, React, and Node.js. Passionate about clean code, performance optimization, and user experience.",
  workEmail: "contact@example.com"
};

// Default avatar URLs for initialization
export const DEFAULT_AVATARS = [
  {
    url: "https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg",
    publicId: "default-avatar",
    isNew: true
  }
];

// Default social links for initialization
export const DEFAULT_SOCIAL_LINKS = [
  {
    platform: "github",
    url: "https://github.com/johndoe",
    order: 0
  },
  {
    platform: "linkedin",
    url: "https://linkedin.com/in/johndoe",
    order: 1
  },
  {
    platform: "twitter",
    url: "https://twitter.com/johndoe",
    order: 2
  }
];