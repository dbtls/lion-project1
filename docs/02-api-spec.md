# API 명세서

## 1. Todo 목록 조회

| 항목     | 내용                                         |
| -------- | -------------------------------------------- |
| URL      | GET /api/todos                               |
| Request  | 없음                                         |
| Response | `[{ id, title, detail, todoAt, done }, ...]` |

## 2. Todo 등록

| 항목     | 내용                                  |
| -------- | ------------------------------------- |
| URL      | POST /api/todos                       |
| Request  | `{ title, todoAt, detail }`           |
| Response | `{ id, title, detail, todoAt, done }` |

## 3. Todo 완료 상태 토글

| 항목     | 내용                                  |
| -------- | ------------------------------------- |
| URL      | PATCH /api/todos/{id}/toggle          |
| Request  | 없음                                  |
| Response | `{ id, title, detail, todoAt, done }` |

## 4. 완료된 Todo 일괄 삭제

| 항목     | 내용                   |
| -------- | ---------------------- |
| URL      | DELETE /api/todos/done |
| Request  | 없음                   |
| Response | 없음                   |
