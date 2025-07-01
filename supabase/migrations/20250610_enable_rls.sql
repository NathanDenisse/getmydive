@-- Enable RLS
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON spots
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON clubs
  FOR SELECT USING (true); 