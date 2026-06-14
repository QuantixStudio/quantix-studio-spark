-- Step 1: Add new categories column (nullable initially)
ALTER TABLE tools ADD COLUMN categories text[] DEFAULT ARRAY[]::text[];

-- Step 2: Migrate existing data (convert single category to array)
UPDATE tools SET categories = ARRAY[category::text];

-- Step 3: Drop old category column
ALTER TABLE tools DROP COLUMN category;

-- Step 4: Make categories NOT NULL
ALTER TABLE tools ALTER COLUMN categories SET NOT NULL;

-- Step 5: Add check constraint to ensure at least one category
ALTER TABLE tools ADD CONSTRAINT tools_categories_not_empty 
  CHECK (array_length(categories, 1) > 0);

-- Step 6: Add check constraint to validate enum values
ALTER TABLE tools ADD CONSTRAINT tools_categories_valid 
  CHECK (
    categories <@ ARRAY[
      'Frontend', 'Backend', 'Database', 'AI', 'Automation', 
      'Design', 'CMS', 'Email & Marketing', 'Analytics', 
      'CRM / Business Tools', 'Mobile', 'SaaS', 'Full-stack'
    ]::text[]
  );