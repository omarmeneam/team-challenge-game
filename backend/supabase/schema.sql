-- Enable Row Level Security
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Teams Table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  skip_aids_remaining INTEGER DEFAULT 3,
  fifty_fifty_aids_remaining INTEGER DEFAULT 3,
  time_freeze_aids_remaining INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Questions Table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  answers JSONB NOT NULL, -- Array of possible answers including the correct one
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Game Sessions Table
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  current_question_number INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Team Game Sessions (Junction Table)
CREATE TABLE team_game_sessions (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  final_score INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  aids_used JSONB DEFAULT '{"skip": 0, "fifty_fifty": 0, "time_freeze": 0}'::jsonb,
  PRIMARY KEY (team_id, game_session_id)
);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_game_sessions ENABLE ROW LEVEL SECURITY;

-- Public access policies (customize based on your authentication requirements)
CREATE POLICY "Public read access to teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Public read access to questions"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Public read access to game sessions"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Public read access to team game sessions"
  ON team_game_sessions FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_teams_score ON teams(score DESC);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);

-- Sample data for testing
INSERT INTO questions (question, correct_answer, answers, difficulty, category, points) VALUES
('What is the capital of Egypt?', 'Cairo', '["Cairo", "Alexandria", "Luxor", "Aswan"]', 'easy', 'Geography', 200),
('Which ancient Egyptian god was associated with the sun?', 'Ra', '["Ra", "Osiris", "Anubis", "Horus"]', 'medium', 'History', 400),
('What is the approximate height of the Great Pyramid of Giza?', '146.5 meters', '["146.5 meters", "123.4 meters", "158.7 meters", "134.2 meters"]', 'hard', 'Architecture', 600);