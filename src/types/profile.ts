export interface ProfileData {
  displayName: string;
  bio: string;
  contactEmail: string;
  profileImageUrl?: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
} 