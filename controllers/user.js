const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

// Flask 서버 URL 설정
const flask_url = `http://${process.env.FLASK_HOST}:${process.env.FLASK_PORT}/preprocess`;

// 이미지 파일 경로
const image_path = path.join(__dirname, '../public/a.jpeg');

// 저장 디렉토리 설정
const save_dir = path.join(__dirname, '../sam/results');
const original_dir = path.join(save_dir, 'image');
const cloth_dir = path.join(save_dir, 'cloth');
const cloth_mask_dir = path.join(save_dir, 'cloth-mask');
const agnostic_dir = path.join(save_dir, 'agnostic-v3.2');
const agnostic_mask_dir = path.join(save_dir, 'agnostic-mask');
const densepose_dir = path.join(save_dir, 'image-densepose');

// 디렉토리 생성
const CreateDirectories = () => {
    fs.ensureDirSync(original_dir);
    fs.ensureDirSync(cloth_dir);
    fs.ensureDirSync(cloth_mask_dir);
    fs.ensureDirSync(agnostic_dir);
    fs.ensureDirSync(agnostic_mask_dir);
    fs.ensureDirSync(densepose_dir);
};

// Base64로 이미지를 인코딩하는 함수
const encode_image_to_base64 = (file_path) => {
    try {
        const file_buffer = fs.readFileSync(file_path); // 파일 읽기
        return file_buffer.toString('base64'); // Base64 인코딩
    } catch (error) {
        throw new Error(`Failed to read image file: ${error.message}`);
    }
};

// Flask 서버와 통신하고 응답 처리
exports.send_image_to_flask = async (req, res) => {
    try {
        // 디렉토리 생성
        CreateDirectories();

        // 이미지 Base64 인코딩
        const base64_image = encode_image_to_base64(image_path);

        // Flask 서버로 요청 전송
        const response = await axios.post(flask_url, { image: base64_image }, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            const response_data = response.data;
            const base_name = path.basename(image_path, path.extname(image_path));

            // 응답 데이터 저장
            for (const [key, base64_data] of Object.entries(response_data)) {
                const img_buffer = Buffer.from(base64_data, 'base64');
                let save_path;

                switch (key) {
                    case 'image':
                        save_path = path.join(original_dir, `${base_name}.jpg`);
                        break;
                    case 'cloth':
                        save_path = path.join(cloth_dir, `${base_name}.jpg`);
                        break;
                    case 'cloth_mask':
                        save_path = path.join(cloth_mask_dir, `${base_name}.jpg`);
                        break;
                    case 'agnostic':
                        save_path = path.join(agnostic_dir, `${base_name}.jpg`);
                        break;
                    case 'agnostic_mask':
                        save_path = path.join(agnostic_mask_dir, `${base_name}_mask.png`);
                        break;
                    case 'densepose':
                        save_path = path.join(densepose_dir, `${base_name}.jpg`);
                        break;
                    default:
                        console.log(`Unknown key: ${key}, skipping...`);
                        continue;
                }

                // 이미지 저장
                fs.writeFileSync(save_path, img_buffer);
                console.log(`Saved: ${save_path}`);
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