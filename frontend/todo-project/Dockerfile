FROM node:20-alpine
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사
COPY . .

# Next 빌드
RUN npm run build

# 운영 포트
EXPOSE 3000

# Next 운영 서버 실행
CMD ["npm", "run", "start"]
