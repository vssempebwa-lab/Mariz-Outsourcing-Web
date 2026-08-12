alter table ops_meetings
  add column if not exists meeting_nature text not null default 'physical',
  add column if not exists location text,
  add column if not exists online_avenue text;

alter table ops_meetings
  drop constraint if exists ops_meetings_nature_check;

alter table ops_meetings
  add constraint ops_meetings_nature_check
  check (meeting_nature in ('physical', 'online'));

comment on column ops_meetings.meeting_nature is 'Whether the meeting is physical or online.';
comment on column ops_meetings.location is 'Physical venue when meeting_nature is physical.';
comment on column ops_meetings.online_avenue is 'Online platform or meeting channel when meeting_nature is online.';
