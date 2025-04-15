import {Track} from './track';

export interface Playlist {
  id: string,
  name: string,
  cover: string,
  tracks: Track[],
  owner: string,
}
