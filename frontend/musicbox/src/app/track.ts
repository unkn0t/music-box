import {Artist} from './artist';

export interface Track {
  id: bigint,
  name: string,
  albumId: bigint,
  artists: Artist[],
  audio: string,
}
