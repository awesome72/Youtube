# YT Trend Lens

`youtube_주식금융_트렌드분석_프롬프트.md`의 프롬프트 팩을 실제로 쓸 수 있는 정적 웹앱입니다.
공통 변수(기간, 언어권, 시장, 섹터, 투자자유형, 목적)를 입력하면 7개 분석 프롬프트에
자동으로 값이 채워지고, 그대로 복사해서 웹 검색 기능이 있는 LLM에 붙여넣을 수 있습니다.

디자인은 `DESIGN-apple.md`에 정의된 애플 스타일 디자인 시스템(색상, 타이포그래피,
컴포넌트 토큰)을 따릅니다.

## 실행 방법

빌드 도구 없이 순수 HTML/CSS/JS로 작성되었습니다. 아무 정적 서버로 열면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

또는 `index.html`을 브라우저로 바로 열어도 됩니다.

## 구성

- `index.html` — 페이지 구조 (변수 입력, 템플릿 선택, 프롬프트 출력, 키워드/채점표/주의사항)
- `styles.css` — DESIGN-apple.md 기반 스타일 (Action Blue, SF Pro, pill 버튼, 타일 섹션)
- `templates.js` — 프롬프트 팩의 7개 템플릿 원문
- `app.js` — 변수 치환 및 복사 로직
- `youtube_주식금융_트렌드분석_프롬프트.md` — 원본 프롬프트 팩 스펙
- `DESIGN-apple.md` — 원본 디자인 시스템 스펙
