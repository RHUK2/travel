-- 참여자: 어드민이 미리 등록한 유저, 로그인 시 token 발급

create table participants (
  id         text        not null,
  trip_id    text        not null default 'yonago-2026',
  name       text        not null,
  token      text,
  photo_url  text        not null default '',
  message    text        not null default '',
  joined_at  timestamptz not null default now(),
  primary key (trip_id, id),
  unique (trip_id, name)
);

alter table participants enable row level security;

create policy "participants_select" on participants for select using (true);
create policy "participants_insert" on participants for insert with check (true);
create policy "participants_update" on participants for update using (true) with check (true);
create policy "participants_delete" on participants for delete using (true);

alter publication supabase_realtime add table participants;

-- 참여자 등록 예시 (실제 이름으로 교체 후 실행)
-- insert into participants (id, trip_id, name)
-- values
--   (gen_random_uuid()::text, 'yonago-2026', '홍길동'),
--   (gen_random_uuid()::text, 'yonago-2026', '김철수');
