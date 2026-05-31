-- 캐시 테이블: 외부 API(날씨·환율) 응답을 저장해 불필요한 반복 호출 방지

create table weather_cache (
  trip_id    text        not null,
  data       jsonb       not null default '[]',
  updated_at timestamptz not null default now(),
  primary key (trip_id)
);

create trigger weather_cache_updated_at
  before update on weather_cache
  for each row execute function update_updated_at();

alter table weather_cache enable row level security;

create policy "weather_cache_select" on weather_cache for select using (true);
create policy "weather_cache_insert" on weather_cache for insert with check (true);
create policy "weather_cache_update" on weather_cache for update using (true) with check (true);

-- ---

create table rate_cache (
  trip_id    text        not null,
  rate       numeric     not null,
  updated_at timestamptz not null default now(),
  primary key (trip_id)
);

create trigger rate_cache_updated_at
  before update on rate_cache
  for each row execute function update_updated_at();

alter table rate_cache enable row level security;

create policy "rate_cache_select" on rate_cache for select using (true);
create policy "rate_cache_insert" on rate_cache for insert with check (true);
create policy "rate_cache_update" on rate_cache for update using (true) with check (true);
