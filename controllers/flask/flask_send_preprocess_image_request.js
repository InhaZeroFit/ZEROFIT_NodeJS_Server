/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

// 1. Import modules
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// 2. Import custom modules
const {CreateDirectories, SavePreprocessImage} = require('../utils/file_utils');

// Set environment variables
dotenv.config();

// 3. Validate for existence of environment variables
if (!process.env.FLASK_SAM_HOST || !process.env.FLASK_SAM_PORT) {
  throw new Error('일부 환경변수가 등록되지 않았습니다.');
}

const flask_sam_url = `http://${process.env.FLASK_SAM_HOST}:${
    process.env.FLASK_SAM_PORT}/preprocess`;

const base_sam_dir = path.join(__dirname, '../../sam/results');
const sam_dirs =
    [path.join(base_sam_dir, 'cloth'), path.join(base_sam_dir, 'image')];

exports.send_preprocess_image_request =
    async (base64Image, input_point, base_name) => {
  try {
    for (const sam_dir of sam_dirs) {
      CreateDirectories(sam_dir);
    }

    if (!base64Image || !input_point || !base_name) {
      return res.status(400).json(
          {message: '요청 body에 일부 필드가 누락되었습니다.'});
    }

    const json_payload = {
      image: base64Image,
      input_point,
    };

    const response = await axios.post(flask_sam_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status == 200) {
      const response_data = response.data;

      // 전처리된 이미지 저장
      SavePreprocessImage(response_data, sam_dirs, base_name);

      // 전처리된 이미지 반환
      return response.data;
    } else {
      throw new Error(`SAM2 Flask 서버 요청이 실패하였습니다.`);
    }
  } catch (error) {
    throw error;
  }
};