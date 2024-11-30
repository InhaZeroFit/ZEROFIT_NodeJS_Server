const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

// Flask 서버 URL 설정
const flask_sam_url = `http://${process.env.FLASK_SAM_HOST}:${process.env.FLASK_SAM_PORT}/preprocess`;
const flask_viton_url = `http://${process.env.FLASK_VITON_HOST}:${process.env.FLASK_VITON_PORT}/ootd`;

// 저장 디렉토리 설정
const save_dir = path.join(__dirname, '../sam/results');
const original_dir = path.join(save_dir, 'image');
const cloth_dir = path.join(save_dir, 'cloth');
const cloth_mask_dir = path.join(save_dir, 'cloth-mask');
const agnostic_dir = path.join(save_dir, 'agnostic-v3.2');
const agnostic_mask_dir = path.join(save_dir, 'agnostic-mask');
const densepose_dir = path.join(save_dir, 'image-densepose');

// Flask 서버와 통신하고 응답 처리
exports.send_preprocess_image_request = async (base64Image, includePoint, excludePoint, base_name) => {
    try {
        if (!base64Image || !includePoint || !excludePoint || !base_name) {
            return res.status(400).json({
                error: "Missing required fields: base64Image, includePoint, excludePoint, base_name.",
            });
        }

        const input_point = [[includePoint['x'], includePoint['y']], [excludePoint['x'], excludePoint['y']]];

        const json_payload = {
            image: base64Image,
            input_point,
        };

        const response = await axios.post(flask_sam_url, json_payload, {
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

// `send_virtual_fitting` 함수
exports.send_virtual_fitting = async (json_payload, output_path) => {
    try {
        // Flask 서버로 요청 전송
        const response = await axios.post(flask_viton_url, json_payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
            const response_data = response.data;

            // 'result' 키가 있는지 확인
            if ("result" in response_data) {
                const base64_result = response_data.result;

                // Base64 디코딩
                const image_buffer = Buffer.from(base64_result, 'base64');

                // 결과 이미지 저장
                fs.writeFileSync(output_path, image_buffer);

                console.log(`Saved virtual fitting result to ${output_path}`);
                return response_data; // 성공한 경우 응답 데이터 반환
            } else {
                throw new Error("Error: 'result' key not found in the response.");
            }
        } else {
            throw new Error(`VITON server error: ${response.status} ${response.data}`);
        }
    } catch (error) {
        console.error('Error during virtual fitting:', error.message);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
        throw error; // 호출 함수에 예외 전달
    }
};