-- avatars 버킷 스토리지 정책

create policy "avatars anon upload"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'avatars');

create policy "avatars anon update"
  on storage.objects for update
  to anon
  using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');

create policy "avatars anon select"
  on storage.objects for select
  to anon
  using (bucket_id = 'avatars');

create policy "avatars anon delete"
  on storage.objects for delete
  to anon
  using (bucket_id = 'avatars');
