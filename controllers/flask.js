const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const {User} = require('../models');
dotenv.config();

// 환경 변수 검증
if (!process.env.FLASK_SAM_HOST || !process.env.FLASK_SAM_PORT) {
  throw new Error('FLASK_SAM_HOST or FLASK_SAM_PORT is missing in .env file.');
}
if (!process.env.FLASK_VITON_HOST || !process.env.FLASK_VITON_PORT) {
  throw new Error(
      'FLASK_VITON_HOST or FLASK_VITON_PORT is missing in .env file.');
}

// Flask 서버 URL 설정
const flask_sam_url = `http://${process.env.FLASK_SAM_HOST}:${
    process.env.FLASK_SAM_PORT}/preprocess`;
const flask_viton_url = `http://${process.env.FLASK_VITON_HOST}:${
    process.env.FLASK_VITON_PORT}/ootd`;

// 저장 디렉토리 설정
const save_dir = path.join(__dirname, '../sam/results');
const directories = {
  cloth_dir: path.join(save_dir, 'cloth'),
};

// 디렉토리 생성 함수
function CreateDirectories() {
  try {
    Object.values(directories).forEach((dir) => {
      fs.ensureDirSync(dir);
    });
    console.log('All directories created successfully!');
  } catch (error) {
    console.error(`Error creating directories: ${error.message}`);
    throw error;  // 필요시 예외 전달
  }
}

// 응답 데이터를 저장하는 함수
function SaveResponseData(response_data, directories, base_name) {
  for (const [key, base64_data] of Object.entries(response_data)) {
    try {
      const img_buffer = Buffer.from(base64_data, 'base64');
      let save_path;

      switch (key) {
        case 'cloth':
          save_path = path.join(directories.cloth_dir, `${base_name}.jpg`);
          break;
        default:
          console.log(`Unknown key: ${key}, skipping...`);
          continue;
      }
      fs.writeFileSync(save_path, img_buffer);
    } catch (error) {
      console.error(
          `Failed to save file for key: ${key}. Error: ${error.message}`);
    }
  }
}

// Flask 서버와 통신하고 응답 처리
exports.send_preprocess_image_request =
    async (base64Image, input_point, base_name) => {
  try {
    CreateDirectories();

    if (!base64Image || !input_point || !base_name) {
      return res.status(400).json({
        error:
            'Missing required fields: base64Image or input_point or user_id.',
      });
    }

    const json_payload = {
      image: base64Image,
      input_point,
    };

    const response = await axios.post(flask_sam_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status === 200) {
      const response_data = response.data;

      // 응답 데이터 저장
      SaveResponseData(response_data, directories, base_name);

      console.log('Flask preprocessing successful!');
      return response.data;  // 성공한 경우 응답 데이터 반환
    } else {
      throw new Error(
          `Flask server error: ${response.status} ${response.data}`);
    }
  } catch (error) {
    console.error('Error processing image:', error.message);
    throw error;  // 호출 함수에 예외 전달
  }
};

// `send_virtual_fitting` 함수
exports.send_virtual_fitting = async (json_payload, user_id) => {
  try {
    // Flask 서버로 요청 전송
    const response = await axios.post(flask_viton_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status === 200) {
      const response_data = response.data;

      // 'result' 키가 있는지 확인
      if ('result' in response_data) {
        const base64_result = response_data.result;

        // Base64 디코딩
        const image_buffer = Buffer.from(base64_result, 'base64');

        // 가상 피팅 이미지 결과 저장 경로 설정
        const save_dir = path.join(__dirname, '../viton/results');
        const output_name = `${Date.now()}-${user_id}`;
        const output_path = path.join(save_dir, `${output_name}.jpg`);

        // 저장 디렉터리 존재 여부 검증
        if (!fs.existsSync(save_dir)) {
          fs.mkdirSync(save_dir, {recursive: true});
        }
        // 결과 이미지 저장
        fs.writeFileSync(output_path, image_buffer);
        console.log(`Saved virtual fitting result to ${output_path}`);

        return response_data;  // 성공한 경우 응답 데이터 반환
      } else {
        throw new Error('Error: \'result\' key not found in the response.');
      }
    } else {
      throw new Error(
          `VITON server error: ${response.status} ${response.data}`);
    }
  } catch (error) {
    console.error('Error during virtual fitting:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;  // 호출 함수에 예외 전달
  }
};