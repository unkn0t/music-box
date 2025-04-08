import {Artist} from './artist';

export interface Track {
  id: string,
  name: string,
  albumId: string,
  duration_ms: number,
  artists: Artist[],
  audio: string,
}
