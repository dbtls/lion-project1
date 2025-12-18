# AWS 배포 설명

## 1. EC2를 선택한 이유

과제에서 제시한 방법이기도 하고, 가장 흔하게 사용되는 가상서버이기 때문에 AWS의 EC2를 사용하였다. 또 프리티어를 통해 비용 부담 없이 실습할 수 있다는 점도 선택 이유 중 하나다.

## 2. 보안 그룹 설정 이유

EC2 인스턴스에는 다음 포트를 인바운드 규칙으로 허용했다.

- 22 (SSH) (x.x.x.x/0)

  로컬 PC에서 EC2 서버로 원격 접속하여 배포, 로그 확인, 설정 변경 등을 수행하기 위해 필요하다.

  허용 ip는 집에서 사용되는 ip주소만을 허용했다.

- 80 (0.0.0.0/0)

  프론트엔드 컨테이너(Nginx)가 정적 파일을 제공하는 포트다. 이 포트를 열어두면 EC2 퍼블릭 IP로 접속하여 바로 서비스 화면을 볼 수 있다.

  웹페이지는 누구나 접속할 수 있어야 하기에 모든 ip를 허용했다.

- 8080 (0.0.0.0/0)
  Spring Boot 백엔드 API가 동작하는 포트다. 프론트엔드에서 API 요청을 보낼 때 사용된다.

최소한의 기능 동작을 위해 필요한 포트만 열어, 불필요한 외부 접근은 제한했다.

## 3. 서버에서 실행한 명령 흐름

EC2 서버에 배포할 때의 전체 흐름은 다음과 같다.

1. EC2 인스턴스에 SSH 접속

   ```bash
   ssh -i <key.pem> ec2-user@<EC2_PUBLIC_IP>

   ```

2. Docker 설치 여부 확인

   ```bash
   docker --version

   ```

3. docker-compose 플러그인 설치

   ```bash
   sudomkdir -p /usr/local/lib/docker/cli-plugins
   sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose
   sudochmod +x /usr/local/lib/docker/cli-plugins/docker-compose

   ```

4. 백엔드 JAR 파일 생성

   ```bash
   ./gradlew build -xtest

   ```

5. 프로젝트 디렉토리 서버로 복사
6. docker-compose 실행

   ```bash
   docker compose up -d

   ```

이 과정을 통해 MySQL, 백엔드, 프론트엔드 컨테이너가 하나의 네트워크에서 함께 실행된다.

## 4. 배포 후 접속 방식

배포가 완료된 이후에는 다음 방식으로 서비스에 접근할 수 있다.

- 프론트엔드 접속

  ```
  http://<EC2_PUBLIC_IP>

  ```

  Nginx 컨테이너를 통해 React 빌드 결과가 제공된다.

- 백엔드 API 접속

  ```
  http://<EC2_PUBLIC_IP>:8080

  ```

  Todo API를 직접 호출하거나, 프론트엔드에서 API 요청을 보내는 데 사용된다.

이 구조를 통해 로컬 환경과 거의 동일한 방식으로 EC2 환경에서도 서비스를 실행할 수 있으며, 이후 CI/CD를 적용해 자동 배포로 확장할 수 있는 기반을 마련했다.
