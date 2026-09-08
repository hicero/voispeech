-- Optional lesson card thumbnails + image mime types on voispeech-lessons bucket.
-- Applied on project wvgckdjylodzexpgjnpq via MCP; this file keeps repo history in sync.

alter table public.voispeech_lessons
  add column if not exists thumbnail_path text
    check (thumbnail_path is null or char_length(thumbnail_path) <= 500);

update storage.buckets
set allowed_mime_types = array[
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp'
]
where id = 'voispeech-lessons';
