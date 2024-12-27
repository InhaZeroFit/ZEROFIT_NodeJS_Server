/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

// 1. Import custom modules
const {Clothes} = require('../../models');
const {send_preprocess_image_request} = require('../flask.js');

exports.upload_image = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 요청 body로부터 필드 가져오기
    const {
      base64Image,
      clothingName,
      rating,
      clothingType,
      clothingStyle,
      imageMemo,
      includePoint,
      excludePoint
    } = req.body;

    // 입력 필드 유효성 체크
    if (!base64Image || !clothingName || !rating || !clothingType ||
        !clothingStyle || !includePoint || !excludePoint) {
      return res.status(400).json(
          {message: '요청 body에 일부 필드가 누락되었습니다.'});
    }

    // Flask 서버로 전송을 위한 input_point 배열 정의
    const input_point = [
      [includePoint['x'], includePoint['y']],
      [excludePoint['x'], excludePoint['y']]
    ];

    // 업로드된 이미지의 파일명 정의
    const base_name = `${Date.now()}-${user_id}`;

    // SAM2 Flask 서버로 이미지 전처리 요청
    const response_data = await send_preprocess_image_request(
        base64Image, input_point, base_name);

    // 응답 데이터 유효성 체크
    if (!response_data) {
      throw new Error('Flask 서버 응답 데이터가 존재하지 않습니다.');
    }

    // 데이터베이스에 옷 등록 진행
    try {
      await Clothes.create({
        image_name: `${base_name}`,
        clothes_name: clothingName,
        rating: rating,
        clothes_type: clothingType,
        clothes_style: clothingStyle,
        memo: imageMemo,
        include_point: includePoint,
        exclude_point: excludePoint,
        user_id,
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(500).json(
            {message: 'Sequelize 유효성 에러.', error: error.message});
      }
      throw error;
    }

    // Flutter로 응답 결과 반환
    return res.status(200).json({
      message: '이미지 전처리 및 옷 등록 성공적으로 되었습니다.',
      response: response_data,
      base_name: base_name
    });
  } catch (error) {
    return res.status(500).json({
      message: '이미지 전처리 및 옷 등록에 실패하였습니다.',
      error: error.message,
    });
  }
};