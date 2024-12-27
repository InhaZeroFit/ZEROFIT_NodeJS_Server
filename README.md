# 👚 ZEROFIT_NODEJS_SERVER
![zerofit-introduce-image](public/app_image.png)  

This project is a server that utilizes **Google Cloud Platform (GCP)** and **AI Models (SAM2, KOLORS)** to provide your own wardrobe and virtual fitting services.  

Users can manage their clothes through their own wardrobe and sell or purchase clothes at the clothing market.
Users can fit the clothes they want and get recommendations for styling based on AI.

---

## 👥 ZeroFit contributors

| name          | roles                |
|---------------|:---------------------|
| 조맑음        | Team leader / Planning and Design |
| 임선종        | AI       |
| 권태은        | Frontend    |
| 김경모        | Frontend    |
| 김준호        | Backend     |
---

## ⚙️ Tech stacks

- **Backend**: Node.js, Express.js, Flask
- **Database**: Cloud SQL (MySQL)  
- **Cloud Provider**: Google Cloud Platform (GCP)  
  - GCP VM Instances (Auto-scaling)  
  - GCP Cloud Load Balancer  
  - GCP Cloud Build (CI/CD)  
- **AI Models**: SAM2, KOLORS  
- **GPU Server**: NVIDIA A40 (Inha University AI Convergence Research Center)  

---

## 🗂️ Project architecture

![project-architecture-image](public/architecture.png)  

1. **Client request**  
   - When a user sends a request, it is forwarded to the Express.js server through the GCP Load Balancer.
2. **GCP Express.js server**  
   - The Express.js server sends CRUD requests to MySQL Cloud SQL.
   - The image processing request is forwarded to the GPU Flask server.

3. **Inha University Artificial Intelligence Convergence Research Center Flask server**  
   - The Flask preprocessing server generates preprocessed garment data using the SAM2 model.
   - The Flask virtual fitting server sends an api request to the KlingAI server as a request by Express.js and returns the final virtual worn image as a response. The image is sent to the GCP Node.js server for storage and management and returns the image to the Flutter.

※  **What is GCP Load Balancer**  
   - A load balancer is a system that distributes incoming requests from clients across multiple servers (instances).
   - Currently, our servers are set to use no more than 80% of the backend instances.
   - If the backend instance utilization exceeds 80%, the GCP's autoscaling is a new server (instance).

---

## 🚀 Start

### 1. Requirement

This project was carried out in the following environment.

- **Node.js v23.1.0** 
- **npm v10.9.0** 
- **MySQL v8.0** 
- **Google Cloud Platform account** 

### 2. Install

#### **Copy your local environment**

1. **Clone this repository**
   ```bash
   git clone https://github.com/your-username/ZEROFIT_NodeJS_Server.git
   cd ZEROFIT_NodeJS_Server
2. **Install dependancy**
   ```bash
   npm install
3. **Set environmental variables**
   ```bash
   COOKIE_SECRET = your-cookie-secret

   # Connect to GCP MySQL - PROD
   SEQUELIZE_USERNAME = your-db-username
   SEQUELIZE_PASSWORD = your-db-password
   SEQUELIZE_DB_PROD = your-db-name

   SEQUELIZE_HOST = your-cloud-sql-host
   SEQUELIZE_PORT = your-cloud-sql-port

   # Connect to local MySQL - DEV
   SEQUELIZE_DEV_USERNAME = your-db-username
   SEQUELIZE_DEV_PASSWORD = your-db-password
   SEQUELIZE_DEV_DB = your-db-name

   SEQUELIZE_DEV_HOST = your-cloud-sql-host
   SEQUELIZE_DEV_PORT = your-cloud-sql-port

   # Connect to local MySQL - TEST 
   SEQUELIZE_TEST_USERNAME = your-db-username
   SEQUELIZE_TEST_PASSWORD = your-db-password
   SEQUELIZE_TEST_DB = your-db-name

   SEQUELIZE_TEST_HOST =  your-cloud-sql-host
   SEQUELIZE_TEST_PORT = your-cloud-sql-port
   TEST_SERVER_URL = your-cloud-sql-url

   # FLASK SAM
   FLASK_SAM_HOST = your-flask-sam-host
   FLASK_SAM_PORT = your-flask-sam-port

   # FLASK KOLORS
   FLASK_KOLORS_HOST = your-flask-kolors-host
   FLASK_KOLORS_PORT = your-flask-kolors-port

   # JWT SECRET
   JWT_SECRET = your-jwt-secret
   JWT_EXPIRES_IN= your-jwt-expires-in
   ```
4. **Run production environment of Node.js server**
   ```bash
   npm run prod
   ```
5. **Monit Node.js with command below**
   ```bash
   npx pm2 monit
   ```

## 📡 How to use API
You can refer to the following document for API usage.
[API Usage Guide](docs/API_USAGE.md)

## 🛠️ CI/CD pipeline

### **GCP Cloud Build & GitHub Actions**
For GCP Cloud Build, you must follow these steps.

1. **Open cloudbuild.yaml**

2. **'your-*' part needs to be modified**
   ```bash
   steps:
   # 1. Install dependancy
   - name: 'gcr.io/cloud-builders/npm'
       args: ['install']

   # 2. Update your repository using 'git pull'
   - name: 'gcr.io/cloud-builders/gcloud'
      args:
         - 'compute'
         - 'ssh'
         - 'your-vm-instance'
         - '--zone'
         - 'your-vm-instance-timezone'
         - '--command'
         - |
           git config --global --add safe.directory /home/your-github-account/ZEROFIT_NodeJS_Server && \
           cd /home/your-github-account/ZEROFIT_NodeJS_Server && git pull

   # 3. Restart your server using pm2
   - name: 'gcr.io/cloud-builders/gcloud'
      args:
         - 'compute'
         - 'ssh'
         - 'your-vm-instance'
         - '--zone'
         - 'your-vm-instance-timezone'
         - '--command'
         - |
           cd /home/your-github-account/ZEROFIT_NodeJS_Server && \
           npx pm2 reload all

   # logsBucket
   logsBucket: 'gs://your-bucket-name' 
   ```

## 🧑‍💻 How to contribute

1. **Fork this repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature/your-new-feature-name your-remote-name/feature/your-new-feature-name
   ```
3. **Commit your change logs**
   ```bash
   git commit -m "feat: add your-change-logs"
   ```
4. **Push your branch**
   ```bash
   git push your-remote-name feature/your-new-feature-name
   ```
5. **Create a pull request at github**

## 📄 Licesne
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📝 Any questions
If you have any questions, please register with Issues or contact us at the contact information below.
 - Email: logicallawbio@gmail.com
 - GitHub: logicallaw

## 📺 Demo video
https://youtu.be/WEHREAqCjkY