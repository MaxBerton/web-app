-- Fix storage policies: allow access by path (first folder = user id).
-- Supabase may use owner_id instead of owner; using path ensures uploads and signed URLs work.

drop policy if exists storage_select_request_attachments on storage.objects;
create policy storage_select_request_attachments
on storage.objects for select
using (
  bucket_id = 'request-attachments'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = (select auth.uid()::text)
  )
);

drop policy if exists storage_insert_request_attachments on storage.objects;
create policy storage_insert_request_attachments
on storage.objects for insert
with check (
  bucket_id = 'request-attachments'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists storage_delete_request_attachments on storage.objects;
create policy storage_delete_request_attachments
on storage.objects for delete
using (
  bucket_id = 'request-attachments'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = (select auth.uid()::text)
  )
);
