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

### 원인 분석

- 메모리 부족 상태에서 Swap이 설정되지 않음
- Docker + Java + MySQL 조합으로 인해 에러 발생
- 커널이 프로세스를 강제 종료하는것으로 추정

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

## 로컬 도커
