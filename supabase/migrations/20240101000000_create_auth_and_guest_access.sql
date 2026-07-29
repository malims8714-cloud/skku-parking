-- ─────────────────────────────────────────────────────────────
-- SKKU Smart Parking - Auth Migration
-- Supabase 대시보드 > SQL Editor 에서 실행하세요.
-- 주의: 실제 이메일 주소는 이 파일에 절대 입력하지 마세요.
-- ─────────────────────────────────────────────────────────────

-- 1. 사용자 프로필 테이블 (public 스키마)
create table if not exists public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  email        text,
  display_name text,
  created_at   timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. 신규 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_anonymous is false then
    insert into public.profiles (id, email, display_name)
    values (new.id, new.email, split_part(new.email, '@', 1))
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 3. 허용 이메일 테이블 (private 스키마 - 브라우저 REST API 접근 불가)
-- ─────────────────────────────────────────────────────────────
create schema if not exists private;

create table if not exists private.allowed_emails (
  id         serial primary key,
  email      text unique not null,
  note       text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. Before User Created Hook (이메일 허용 여부 검사)
-- 설정 방법: 대시보드 > Authentication > Hooks > Before User Created
-- 에서 아래 함수(public.check_allowed_email)를 선택하세요.
-- ─────────────────────────────────────────────────────────────
create or replace function public.check_allowed_email(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  user_email text;
  is_allowed boolean;
begin
  -- 익명 로그인은 항상 허용
  if (event->>'user_data') is null
     or (event->'claims'->>'email') is null then
    return event;
  end if;

  user_email := lower(trim(event->'claims'->>'email'));

  if user_email = '' then
    return event;
  end if;

  select exists(
    select 1 from private.allowed_emails
    where lower(trim(email)) = user_email
  ) into is_allowed;

  if not is_allowed then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message',   '가입이 허용되지 않은 이메일입니다.'
      )
    );
  end if;

  return event;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 5. 허용 이메일 등록 (이 줄들을 이 파일에 커밋하지 마세요)
-- 대시보드 SQL Editor 에서 직접 실행하세요:
--
-- insert into private.allowed_emails (email, note) values
--   ('team-member@skku.edu', '팀원 이름');
-- ─────────────────────────────────────────────────────────────
