-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    onboarding_responses JSONB,
    user_history JSONB DEFAULT '{"previous_devotions": [], "engagement_patterns": {}, "date_last_updated": null}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Devotional Content Table
CREATE TABLE devotional_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    scripture JSONB NOT NULL,
    reflection TEXT NOT NULL,
    prayer TEXT NOT NULL,
    theme VARCHAR(100),
    estimated_read_time INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Prayer Requests Table
CREATE TABLE prayer_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_answered BOOLEAN DEFAULT FALSE,
    answered_date TIMESTAMP WITH TIME ZONE,
    answered_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entries Table
CREATE TABLE journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    mood VARCHAR(50),
    tags TEXT[],
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts Table
CREATE TABLE community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'prayer_request', -- prayer_request, testimony, question, discussion
    is_anonymous BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments Table
CREATE TABLE community_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Engagement Tracking Table
CREATE TABLE user_engagement (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- devotional_read, prayer_created, journal_entry, community_post, etc.
    action_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_devotional_content_user_id ON devotional_content(user_id);
CREATE INDEX idx_devotional_content_date ON devotional_content(date);
CREATE INDEX idx_prayer_requests_user_id ON prayer_requests(user_id);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_user_engagement_user_id ON user_engagement(user_id);
CREATE INDEX idx_user_engagement_created_at ON user_engagement(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotional_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Devotional Content Policies
CREATE POLICY "Users can view own devotionals" ON devotional_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devotionals" ON devotional_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Prayer Requests Policies
CREATE POLICY "Users can view own prayer requests" ON prayer_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer requests" ON prayer_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer requests" ON prayer_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer requests" ON prayer_requests
    FOR DELETE USING (auth.uid() = user_id);

-- Journal Entries Policies
CREATE POLICY "Users can view own journal entries" ON journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Community Posts Policies
CREATE POLICY "Anyone can view community posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert community posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Community Comments Policies
CREATE POLICY "Anyone can view community comments" ON community_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert community comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community comments" ON community_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community comments" ON community_comments
    FOR DELETE USING (auth.uid() = user_id);

-- User Engagement Policies
CREATE POLICY "Users can view own engagement" ON user_engagement
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement" ON user_engagement
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 