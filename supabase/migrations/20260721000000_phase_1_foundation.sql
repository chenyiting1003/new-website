create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.app_role as enum ('admin','editor','viewer');
create type public.actor_type as enum ('country','jurisdiction','international_organization','regional_organization','governance_initiative');
create type public.governance_orientation as enum ('regulatory','innovation_led','international_coordination','hybrid');
create type public.record_type as enum ('policy','academic_article','research_report','working_paper','preprint','official_statement','standard','news_background');
create type public.legal_status as enum ('draft','consultation','proposed','adopted','in_force','partially_applicable','non_binding','under_revision','repealed','superseded','not_applicable','unknown');
create type public.policy_change_type as enum ('new','revision','implementation','enforcement','consultation_report','international_statement');
create type public.verification_status as enum ('verified_primary','verified_secondary','partially_verified','unverified');
create type public.submission_status as enum ('pending','needs_revision','approved','rejected','published');
create type public.batch_status as enum ('created','processing','ready_for_review','failed','completed');

create table public.profiles (id uuid primary key references auth.users(id) on delete restrict, display_name text, role app_role not null default 'viewer', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.actors (id uuid primary key default gen_random_uuid(), slug text not null unique, name_zh text not null, name_en text not null, actor_type actor_type not null, region text, governance_orientation governance_orientation, one_sentence_summary text not null, overview text, is_featured boolean not null default false, last_reviewed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.themes (id uuid primary key default gen_random_uuid(), slug text not null unique, name_zh text not null, name_en text, parent_id uuid references public.themes(id) on delete restrict, sort_order integer not null default 0, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.ingestion_batches (id uuid primary key default gen_random_uuid(), approved_by uuid not null references public.profiles(id) on delete restrict, approval_timestamp timestamptz not null, scope jsonb not null, status batch_status not null default 'created', source_count integer not null default 0, submission_count integer not null default 0, error_summary text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.records (id uuid primary key default gen_random_uuid(), record_type record_type not null, title_zh text, title_original text not null, summary text not null, why_it_matters text, publication_date date, event_date date, legal_status legal_status, policy_change_type policy_change_type, doi text, official_document_number text, canonical_url text not null, verification_status verification_status not null default 'unverified', is_published boolean not null default false, published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.submissions (id uuid primary key default gen_random_uuid(), batch_id uuid not null references public.ingestion_batches(id) on delete restrict, status submission_status not null default 'pending', suggested_record_type record_type not null, raw_title text not null, raw_content text, source_url text not null check (source_url ~ '^https?://'), extracted_data jsonb not null default '{}'::jsonb, extraction_confidence numeric check (extraction_confidence between 0 and 1), duplicate_candidates jsonb, verification_status verification_status not null default 'unverified', reviewer_id uuid references public.profiles(id) on delete restrict, review_note text, approved_record_id uuid references public.records(id) on delete restrict, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.sources (id uuid primary key default gen_random_uuid(), record_id uuid references public.records(id) on delete restrict, submission_id uuid references public.submissions(id) on delete restrict, url text not null check (url ~ '^https?://'), canonical_url text not null, source_type text not null, is_primary boolean not null default false, accessed_at timestamptz not null default now(), created_at timestamptz not null default now(), check (record_id is not null or submission_id is not null));
create table public.audit_logs (id uuid primary key default gen_random_uuid(), actor_user_id uuid references public.profiles(id) on delete restrict, entity_type text not null, entity_id uuid not null, action text not null, before_data jsonb, after_data jsonb, note text, created_at timestamptz not null default now());

create function public.normalize_doi(value text) returns text language sql immutable as $$ select lower(regexp_replace(regexp_replace(coalesce(value,''), '^https?://(dx\.)?doi\.org/', '', 'i'), '^doi:\s*|\s+', '', 'gi')) $$;
create unique index records_normalized_doi_unique on public.records (public.normalize_doi(doi)) where doi is not null;
create index records_title_trgm on public.records using gin (title_original gin_trgm_ops);
create index sources_canonical_url_idx on public.sources(canonical_url);
create index submissions_status_batch_idx on public.submissions(status, batch_id);

create function public.current_role() returns app_role language sql stable security definer set search_path = public as $$ select role from public.profiles where id = auth.uid() $$;
create function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$ select public.current_role() in ('admin','editor') $$;
alter table public.profiles enable row level security; alter table public.actors enable row level security; alter table public.themes enable row level security; alter table public.records enable row level security; alter table public.ingestion_batches enable row level security; alter table public.submissions enable row level security; alter table public.sources enable row level security; alter table public.audit_logs enable row level security;
create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.current_role() = 'admin');
create policy "published records read" on public.records for select using (is_published or public.is_staff());
create policy "catalogue read" on public.actors for select using (true); create policy "themes read" on public.themes for select using (true);
create policy "staff batches" on public.ingestion_batches for all using (public.is_staff()) with check (public.is_staff());
create policy "staff submissions" on public.submissions for all using (public.is_staff()) with check (public.is_staff());
create policy "staff sources" on public.sources for all using (public.is_staff()) with check (public.is_staff());
create policy "admin audit logs" on public.audit_logs for select using (public.current_role() = 'admin');
