import Topic from './topic';

export interface ActivityDetailReview {
  rating: number;
  text: string;
  created_at: string;
  url: string;
}

export interface ActivityDetailHours {
  open: [
    {
      is_overnight: boolean;
      start: string; // "1300"
      end: string; // "2100"
      day: number; // 0 for sunday
    }
  ];
}

export default interface ActivityDetails {
  id: string;
  name: string;
  location: string[]; // ['415 Stevens St', 'Geneva, IL 60134']
  latitude: number;
  longitude: number;
  hours: ActivityDetailHours;
  images: string[];
  phone: string;
  rating: number;
  price_level: number;
  review_count: number;
  url: string;
  reviews: ActivityDetailReview[];
}
