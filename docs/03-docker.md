# Docker 구성 설명

## 1. Docker를 사용하는 이유

이 프로젝트는 프론트엔드(React/Vite), 백엔드(Spring Boot), 데이터베이스(MySQL)처럼 실행 환경과 의존성이 서로 다른 구성 요소로 이루어져 있다. 로컬에서는 각자 설치해서 실행할 수 있지만, 개발자 PC마다 OS/버전/설치 상태가 달라지면 내 컴퓨터에서는 되는데 다른 환경에서는 안 되는 문제가 쉽게 생긴다. 이는 협업시 치명적으로 다가온다. Docker를 사용하면 각 구성 요소를 컨테이너로 표준화된 환경에서 실행할 수 있다.

## 2. Backend Dockerfile 설명

백엔드 Dockerfile은 “이미 빌드된 JAR를 컨테이너에서 실행”하는 방식이다. 즉 컨테이너 안에서 Gradle 빌드를 다시 하지 않고, 호스트(로컬/CI)에서 만들어진 `build/libs/*.jar`를 넣어서 실행만 한다.

```docker
FROM eclipse-temurin:21-jdk

```

Java 21을 실행/빌드할 수 있는 JDK가 포함된 베이스 이미지를 사용한다. 이 프로젝트는 JDK 21을 기준으로 개발했기 때문에 컨테이너에서도 동일한 런타임을 보장한다.

```docker
WORKDIR /app

```

컨테이너 내부 작업 디렉토리를 `/app`으로 설정한다. 이후 `COPY`, `ENTRYPOINT` 등이 이 경로 기준으로 동작해 파일 관리가 단순해진다.

```docker
COPY build/libs/*.jar app.jar

```

호스트의 `build/libs`에 생성된 JAR 파일을 컨테이너 `/app/app.jar`로 복사한다.

```docker
EXPOSE 8080

```

컨테이너가 8080 포트를 사용한다는 선언이다.

```docker
ENTRYPOINT ["java","-jar","/app/app.jar"]

```

컨테이너가 시작될 때 Spring Boot JAR를 실행한다. `ENTRYPOINT`는 컨테이너의 “기본 실행 명령”이 되며, 컨테이너는 이 프로세스가 살아있는 동안 실행 상태를 유지한다.

## 3. Frontend Dockerfile 설명

프론트 Dockerfile은 멀티 스테이지 빌드로 구성되어 있다. 첫 번째 단계에서 Vite 빌드를 수행해 정적 파일(dist)을 만들고, 두 번째 단계에서 Nginx로 정적 파일을 서빙한다.

```docker
FROM node:18-alpine AS builder

```

빌드 전용 단계다. Node 18 환경에서 `npm ci`, `npm run build`를 수행하기 위해 사용한다. alpine 기반이라 빌드 이미지 자체도 비교적 가볍다.

```docker
WORKDIR /app

```

빌드 단계의 작업 디렉토리 설정이다.

```docker
COPY package*.json ./
RUN npm ci

```

의존성 설치 단계다. `npm ci`는 `package-lock.json` 기준으로 정확히 동일한 의존성을 설치하는 방식이라 배포 환경에서 재현성이 높다. (lock 파일이 없으면 실패하므로, lock 파일 커밋이 사실상 필수다.) 또한 소스 전체를 복사하기 전에 의존성 설치를 먼저 하면, 소스만 바뀌었을 때 이 단계가 캐시되어 빌드가 빨라진다.

```docker
COPY . .
RUN npm run build

```

소스 코드를 복사하고 Vite 빌드를 수행한다. 결과물은 보통 `/app/dist`에 생성된다.

```docker
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

```

실행 단계다. Node로 실행하는 개발 서버가 아니라, Nginx를 통해 빌드된 정적 파일을 서빙한다. 빌드 단계의 `/app/dist`를 Nginx 기본 정적 경로로 복사해 배포 환경에서 빠르고 안정적으로 제공한다.

```docker
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

Nginx가 80 포트를 통해 서비스를 제공하며, `daemon off`로 포그라운드에서 실행시켜 컨테이너가 종료되지 않게 한다. (컨테이너는 메인 프로세스가 종료되면 함께 종료된다.)

## 4. docker-compose 역할

docker-compose는 여러 컨테이너를 한 번에 정의하고, 같은 네트워크에서 함께 실행되도록 묶어주는 도구다. 이 프로젝트처럼 프론트/백엔드/DB가 함께 동작해야 하는 경우, compose가 없으면 컨테이너 실행 순서, 네트워크 연결, 환경 변수 주입, 볼륨 관리 등을 각각 따로 처리해야 해서 배포가 복잡해진다. compose를 사용하면 “하나의 실행 명령”으로 전체 서비스를 올리고 내릴 수 있다.

아래는 현재 구성에서 중요한 포인트들이다.

### MySQL 서비스

- `image: mysql:8.0`으로 표준 MySQL 이미지를 사용한다.
- `ports: "3308:3306"`은 호스트(EC2/로컬)에서 3308로 접속하면 컨테이너 3306으로 연결된다는 의미다. 다만 백엔드 컨테이너가 DB에 접속할 때는 호스트 포트(3308)가 아니라 컨테이너 포트(3306)를 사용한다.
- `volumes: mysql_data:/var/lib/mysql`로 DB 데이터를 볼륨에 저장한다. 컨테이너가 삭제/재시작되어도 데이터가 유지된다.
- `command`로 문자셋/콜레이션을 utf8mb4로 고정하여 한글/이모지 저장 시 문제를 줄인다.
- `restart: unless-stopped`으로 서버 재부팅 후에도 자동으로 다시 올라오게 한다.

### Backend 서비스

- `build.context`로 백엔드 폴더의 Dockerfile로 이미지를 만든다.
- `depends_on: - mysql`은 컨테이너 시작 순서를 보장한다. 다만 DB가 “완전히 준비된 상태”까지 보장하진 않기 때문에, DB 초기 기동이 느린 환경에서는 재시도 로직/헬스체크가 있으면 더 안정적이다.
- DB 접속은 `SPRING_DATASOURCE_URL`에서 `jdbc:mysql://mysql:3306/...` 형태를 사용한다. 여기서 `mysql`은 docker-compose 내부 DNS로, MySQL 서비스 이름을 그대로 호스트명으로 사용할 수 있다.
- `allowPublicKeyRetrieval=true`는 MySQL 8의 인증 방식(caching_sha2_password)에서 “Public Key Retrieval is not allowed” 오류가 발생할 수 있어 이를 허용하기 위한 옵션이다.
- `ports: "8080:8080"`으로 호스트의 8080에서 백엔드 API에 접근할 수 있다.
- `SPRING_JPA_HIBERNATE_DDL_AUTO=update`로 실행 시점에 테이블을 자동 반영한다. 간단 프로젝트에서는 편하지만, 운영에서는 보통 별도 마이그레이션 도구를 쓰는 편이다.

### Frontend 서비스

- 프론트는 빌드 후 Nginx로 정적 파일을 제공한다.
- `ports: "80:80"`으로 EC2 퍼블릭 IP에 바로 접속하면 프론트 화면이 뜬다.
- `depends_on: - backend`는 컨테이너 시작 순서만 보장한다. 프론트는 정적 서빙이라 백엔드보다 먼저 떠도 화면 자체는 뜨지만, API 호출은 백엔드가 준비되어야 정상이다.
