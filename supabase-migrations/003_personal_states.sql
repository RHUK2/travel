-- 개인 상태: 메모, 경비 입력값, 체크리스트 완료 여부 (유저별 독립 데이터)

create table personal_states (
  trip_id    text        not null default 'yonago-2026',
  item_id    text        not null,
  user_id    text        not null,
  is_done    boolean     not null default false,
  memo       text        not null default '',
  value      text        not null default '',
  updated_at timestamptz not null default now(),
  primary key (trip_id, item_id, user_id)
);

create trigger personal_states_updated_at
  before update on personal_states
  for each row execute function update_updated_at();

alter table personal_states enable row level security;

create policy "personal_states_select" on personal_states for select using (true);
create policy "personal_states_insert" on personal_states for insert with check (true);
create policy "personal_states_update" on personal_states for update using (true) with check (true);

alter publication supabase_realtime add table personal_states;
