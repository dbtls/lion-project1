# Todo Project (Next.js)

Next.js 기반의 Todo 리스트 애플리케이션입니다.

## 기술 스택

- **Next.js 15** (App Router)
- **React 19**
- **ESLint** (Next.js 기본 설정)

## 시작하기

### 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

3. 개발 서버 실행:
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 스크립트

- `npm run dev` - 개발 서버 실행 (포트 3000)
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 프로젝트 구조

```
frontend/todo-project/
├── app/                  # Next.js App Router
│   ├── layout.js        # 루트 레이아웃
│   ├── page.js          # 메인 페이지 (Client Component)
│   └── globals.css      # 전역 스타일
├── src/
│   ├── api/             # API 호출 로직
│   ├── components/      # React 컴포넌트
│   ├── constants/       # 상수 (API_BASE 등)
│   └── utils/           # 유틸리티 함수
└── public/              # 정적 파일
```

## 환경 변수

- `NEXT_PUBLIC_API_BASE`: 백엔드 API 베이스 URL (필수)
  - 로컬 개발: `http://localhost:8080`
  - 배포 환경: `http://<EC2_IP>:8080` 또는 실제 도메인

## 배포

Docker를 사용한 배포는 `docker-compose.yml`을 참고하세요.
