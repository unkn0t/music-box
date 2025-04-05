import {Artist} from './artist';

export interface Track {
  id: bigint,
  name: string,
  albumId: bigint,
  duration_ms: number,
  artists: Artist[],
  audio: string,
}
