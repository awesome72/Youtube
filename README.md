# YouTube Trend Lens

키워드 기반 YouTube 영상 트렌드 분석 대시보드. YouTube Data API v3로 최근 7일/30일 영상을
수집해 조회수 증가 가능성이 높은 영상, 검색어별 성과, 제목·설명 기반 자주 등장하는 키워드를
카드와 차트로 시각화합니다.

## 기능

- 기본 제공 키워드(반도체, 전력, 금융, 원자력, 로봇, 미국지수, 한국지수, 환율, 유가) + 사용자 직접 입력 키워드 지원
- 최근 7일 / 30일 기간 전환
- 영상별 조회수, 좋아요수, 참여율, 게시일 수집
- **Trend Score**: 조회수 / 게시 경과일(조회수 증가 속도)을 로그 스케일로 정규화한 0~100 추정 점수
  (YouTube API는 과거 조회수 시계열을 제공하지 않으므로, 현재 스냅샷 기반의 근사치입니다)
- 조회수 증가 가능성이 높은 영상 TOP 10
- 제목·설명 텍스트 기반 자주 등장하는 키워드 TOP 10 (Recharts 바 차트)
- 검색어별 성과 비교 차트 (평균 Trend Score, 총 조회수)
- 모바일/PC 반응형 UI

## 기술 스택

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Recharts
- YouTube Data API v3 — API 키는 서버의 Next.js API Route(`/api/youtube`)에서만 사용되며
  클라이언트 번들에는 포함되지 않습니다.

## 시작하기

### 1. YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. "API 및 서비스 > 라이브러리"에서 **YouTube Data API v3** 활성화
3. "사용자 인증 정보"에서 API 키 발급 (필요 시 HTTP 리퍼러 제한 설정)

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`을 열어 발급받은 키를 입력합니다.

```
YOUTUBE_API_KEY=발급받은_키
```

`.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다.

### 3. 의존성 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

### 4. 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

1. 이 저장소를 [Vercel](https://vercel.com/new)에서 Import
2. Framework Preset은 Next.js가 자동으로 인식됩니다.
3. **Project Settings > Environment Variables**에 `YOUTUBE_API_KEY`를 추가합니다
   (Production/Preview/Development 모두 필요 시 추가).
4. Deploy를 실행하면 자동으로 빌드·배포됩니다.

> API 키는 서버 환경 변수로만 주입되므로 반드시 Vercel 프로젝트의 Environment Variables에
> 등록해야 하며, 클라이언트 코드에는 절대 하드코딩하지 않습니다.

## 프로젝트 구조

```
src/
  app/
    api/youtube/route.ts   # YouTube Data API 호출 + 트렌드 분석 API Route (서버 전용)
    page.tsx                # 대시보드 페이지 (클라이언트 컴포넌트)
    layout.tsx
  components/               # KeywordPicker, PeriodToggle, StatCard, 차트, 영상 리스트
  lib/
    youtube.ts               # YouTube Data API 클라이언트 (search.list, videos.list)
    analysis.ts               # Trend Score 계산, 키워드 빈도 분석, 요약 생성
    constants.ts
    format.ts
  types/youtube.ts
```

## 참고: 원본 분석 스펙 문서

- `youtube_주식금융_트렌드분석_프롬프트.md` — YouTube 주식·금융 콘텐츠 분석용 LLM 프롬프트 팩
- `DESIGN-apple.md` — 참고용 Apple 스타일 디자인 시스템 분석 문서

## 주의사항

Trend Score와 성장 가능성 추정치는 YouTube API의 시점 스냅샷 데이터를 기반으로 한 근사치이며,
실제 조회수 성장 시계열이 아닙니다. 투자 자문이 아니며 정보 제공 목적입니다.
