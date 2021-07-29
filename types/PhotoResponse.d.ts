// - Photoes Res
export interface IPhotoesResponse {
  id: string;
  created_at: Date;
  updated_at: Date;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  downloads: number;
  likes: number;
  liked_by_user: boolean;
  description: string;
  exif: Exif;
  location: Location;
  tags: Tag[];
  current_user_collections: CurrentUserCollection[];
  urls: Urls;
  links: IPhotoesResponseLinks;
  user: User;
}

export interface CurrentUserCollection {
  id: number;
  title: string;
  published_at: Date;
  last_collected_at: Date;
  updated_at: Date;
  cover_photo: null;
  user: null;
}

export interface Exif {
  make: string;
  model: string;
  exposure_time: string;
  aperture: string;
  focal_length: string;
  iso: number;
}

export interface IPhotoesResponseLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface Location {
  city: string;
  country: string;
  position: Position;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface Tag {
  title: string;
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
  portfolio_url: string;
  bio: string;
  location: string;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  links: UserLinks;
}

export interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}
