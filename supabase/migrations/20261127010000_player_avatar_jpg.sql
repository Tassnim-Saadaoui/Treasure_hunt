alter table public.players
  drop constraint if exists players_avatar_check;

update public.players
set avatar = replace(avatar, '.png', '.jpg')
where avatar in (
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png',
  'avatar7.png',
  'avatar8.png'
);

alter table public.players
  add constraint players_avatar_check check (
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
  );
