# 로그인 기능 설정 가이드

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 접속 → 무료 계정 생성
2. **New project** 클릭 → 프로젝트 이름 입력 (예: `skku-parking`)
3. 데이터베이스 비밀번호 설정 (기억해 두세요)
4. Region: **Northeast Asia (Seoul)** 선택 → Create project

## 2. API 키 복사

대시보드 좌측 메뉴 → **Settings** → **API**

- **Project URL** 복사
- **anon public** 키 복사 (service_role 키는 절대 사용하지 마세요)

## 3. .env 파일 생성

프로젝트 루트에 `.env` 파일을 만들고 아래 내용 입력:

```
VITE_SUPABASE_URL=여기에_Project_URL_붙여넣기
VITE_SUPABASE_ANON_KEY=여기에_anon_public_키_붙여넣기
```

> `.env` 파일은 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다.

## 4. 데이터베이스 마이그레이션 실행

대시보드 → **SQL Editor** → `supabase/migrations/20240101000000_create_auth_and_guest_access.sql` 파일 내용 전체 복사 → 붙여넣기 → **Run**

## 5. 허용 이메일 등록

팀원 이메일을 등록해야 회원가입이 가능합니다.

**SQL Editor** 에서 아래 쿼리 실행 (이메일 교체):

```sql
insert into private.allowed_emails (email, note) values
  ('your-email@skku.edu', '팀원 이름');
```

> 이 쿼리를 파일로 저장하거나 GitHub에 커밋하지 마세요.

## 6. Before User Created Hook 설정

대시보드 → **Authentication** → **Hooks** → **Before User Created**

- **Enabled** 체크
- **Type**: Postgres function
- **Schema**: public
- **Function**: check_allowed_email
- Save

## 7. Netlify 환경 변수 설정

Netlify 대시보드 → 프로젝트 선택 → **Site settings** → **Environment variables**

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public 키 |

저장 후 **Deploys** → **Trigger deploy** → **Deploy site** 클릭

## 비회원 로그인 활성화 (선택)

대시보드 → **Authentication** → **Providers** → **Anonymous Sign-ins** → Enable
