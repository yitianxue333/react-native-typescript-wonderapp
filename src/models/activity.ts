import Topic from './topic';

export default interface Activity {
  id: string;
  name: string;
  topic: Topic;
  location: string[]; // ['415 Stevens St', 'Geneva, IL 60134']
  latitude: number;
  longitude: number;
  distance: number;
  price_level: number;
  image_url: string;
}
