-- 초기 스키마: item_states

create table if not exists item_states (
  trip_id    text        not null default 'yonago-2026',
  item_id    text        not null,
  is_done    boolean     not null default false,
  memo       text        not null default '',
  value      text        not null default '',
  updated_at timestamptz not null default now(),
  primary key (trip_id, item_id)
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger item_states_updated_at
  before update on item_states
  for each row execute function update_updated_at();

alter table item_states enable row level security;

create policy "public read"
  on item_states for select
  using (true);

create policy "public write"
  on item_states for insert
  with check (true);

create policy "public update"
  on item_states for update
  using (true)
  with check (true);

alter publication supabase_realtime add table item_states;
