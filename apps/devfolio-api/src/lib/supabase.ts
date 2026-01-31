import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    long_description?: string;
    image?: string;
    category: string;
    technologies: string[];
    github_url?: string;
    live_url?: string;
    featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar?: string;
    location?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    icon?: string;
}

export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read?: boolean;
    created_at?: string;
}

export interface ChatMessage {
    id?: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at?: string;
}
