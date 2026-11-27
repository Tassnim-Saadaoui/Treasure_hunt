create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  nickname text not null unique,
  avatar text not null check (
    avatar in (
      'avatar1.jpg',
      'avatar2.jpg',
      'avatar3.jpg',
      'avatar4.jpg',
      'avatar5.jpg',
      'avatar6.jpg',
      'avatar7.jpg',
      'avatar8.jpg'
    )
  ),
  score integer not null default 0 check (score >= 0),
  current_challenge integer not null default 1 check (current_challenge between 1 and 6),
  completed_challenges integer not null default 0 check (completed_challenges between 0 and 6),
  created_at timestamptz not null default now()
);

create unique index if not exists players_nickname_case_insensitive_idx
  on public.players (lower(nickname));

alter table public.players enable row level security;
revoke all on public.players from public, anon, authenticated;
grant all on public.players to service_role;
