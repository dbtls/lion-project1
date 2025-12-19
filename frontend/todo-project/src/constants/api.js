// Next.js 환경 변수 사용 (클라이언트에서 접근 가능한 변수는 NEXT_PUBLIC_ 접두사 필요)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

export { API_BASE };
