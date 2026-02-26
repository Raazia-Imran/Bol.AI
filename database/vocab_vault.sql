-- ============================================================
-- Bol.AI — Vocab Vault Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: vocab_vault
-- Stores every Minglish → English correction the AI coaches.
-- Linked to Supabase Auth users with Row-Level Security.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vocab_vault (
    id              UUID            DEFAULT uuid_generate_v4()  PRIMARY KEY,
    user_id         UUID            REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    -- The phrase the user spoke (Minglish / Roman Urdu mix)
    original_phrase TEXT            NOT NULL,

    -- The corrected, natural English version given by Bol.AI
    corrected_phrase TEXT           NOT NULL,

    -- Optional: the sentence/context the phrase appeared in
    context         TEXT,

    -- Category: 'grammar' | 'vocabulary' | 'pronunciation' | 'fluency'
    category        TEXT            DEFAULT 'vocabulary',

    -- Spaced-repetition tracking
    times_practiced INTEGER         DEFAULT 0       NOT NULL,
    mastered        BOOLEAN         DEFAULT FALSE   NOT NULL,
    last_practiced_at TIMESTAMPTZ,

    -- Timestamps
    created_at      TIMESTAMPTZ     DEFAULT NOW()   NOT NULL,
    updated_at      TIMESTAMPTZ     DEFAULT NOW()   NOT NULL
);

-- ============================================================
-- INDEXES — fast filtering by user and recency
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_vocab_vault_user_id
    ON public.vocab_vault (user_id);

CREATE INDEX IF NOT EXISTS idx_vocab_vault_user_created
    ON public.vocab_vault (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vocab_vault_mastered
    ON public.vocab_vault (user_id, mastered);

-- ============================================================
-- ROW LEVEL SECURITY — users can ONLY access their own rows
-- ============================================================
ALTER TABLE public.vocab_vault ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own vocab
CREATE POLICY "Users can read own vocab"
    ON public.vocab_vault
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own vocab
CREATE POLICY "Users can insert own vocab"
    ON public.vocab_vault
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own vocab (for practice tracking)
CREATE POLICY "Users can update own vocab"
    ON public.vocab_vault
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own vocab
CREATE POLICY "Users can delete own vocab"
    ON public.vocab_vault
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER — auto-updates updated_at on every row change
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vocab_vault_updated
    BEFORE UPDATE ON public.vocab_vault
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================
-- SAMPLE DATA (optional — remove before production)
-- ============================================================
-- INSERT INTO public.vocab_vault (user_id, original_phrase, corrected_phrase, category, context) VALUES
--   (auth.uid(), 'meri gari kharab ho gayi', 'My car broke down.', 'vocabulary', 'Describing a problem'),
--   (auth.uid(), 'kal maine kaam kiya tha', 'I worked yesterday.', 'grammar', 'Past tense practice');
