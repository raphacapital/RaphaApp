-- Supabase Migration: Update user_profiles table to match existing schema
-- Run this in your Supabase SQL Editor to add missing fields

-- Add full_name field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- Update the migration script to match your existing schema
-- Note: Your table already exists, so we're just ensuring it has all needed fields

-- Verify the table structure matches what we need
-- The table should now have:
-- - id (UUID, primary key)
-- - user_id (UUID, foreign key to auth.users)
-- - created_at (timestamp with time zone)
-- - updated_at (timestamp with time zone)
-- - full_name (TEXT) - NEW FIELD ADDED
-- - gender (TEXT)
-- - birthday (DATE)
-- - devotional_experience (TEXT)
-- - spiritual_journey (TEXT)
-- - life_challenges (TEXT[])
-- - current_emotional_state (TEXT)
-- - preferred_themes (TEXT[])
-- - devotional_goals (TEXT[])
-- - style_reverent_conversational (INTEGER)
-- - style_comforting_challenging (INTEGER)
-- - style_poetic_practical (INTEGER)
-- - style_traditional_modern (INTEGER)
-- - preferred_time (TEXT)
-- - additional_notes (TEXT)

-- Ensure proper foreign key constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_user_id_fkey'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure unique constraint on user_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_user_id_key'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at if it doesn't exist
DROP TRIGGER IF EXISTS handle_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Insert a sample profile for testing (optional)
-- INSERT INTO public.user_profiles (user_id, full_name, devotional_experience)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'beginner');
