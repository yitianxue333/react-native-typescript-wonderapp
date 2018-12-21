import Gender from './gender';
import DistanceUnit from './distance-unit';
import ProfileImage from './profile-image';
import VibeVideo from './vibe-video';
import Topic from './topic';

/**
 * User Model
 */
interface User {
  token?: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  zipcode: string;
  occupation: string;
  school: string;
  gender: Gender;
  about?: string;
  distance_of_interest_max?: number;
  age_of_interest_min?: number;
  age_of_interest_max?: number;
  male_interest?: boolean;
  female_interest?: boolean;
  available?: boolean;
  show_flakers?: boolean;
  show_ghosters?: boolean;
  show_fibbers?: boolean;
  military_time?: boolean;
  distance_unit?: DistanceUnit;
  apn_new_matches?: boolean;
  apn_new_messages?: boolean;
  apn_message_likes?: boolean;
  apn_message_super_likes?: boolean;
  activities_only_interest?: boolean;
  apn_new_offers?: boolean;
  push_device_id?: string;
  push_device_type?: string;
  ghosts_cache?: number;
  flakes_cache?: number;
  fibs_cache?: number;
  location_cache?: number;
  geocoding_requested?: boolean;
  latitude?: number;
  longitude?: number;
  images?: ProfileImage[];
  video?: VibeVideo;
  topics?: Topic[];
  topic_ids?: number[];
  online: boolean;
  last_seen_at: string | null;
  partner: object;
  distance: number;
  age?: number;
  tzinfo?: string;
  tzoffset?: number;
  onboarding_ui_state: {
    has_matched: boolean;
    has_scheduled_wonder: boolean;
    has_swiped_left: boolean;
    has_swiped_right: boolean;
  };
}

export default User;
