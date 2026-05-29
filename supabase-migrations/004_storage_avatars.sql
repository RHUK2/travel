-- Storage: avatars 버킷 공개 접근 정책
-- 선행 조건: Supabase 대시보드에서 'avatars' 버킷을 먼저 생성해야 합니다.

create policy "avatars_select" on storage.objects for select to anon using (bucket_id = 'avatars');
create policy "avatars_insert" on storage.objects for insert to anon with check (bucket_id = 'avatars');
create policy "avatars_update" on storage.objects for update to anon using (bucket_id = 'avatars') with check (bucket_id = 'avatars');
create policy "avatars_delete" on storage.objects for delete to anon using (bucket_id = 'avatars');
