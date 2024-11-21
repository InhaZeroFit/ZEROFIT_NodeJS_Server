const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

// Flask 서버 URL 설정
const flaskUrl = `http://${process.env.FLASK_HOST}:${process.env.FLASK_PORT}/preprocess`;

// 이미지 파일 경로
const imagePath = path.join(__dirname, '../public/a.jpeg');

// 저장 디렉토리 설정
const saveDir = path.join(__dirname, '../sam/results');
const originalDir = path.join(saveDir, 'image');
const clothDir = path.join(saveDir, 'cloth');
const clothMaskDir = path.join(saveDir, 'cloth-mask');
const agnosticDir = path.join(saveDir, 'agnostic-v3.2');
const agnosticMaskDir = path.join(saveDir, 'agnostic-mask');
const denseposeDir = path.join(saveDir, 'image-densepose');

// 디렉토리 생성
const createDirectories = () => {
    fs.ensureDirSync(originalDir);
    fs.ensureDirSync(clothDir);
    fs.ensureDirSync(clothMaskDir);
    fs.ensureDirSync(agnosticDir);
    fs.ensureDirSync(agnosticMaskDir);
    fs.ensureDirSync(denseposeDir);
};

// Base64로 이미지를 인코딩하는 함수
const encodeImageToBase64 = (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath); // 파일 읽기
        return fileBuffer.toString('base64'); // Base64 인코딩
    } catch (error) {
        throw new Error(`Failed to read image file: ${error.message}`);
    }
};

// Flask 서버와 통신하고 응답 처리
module.exports.sendImageToFlask = async (req, res) => {
    try {
        // 디렉토리 생성
        createDirectories();

        // 이미지 Base64 인코딩
        const base64Image = encodeImageToBase64(imagePath);

        // Flask 서버로 요청 전송
        const response = await axios.post(flaskUrl, { image: base64Image }, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            const responseData = response.data;
            const baseName = path.basename(imagePath, path.extname(imagePath));

            // 응답 데이터 저장
            for (const [key, base64Data] of Object.entries(responseData)) {
                const imgBuffer = Buffer.from(base64Data, 'base64');
                let savePath;

                switch (key) {
                    case 'image':
                        savePath = path.join(originalDir, `${baseName}.jpg`);
                        break;
                    case 'cloth':
                        savePath = path.join(clothDir, `${baseName}.jpg`);
                        break;
                    case 'cloth_mask':
                        savePath = path.join(clothMaskDir, `${baseName}.jpg`);
                        break;
                    case 'agnostic':
                        savePath = path.join(agnosticDir, `${baseName}.jpg`);
                        break;
                    case 'agnostic_mask':
                        savePath = path.join(agnosticMaskDir, `${baseName}_mask.png`);
                        break;
                    case 'densepose':
                        savePath = path.join(denseposeDir, `${baseName}.jpg`);
                        break;
                    default:
                        console.log(`Unknown key: ${key}, skipping...`);
                        continue;
                }

                // 이미지 저장
                fs.writeFileSync(savePath, imgBuffer);
                console.log(`Saved: ${savePath}`);
            }

            return res.status(200).json({ message: 'Image processed and saved successfully' });
        } else {
            console.error('Flask server error:', response.status, response.data);
            return res.status(response.status).json(response.data);
        }
    } catch (error) {
        console.error('Error processing image:', error.message);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}