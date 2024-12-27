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
const {CreateDirectories, SaveVirtualFittingImage} =
    require('../utils/file_utils');

// Set environment variables
dotenv.config();

// 3. Validate for existence of environment variables
if (!process.env.FLASK_KOLORS_HOST || !process.env.FLASK_KOLORS_PORT) {
  throw new Error('일부 환경변수가 등록되지 않았습니다.');
}

const flask_kolors_url = `http://${process.env.FLASK_KOLORS_HOST}:${
    process.env.FLASK_KOLORS_PORT}/kolors`;

const base_kolors_dir = path.join(__dirname, '../../kolors');
const kolors_dirs = path.join(base_kolors_dir, 'results');

exports.send_virtual_fitting = async (json_payload, user_id) => {
  try {
    CreateDirectories(kolors_dirs);

    const response = await axios.post(flask_kolors_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status == 200) {
      const response_data = response.data;
      if ('result' in response_data) {
        // 가상 피팅된 이미지의 파일명 정의
        const base_name = `${Date.now()}-${user_id}`;

        // 가상 피팅된 이미지 저장
        SaveVirtualFittingImage(response_data.result, kolors_dirs, base_name);

        // 가상 피팅된 이미지 반환
        return response_data;
      } else {
        throw new Error('응답 데이터에 result가 존재하지 않습니다.');
      }
    } else {
      throw new Error(`KOLORS Flask 서버 요청이 실패하였습니다.`);
    }
  } catch (error) {
    throw error;
  }
};