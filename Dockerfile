# Node.js 이미지 버전 고정
FROM node:23.1.0

# 작업 디렉터리 설정
WORKDIR /app

# 시스템 패키지 설치 (최소 설치)
RUN apt-get update && apt-get install -y --no-install-recommends vim \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# npm 캐시 최적화를 위해 package.json과 lock 파일만 복사
COPY package.json package-lock.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY ./ ./

# 컨테이너 포트 번호
EXPOSE 10103

# 컨테이너 실행시 자동으로 아래 명령어 실행
CMD ["npm", "start"]