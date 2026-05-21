# Supabase SQL Migration for LumenWorship

Run the following SQL in your Supabase SQL Editor to set up the necessary tables and enable real-time synchronization.

```sql
-- 1. Create tables
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  lyrics JSONB NOT NULL, -- Array of slides [{text: "歌詞", id: "slide-1"}]
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  items_list JSONB DEFAULT '[]'::JSONB, -- Array of objects {type: 'song'|'media', id: UUID}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE session_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  current_item_id TEXT,
  current_type TEXT CHECK (current_type IN ('song', 'media', 'blank')),
  current_slide_index INTEGER DEFAULT 0,
  is_blackout BOOLEAN DEFAULT FALSE,
  media_url TEXT, -- Active background media
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert initial singleton state
INSERT INTO session_state (id) VALUES ('00000000-0000-0000-0000-000000000000') ON CONFLICT DO NOTHING;

-- 3. Enable Realtime
ALTER TABLE session_state REPLICA IDENTITY FULL;

-- Note: You must also go to the Supabase Dashboard -> Database -> Realtime
-- and enable it for the 'session_state' table in the 'public' schema.
```
