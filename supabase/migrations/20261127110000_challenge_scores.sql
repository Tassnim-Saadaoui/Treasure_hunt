create table if not exists public.challenge (
  id integer primary key check (id between 1 and 6),
  score integer not null default 0 check (score >= 0),
  time numeric(3, 1) not null check (time >= 0)
);

comment on column public.challenge.time is
  'Challenge time target, stored in minutes.';

insert into public.challenge (id, score, time)
values
  (1, 10, 2),
  (2, 25, 5),
  (3, 10, 2),
  (4, 20, 2),
  (5, 15, 3),
  (6, 20, 2.5)
on conflict (id) do update
set score = excluded.score,
    time = excluded.time;

alter table public.challenge enable row level security;
revoke all on public.challenge from public, anon, authenticated;
grant all on public.challenge to service_role;
