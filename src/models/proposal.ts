import Candidate from './candidate';

/**
 * A proposal is a user who is calculated to
 * be a suggested match for another user
 */
export default interface Proposal {
  id: number | null;
  liked: boolean | null;
  has_match: boolean;
  candidate: Candidate;
}
