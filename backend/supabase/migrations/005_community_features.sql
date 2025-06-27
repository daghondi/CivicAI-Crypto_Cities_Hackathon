-- Community Features Schema
-- Discussion Forums, User Profiles, Reputation, and Notifications

-- User Profiles Extension
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT UNIQUE NOT NULL, -- Wallet address
    username TEXT UNIQUE,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    location TEXT,
    website TEXT,
    twitter_handle TEXT,
    github_handle TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    reputation_score INTEGER DEFAULT 0,
    total_icc_earned DECIMAL(18, 2) DEFAULT 0,
    governance_participation_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reputation System
CREATE TABLE reputation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    event_type TEXT NOT NULL, -- 'proposal_created', 'vote_cast', 'comment_posted', 'upvote_received', etc.
    points INTEGER NOT NULL,
    related_id TEXT, -- ID of related proposal, comment, etc.
    related_type TEXT, -- 'proposal', 'comment', 'amendment', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion Forums
CREATE TABLE discussion_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT '💬',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE discussion_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES discussion_categories(id),
    author_address TEXT NOT NULL REFERENCES user_profiles(address),
    proposal_id TEXT, -- Optional link to a proposal
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE,
    last_reply_by TEXT REFERENCES user_profiles(address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id), -- For nested replies
    content TEXT NOT NULL,
    author_address TEXT NOT NULL REFERENCES user_profiles(address),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voting system for discussions
CREATE TABLE discussion_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    reply_id UUID NOT NULL REFERENCES discussion_replies(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_address, reply_id)
);

-- Proposal Comments (separate from general discussions)
CREATE TABLE proposal_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id TEXT NOT NULL,
    parent_comment_id UUID REFERENCES proposal_comments(id), -- For nested comments
    author_address TEXT NOT NULL REFERENCES user_profiles(address),
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment voting
CREATE TABLE proposal_comment_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    comment_id UUID NOT NULL REFERENCES proposal_comments(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_address, comment_id)
);

-- Notification System
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    email_notifications BOOLEAN DEFAULT TRUE,
    proposal_updates BOOLEAN DEFAULT TRUE,
    comment_replies BOOLEAN DEFAULT TRUE,
    discussion_mentions BOOLEAN DEFAULT TRUE,
    governance_updates BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_address TEXT NOT NULL REFERENCES user_profiles(address),
    sender_address TEXT REFERENCES user_profiles(address),
    type TEXT NOT NULL, -- 'proposal_comment', 'mention', 'vote_received', 'reputation_milestone', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id TEXT, -- ID of related item
    related_type TEXT, -- 'proposal', 'comment', 'thread', etc.
    action_url TEXT, -- URL to navigate to when clicked
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements/Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    badge_color TEXT DEFAULT '#10B981',
    criteria TEXT NOT NULL, -- JSON describing the criteria
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_address, achievement_id)
);

-- User Following System
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_address TEXT NOT NULL REFERENCES user_profiles(address),
    following_address TEXT NOT NULL REFERENCES user_profiles(address),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_address, following_address),
    CHECK(follower_address != following_address)
);

-- Analytics and Engagement Tracking
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL REFERENCES user_profiles(address),
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_address ON user_profiles(address);
CREATE INDEX idx_user_profiles_reputation ON user_profiles(reputation_score DESC);
CREATE INDEX idx_reputation_events_user ON reputation_events(user_address);
CREATE INDEX idx_discussion_threads_category ON discussion_threads(category_id);
CREATE INDEX idx_discussion_threads_created ON discussion_threads(created_at DESC);
CREATE INDEX idx_discussion_replies_thread ON discussion_replies(thread_id);
CREATE INDEX idx_proposal_comments_proposal ON proposal_comments(proposal_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_address, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_user_activity_log_user ON user_activity_log(user_address);

-- RLS (Row Level Security) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on requirements)
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (address = auth.jwt() ->> 'wallet_address');

CREATE POLICY "Discussion threads are viewable by everyone" ON discussion_threads
    FOR SELECT USING (true);

CREATE POLICY "Discussion replies are viewable by everyone" ON discussion_replies
    FOR SELECT USING (true);

CREATE POLICY "Proposal comments are viewable by everyone" ON proposal_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (recipient_address = auth.jwt() ->> 'wallet_address');
