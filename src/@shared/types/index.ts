export interface IPhoto {
  id: string;
  width: number;
  height: number;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
  alt: string;
  photographer: string;
  photographerUrl?: string;
  avgColor?: string;
  dateAdded?: string;
  description?: string;
  liked?: boolean;
  source: "pexels" | "unsplash";
}

export interface IPexelsPhotoResponse {
  page: number;
  per_page: number;
  photos: IPexelsPhoto[];
  total_results: number;
  next_page: string;
  prev_page?: string;
}

export interface IUnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: IUnsplashPhoto[];
}

export interface IPexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface IUnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  likes: number;
  liked_by_user: boolean;
  description: string;
  alt_description: string;
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string;
    bio: string;
    location: string;
    total_likes: number;
    total_photos: number;
    total_collections: number;
    instagram_username: string;
    twitter_username: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
      following: string;
      followers: string;
    };
  };
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
}
