-- Enable RLS on lookup tables and add public read policies

-- Service Icon table
ALTER TABLE service_icon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view service icons"
ON service_icon FOR SELECT
TO public
USING (true);

-- Project Category table
ALTER TABLE project_category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project categories"
ON project_category FOR SELECT
TO public
USING (true);

-- Technologies table
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view technologies"
ON technologies FOR SELECT
TO public
USING (true);

-- Project Technologies junction table
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project technologies"
ON project_technologies FOR SELECT
TO public
USING (true);

-- Inquiry Status table (read-only for public, managed by admin)
ALTER TABLE inquiry_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inquiry statuses"
ON inquiry_status FOR SELECT
TO public
USING (true);