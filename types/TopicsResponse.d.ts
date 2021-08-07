export interface ITopicsResponse {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  published_at?: Date;
  updated_at?: Date;
  starts_at?: Date;
  ends_at?: Date | null;
  only_submissions_after?: null;
  featured?: boolean;
  total_photos?: number;
  current_user_contributions?: any[];
  total_current_user_submissions?: null;
  links?: ITopicsResponseLinks;
  status?: Status;
  owners?: User[];
  cover_photo?: CoverPhoto;
  preview_photos?: PreviewPhoto[];
}

export interface CoverPhoto {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  promoted_at?: Date;
  width?: number;
  height?: number;
  color?: string;
  blur_hash?: string;
  description?: null | string;
  alt_description?: string;
  urls?: Urls;
  links?: CoverPhotoLinks;
  categories?: any[];
  likes?: number;
  liked_by_user?: boolean;
  current_user_collections?: any[];
  sponsorship?: null;
  user?: User;
}

export interface CoverPhotoLinks {
  self?: string;
  html?: string;
  download?: string;
  download_location?: string;
}

export interface Urls {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
  thumb?: string;
}

export interface User {
  id?: string;
  updated_at?: Date;
  username?: string;
  name?: string;
  first_name?: string;
  last_name?: null | string;
  twitter_username?: null | string;
  portfolio_url?: string;
  bio?: null | string;
  location?: null | string;
  links?: UserLinks;
  profile_image?: ProfileImage;
  instagram_username?: null | string;
  total_collections?: number;
  total_likes?: number;
  total_photos?: number;
  accepted_tos?: boolean;
  for_hire?: boolean;
  social?: Social;
}

export interface UserLinks {
  self?: string;
  html?: string;
  photos?: string;
  likes?: string;
  portfolio?: string;
  following?: string;
  followers?: string;
}

export interface ProfileImage {
  small?: string;
  medium?: string;
  large?: string;
}

export interface Social {
  instagram_username?: null | string;
  portfolio_url?: string;
  twitter_username?: null | string;
  paypal_email?: null;
}

export interface ITopicsResponseLinks {
  self?: string;
  html?: string;
  photos?: string;
}

export interface PreviewPhoto {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  blur_hash?: string;
  urls?: Urls;
}

export enum Status {
  Open = "open",
}

//  - current topic response
export interface ICurrentTopicResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  published_at: Date;
  updated_at: Date;
  starts_at: Date;
  ends_at: null;
  only_submissions_after: null;
  featured: boolean;
  total_photos: number;
  current_user_contributions: any[];
  total_current_user_submissions: null;
  links: ICurrentTopicsResponseLinks;
  status: string;
  owners: User[];
  top_contributors: User[];
  cover_photo: CoverPhoto;
  preview_photos: PreviewPhoto[];
}

export interface CoverPhoto {
  id: string;
  created_at: Date;
  updated_at: Date;
  promoted_at: Date;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string;
  alt_description: string;
  urls: Urls;
  links: CoverPhotoLinks;
  categories: any[];
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: null;
  user: User;
}

export interface CoverPhotoLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface Urls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface User {
  id: string;
  updated_at: Date;
  username: string;
  name: string;
  first_name: string;
  last_name: null | string;
  twitter_username: null | string;
  portfolio_url: null | string;
  bio: null | string;
  location: null | string;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username: null | string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: Social;
}

export interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

export interface ProfileImage {
  small: string;
  medium: string;
  large: string;
}

export interface Social {
  instagram_username: null | string;
  portfolio_url: null | string;
  twitter_username: null | string;
  paypal_email: null;
}

export interface ICurrentTopicsResponseLinks {
  self: string;
  html: string;
  photos: string;
}

export interface PreviewPhoto {
  id: string;
  created_at: Date;
  updated_at: Date;
  blur_hash: string;
  urls: Urls;
}
