
export type MediaType = 'image' | 'video';

export interface Slide {
  id: string;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  lyrics: Slide[];
  author?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  file_url: string;
  type: MediaType;
}

export interface ScheduleItem {
  id: string;
  type: 'song' | 'media';
  reference_id: string;
}

export interface SessionState {
  id: string;
  current_item_id: string | null;
  current_type: 'song' | 'media' | 'blank';
  current_slide_index: number;
  is_blackout: boolean;
  media_url: string | null;
  updated_at: string;
}
