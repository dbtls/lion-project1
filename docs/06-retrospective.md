## EC2 배포 시 메모리 부족으로 인한 서버 다운

### 문제 상황

- EC2 배포 후 일정 시간이 지나면
  - SSH 접속이 극도로 느려짐
  - 명령어 입력 후 수 분간 응답 없음
  - SSH 세션 종료 후 **재접속 불가**
- EC2 재시작 후에는 일시적으로 정상 복구

### 확인된 에러 및 상태

- `free -h` 확인 결과:

  ```
  Mem: 904Mi total
  available: 18Mi
  Swap: 0B
  ```

- 프리티어 EC2 (RAM 1GB) 환경에서:
  - Spring Boot (Java)
  - MySQL
  - Nginx
  - Docker 데몬
    동시 실행

### 원인 분석

- 메모리 부족 상태에서 Swap이 설정되지 않음
- Docker + Java + MySQL 조합으로 인해 **OOM(Out Of Memory)** 발생
- 커널이 프로세스를 강제 종료하면서 SSH 및 Docker까지 영향을 받음

### 해결 과정

1. Swap 파일 생성 (2GB)

   ```bash
   sudo fallocate -l 2G /swapfile
   sudochmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile

   ```

2. 재부팅 후에도 유지되도록 `/etc/fstab` 설정
3. Swap 정상 적용 확인

   ```bash
   free -h

   ```

### 결과

- 서버 다운 현상 재발 없음
- SSH 접속 및 Docker 컨테이너 안정화

## Docker Compose / Buildx 미설치로 인한 EC2 배포 실패

### 문제 상황

- EC2 서버에 Docker를 설치한 뒤 `docker-compose up -d`을 실행했으나 docker-compose를 찾지 못함.

### 확인된 에러 및 상태

1. docker-compose 명령어 미존재

```
docker:'compose' is not a docker command.

```

### 원인 분석

- 로컬 환경의 Docker Desktop은 설치시 Docker Compose등이 자동으로 같이 설치
- EC2 서버에는 Docker 만 설치된 상태였고,
  - Docker Compose 플러그인 미설치
  - Docker Buildx 플러그인 미설치
    - Docker Compose의 build 기능은 내부적으로 **Buildx를 사용**

즉, EC2 환경에서는 Docker 설치만으로는 `docker compose build`가 동작하지 않는 구조

### 해결 과정

### 1. Docker Compose 플러그인 설치

```bash
sudomkdir -p /usr/local/lib/docker/cli-plugins

sudo curl -SL \
https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
-o /usr/local/lib/docker/cli-plugins/docker-compose

sudochmod +x /usr/local/lib/docker/cli-plugins/docker-compose

```

설치 확인:

```bash
docker compose version

```

---

### 2. Docker Buildx 플러그인 설치

```bash
sudomkdir -p /usr/local/lib/docker/cli-plugins

sudo curl -SL \
https://github.com/docker/buildx/releases/latest/download/buildx-linux-amd64 \
-o /usr/local/lib/docker/cli-plugins/docker-buildx

sudochmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

```

설치 확인:

```bash
docker buildx version

```

---

### 3. Docker Compose 재실행

```bash
docker compose up -d --build

```

### 결과

- 제대로 docker-compose.yml 파일로 build 및 컨테이너 생성
