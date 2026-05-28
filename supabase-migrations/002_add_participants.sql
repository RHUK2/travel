-- 참여자 테이블 추가

create table if not exists participants (
  id         text        not null,
  trip_id    text        not null default 'yonago-2026',
  name       text        not null,
  photo_url  text        not null default '',
  message    text        not null default '',
  joined_at  timestamptz not null default now(),
  primary key (trip_id, id)
);

alter table participants enable row level security;

create policy "participants public read"
  on participants for select
  using (true);

create policy "participants public write"
  on participants for insert
  with check (true);

create policy "participants public update"
  on participants for update
  using (true)
  with check (true);

create policy "participants public delete"
  on participants for delete
  using (true);

alter publication supabase_realtime add table participants;
