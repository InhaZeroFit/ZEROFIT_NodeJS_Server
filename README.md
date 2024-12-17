# 👚 ZEROFIT_NODEJS_SERVER
![app-image](public/app_image.png)  

이 프로젝트는 **Google Cloud Platform (GCP)**과 **AI 모델**을 활용하여 가상 피팅 서비스를 제공하는 서버입니다.  
사용자는 앱을 통해 요청을 보내고, AI 기반으로 옷을 가상으로 입어본 이미지를 생성합니다.

---

## 👥 ZEROFIT Contributors

| 이름          | 역할                | GitHub 프로필                      |
|---------------|---------------------|-----------------------------------|
| 홍길동        | 팀 리더 / 기획 및 디자인 | [홍길동](https://github.com/username1) |
| 김철수        | AI       | [김철수](https://github.com/username2) |
| 이영희        | 프론트엔드    | [이영희](https://github.com/username3) |
| 국영희        | 프론트엔드    | [국영희](https://github.com/username3) |
| 박지민        | 백엔드     | [박지민](https://github.com/username4) |

---

## ⚙️ 기술 스택

- **Backend**: Node.js, Express.js  
- **Database**: Cloud SQL (MySQL)  
- **Cloud Provider**: Google Cloud Platform (GCP)  
  - GCP VM Instances (Auto-scaling)  
  - GCP Cloud Load Balancer  
  - GCP Cloud Build (CI/CD)  
- **AI Framework**: SAM2 모델  
- **GPU Server**: NVIDIA A40 (Inha University AI Convergence Research Center)  

---

## 🗂️ 프로젝트 아키텍처

![be-architecture](public/architecture.png)  

1. **클라이언트 요청**  
   - 사용자가 요청을 보내면 GCP Load Balancer를 통해 Express.js 서버로 전달됩니다.

2. **백엔드 처리**  
   - Express.js 서버는 CRUD 요청을 MySQL Cloud SQL로 전송합니다.  
   - 이미지 처리 요청은 GPU 서버로 전달됩니다.

3. **AI 서버**  
   - SAM2 모델을 사용해 전처리된 의류 데이터를 생성합니다.  
   - 가상 피팅 서버는 최종 가상 착용 이미지를 반환합니다.

---

## 🚀 시작하기

### 1. 요구사항

아래 소프트웨어 및 도구가 필요합니다:

- **Node.js** (v18 이상 권장)  
- **npm** 또는 **Yarn**  
- **MySQL 데이터베이스**  
- **Google Cloud 계정** 및 설정된 프로젝트  
- **PM2** (서버 프로세스 관리용)

### 2. 설치

#### **로컬 환경 실행**

1. **레포지토리 클론**
   ```bash
   git clone https://github.com/your-username/ZEROFIT_NodeJS_Server.git
   cd ZEROFIT_NodeJS_Server
2. **의존성 설치**
   ```bash
   npm install
3. **환경 변수 설정**
   ```bash
   PORT=10103
   DB_HOST=your-cloud-sql-host
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   ```
4. **서버 실행**
   ```bash
   npm run prod
   ```
5. **PM2 프로세스 관리**
   ```bash
   npx pm2 start server.js
   ```
## 📡 API 사용법

### **전처리 요청 (Preprocess)**

1. **Endpoint: POST /preprocess**
   설명: 이미지 전처리 요청을 보내 SAM2 모델이 옷 데이터를 생성합니다.
   ```bash
   // Request
   {
    "image_url": "https://example.com/image.jpg"
   }
   ```
   ```bash
   // Response
   {
    "status": "success",
    "preprocessed_image": "https://example.com/preprocessed-image.jpg"
   }
   ```
   
### **가상피팅 요청 (Virtual Try-On)**

1. **Endpoint: POST /virtual-try-on**
   설명: 사용자의 이미지를 가상으로 피팅한 결과를 반환합니다.
   ```bash
   // Request
   {
    "user_image_url": "https://example.com/user.jpg",
    "clothes_image_url": "https://example.com/clothes.jpg"
   }
   ```
   ```bash
   // Response
   {
    "status": "success",
    "virtual_fitted_image": "https://example.com/virtual-fitted.jpg"
   }
   ```

## 🛠️ CI/CD 파이프라인

### **GCP Cloud Build & GitHub Actions**
코드가 GitHub에 푸시되면 Cloud Build가 자동으로 서버를 빌드하고 배포합니다.

## 🧑‍💻 기여 방법

1. **이 레포지토리를 Fork하세요.**
2. **새 브랜치를 생성하세요.**
   ```bash
   git checkout -b feature/새기능
   ```
3. **변경 사항을 커밋하세요.**
   ```bash
   git commit -m "Add 새 기능"
   ```
4. **브랜치를 푸시하세요.**
   ```bash
   git push origin feature/새기능
   ```
5. **Pull Request를 생성하세요.**

## 📄 라이센스
이 프로젝트는 MIT License를 따릅니다.

## 📝 문의
궁금한 사항이 있으면 Issues에 등록하거나 아래 연락처로 문의해 주세요.
 - Email: logicallawbio@gmail.com
 - GitHub: logicallaw
   
