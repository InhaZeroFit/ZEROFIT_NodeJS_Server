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
const fs = require('fs');
const path = require('path');

// 2. Import custom modules
const {User} = require('../../models');
const {ImageToBase64} = require('../utils/file_utils');
const {send_virtual_fitting} = require('../flask');

exports.virtual_fitting = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 요청 body로부터 필드 가져오기
    const {cloth_image_name, person_base64_image} = req.body;

    // 입력 필드 유효성 체크
    if (!cloth_image_name) {
      return res.status(400).json({
        message: '요청 body에 일부 필드가 누락되었습니다.',
      });
    }

    // '~/sam/results' 디렉터리를 불러옵니다.
    const load_dir = path.join(__dirname, '../sam/results');
    let person_image_path;

    /*
     * 처음 상반신 이미지를 등록하거나 새로운 상반신 이미지 등록 요청이
     * 들어온다면, 가상 피팅 전 데이터베이스에 상반신 이미지 등록 진행
     */
    if (person_base64_image) {
      // 상반신 이미지 디코딩
      const image_buffer = Buffer.from(person_base64_image, 'base64');

      // 상반신 이미지 저장할 디렉터리 정의
      const save_dir = path.join(__dirname, '../sam/results/image');
      const output_name = `user-${user_id}`;
      const output_path = path.join(save_dir, `${output_name}.jpg`);

      // '~/sam/results/image' 디렉터리 유효성 체크
      if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir, {recursive: true});
      }

      // 상반신 이미지 저장
      fs.writeFileSync(output_path, image_buffer);

      // 데이터베이스에 상반신 이미지 파일명 업데이트
      await User.update({person_image: output_name}, {where: {user_id}});
    } else {
      // 데이터베이스에 저장된 상반신 이미지 사용
      const user = await User.findOne({
        where: {user_id},
        attributes: ['person_image'],
      });

      // 유효성 체크
      if (!user || !user.person_image) {
        return res.status(404).json({
          error:
              '유저가 존재하지 않거나 기본 상반신 이미지가 존재하지 않습니다.',
        });
      }

      // 이미 서버에 저장된 상반신 이미지 파일 경로 불러오기
      person_image_path = path.join(load_dir, `image/${user.person_image}.jpg`);
    }

    // 전처리된 옷 이미지 경로 불러오기
    const cloth_image_path =
        path.join(load_dir, `cloth/${cloth_image_name}.jpg`);

    /*
     * 상반신 이미지와 전처리된 옷 이미지를 모두 base64로 인코딩하여
     * Flask 서버 전송을 위한 전처리 진행
     */
    const base64_image_person = (person_base64_image) ?
        person_base64_image :
        ImageToBase64(person_image_path);
    const base64_image_cloth = ImageToBase64(cloth_image_path);

    // 마지막으로 Flask 서버 요청 전 유효성 체크
    if (!base64_image_person || !base64_image_cloth) {
      return res.status(500).json({
        message: 'Flask 서버 요청 전 유효성 체크에 오류가 발생하였습니다.',
      });
    }

    // json_payload 정의
    const json_payload = {
      person: base64_image_person,
      cloth: base64_image_cloth,
    };

    // KOLORS Flask 서버로 가상 피팅 요청
    const response_data = await send_virtual_fitting(json_payload, user_id);

    // 응답 데이터 유효성 체크
    if (!response_data) {
      throw new Error('Flask 서버 응답 데이터가 존재하지 않습니다.');
    }

    // 가상 피팅 된 base64 이미지 불러오기
    const base64_image = response_data.result;

    // 별도의 데이터베이스 등록 없이 Flutter로 가상 피팅된 이미지 반환
    return res.status(200).json({
      message: '가상 피팅이 성공적으로 되었습니다.',
      base64_image,
    });
  } catch (error) {
    return res.status(500).json({
      message: '가상 피팅이 실패하였습니다.',
      error: error.message,
    });
  }
};