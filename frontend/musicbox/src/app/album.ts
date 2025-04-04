import {Artist} from './artist';

export interface Album {
  id: bigint,
  name: string,
  album_type: string,
  cover: string,
  release_date: string,
  release_date_precision: string,
  artists: Artist[],
}
