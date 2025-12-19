FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE


RUN npm run build

# 운영 포트
EXPOSE 3000

# Next 운영 서버 실행
CMD ["npm", "run", "start"]
