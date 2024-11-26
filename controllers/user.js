const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

// Flask 서버 URL 설정
const flask_url = `http://${process.env.FLASK_HOST}:${process.env.FLASK_PORT}/preprocess`;

// 저장 디렉토리 설정
const save_dir = path.join(__dirname, '../sam/results');
const original_dir = path.join(save_dir, 'image');
const cloth_dir = path.join(save_dir, 'cloth');
const cloth_mask_dir = path.join(save_dir, 'cloth-mask');
const agnostic_dir = path.join(save_dir, 'agnostic-v3.2');
const agnostic_mask_dir = path.join(save_dir, 'agnostic-mask');
const densepose_dir = path.join(save_dir, 'image-densepose');

// 디렉토리 생성 함수
const CreateDirectories = () => {
    fs.ensureDirSync(original_dir);
    fs.ensureDirSync(cloth_dir);
    fs.ensureDirSync(cloth_mask_dir);
    fs.ensureDirSync(agnostic_dir);
    fs.ensureDirSync(agnostic_mask_dir);
    fs.ensureDirSync(densepose_dir);
};

// Flask 서버와 통신하고 응답 처리
exports.send_image_to_flask = async (base64Image, includePoint, excludePoint, base_name) => {
    try {
        // 디렉토리 생성
        CreateDirectories();

        const flask_request_data = {
            image: base64Image,
            // includePoint,
            // excludePoint,
        };

        const response = await axios.post(flask_url, flask_request_data, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            const response_data = response.data;

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
            }
            console.log("Flask preprocessing successful!");
            return response_data; // 성공한 경우 응답 데이터 반환
        } else {
            throw new Error(`Flask server error: ${response.status} ${response.data}`);
        }
    } catch (error) {
        console.error('Error processing image:', error.message);
        throw error; // 호출 함수에 예외 전달
    }
}