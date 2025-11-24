-- Create Communities table
CREATE TABLE IF NOT EXISTS Communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Chat_Rooms table
CREATE TABLE IF NOT EXISTS Chat_Rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_group BOOLEAN NOT NULL,
  name TEXT NOT NULL,
  community_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Chat_Participants table
CREATE TABLE IF NOT EXISTS Chat_Participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Users table (minimal for chat)
CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Posts table (minimal for community)
CREATE TABLE IF NOT EXISTS Posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content TEXT,
  media_url TEXT,
  tags TEXT,
  report_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
