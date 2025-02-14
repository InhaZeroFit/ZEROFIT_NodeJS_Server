# 👚 ZEROFIT_NODEJS_SERVER
<div align="center">
  <img src="public/app_image.png" alt="zerofit-introduce-image">
</div>

This project serves as the backend for providing advanced wardrobe management and virtual fitting solutions powered by **Google Cloud Platform (GCP)** and cutting-edge **AI models (SAM2, KOLORS)**.

Users can seamlessly organize their wardrobe, engage in buying and selling clothing items through a dedicated marketplace, and experience virtual fitting with personalized style recommendations generated by AI.

## 👥 ZeroFit contributors

| Name           | Roles                             |
|----------------|---------------------------------- |
| Jo Mal-Geum    | Team Leader / Planning and Design |
| Lim Sun-Jong   | AI                                |
| Kwon Tae-Eun   | Frontend                          |
| Kim Kyung-Mo   | Frontend                          |
| Kim Jun-Ho     | Backend                           |

## 📺 Demo Video
Experience the functionality of this project by watching the demo video:  
[Watch the Demo](https://youtu.be/WEHREAqCjkY)

## 🚀 Start

### 1. Requirement

This project was carried out in the following environment.

- **Node.js v23.1.0**  
- **npm v10.9.0**  
- **MySQL v8.0**  
- **UTF-8 (includes some Korean content)**  
- **Google Cloud Platform (GCP) account**  

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
---

## 📡 How to Use API
This project provides a comprehensive API for seamless integration.
For detailed instructions and examples, please refer to the [API Usage Guide](docs/API_USAGE.md).

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

## 🗂️ Project architecture

![project-architecture-image](public/architecture.png)  

1. **Client request**  
   - When a user sends a request, it is routed to the Express.js server through the GCP Load Balancer.
2. **GCP Express.js server**  
   - The Express.js server handles CRUD operations by communicating with MySQL Cloud SQL.  
   - Image processing requests are forwarded to the GPU-powered Flask server.

3. **Inha University Artificial Intelligence Convergence Research Center Flask server**  
   - The Flask preprocessing server utilizes the SAM2 model to generate preprocessed garment data.  
   - The Flask virtual fitting server processes API requests from the Express.js server and interacts with the KlingAI server to generate the final virtual try-on image. This image is then sent back to the GCP Node.js server for storage and management and ultimately delivered to the Flutter application.

4. **Note: What is GCP Load Balancer?**  
   - A load balancer distributes incoming client requests across multiple server instances to ensure optimal performance and reliability.  
   - Our current setup is configured to limit each backend instance's utilization to a maximum of 80%.  
   - If the utilization exceeds 80%, GCP's autoscaling feature automatically provisions a new server instance to handle the additional load.

## ⚙️ Tech Stacks

- **Backend**: Node.js, Express.js, Flask
- **Database**: Cloud SQL (MySQL)  
- **Cloud Provider**: Google Cloud Platform (GCP)  
  - GCP VM Instances (with Auto-scaling)  
  - GCP Cloud Load Balancer  
  - GCP Cloud Build (for CI/CD)
- **AI Models**: SAM2, KOLORS  
- **GPU Server**: NVIDIA A40 (Inha University AI Convergence Research Center)  
- **Code Formatting**: Clang-format  
- **Style Guide**: Google C++ Style Guide (adapted where applicable) 

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
This project is licensed under the MIT License. For more details, please refer to the [LICENSE](LICENSE.txt) file.


## 📝 Questions or Support
If you have any questions or need support, feel free to open an issue on GitHub or reach out via the following contact methods:
 - Email: logicallawbio@gmail.com
 - GitHub: logicallaw