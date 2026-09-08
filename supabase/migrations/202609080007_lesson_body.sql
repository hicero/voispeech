-- Lesson body (내용): long text shown below the video in the training player.
-- description remains 소제목 (subtitle under the title).
-- Already applied on project wvgckdjylodzexpgjnpq via MCP; this file keeps repo history in sync.
begin;

alter table public.voispeech_lessons
  add column if not exists body text not null default ''
  check (char_length(body) <= 10000);

commit;
