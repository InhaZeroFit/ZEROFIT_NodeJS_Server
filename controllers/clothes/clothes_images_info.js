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
const {Clothes} = require('../../models');
const {ImageToBase64} = require('../utils/file_utils');

exports.images_info = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 데이터베이스에서 user_id와 매칭되는 옷 정보들을 불러옵니다.
    const clothes = await Clothes.findAll({
      where: {user_id},
      // 필수 컬럼만 불러오기
      attributes: [
        'image_name', 'clothes_name', 'rating', 'clothes_type', 'clothes_style',
        'memo', 'clothes_id'
      ],
    });

    // 유효성 체크
    if (!clothes || clothes.length === 0) {
      return res.status(404).json({
        message: 'user_id에 매칭되는 옷 정보가 존재하지 않습니다.',
      });
    }

    // '~/sam/results/cloth' 디렉터리를 불러옵니다.
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // clothes_with_images 배열을 생성합니다.
    const clothes_with_images = clothes.map((item) => {
      const image_path = path.join(cloth_dir, `${item.image_name}.jpg`);
      let base64_image = null;

      // 전처리된 옷 이미지가 존재한다면 base64로 인코딩합니다.
      if (fs.existsSync(image_path)) {
        base64_image = ImageToBase64(image_path);
      }

      // 배열의 원소로 옷 이미지 객체를 저장합니다.
      return {
        image_name: item.image_name,
        base64_image,
        clothes_name: item.clothes_name,
        rating: item.rating,
        clothes_type: item.clothes_type,
        clothes_style: item.clothes_style,
        memo: item.memo,
        clothes_id: item.clothes_id
      };
    });

    // 데이터베이스에서 상반신 이미지 정보를 불러옵니다.
    const user = await User.findOne({
      where: {user_id},
      attributes: ['person_image'],
    });

    // 유효성 체크
    if (!user) {
      return res.status(404).json({message: 'User not found.'});
    }

    const person_image = user.person_image;
    /*
     * 이후에 person_base64_image가 null로 유지된다면
     * 데이터베이스에 상반신 이미지가 등록되지 않은 상태를 의미
     */
    let person_base64_image = null;

    // 데이터베이스에 상반신 이미지가 등록되어 있다면
    if (person_image && person_image != 'no_person_image') {
      const person_image_path =
          path.join(__dirname, `../sam/results/image/${person_image}.jpg`);

      // 서버에 상반신 이미지가 실제로 존재한다면 base64로 인코딩
      if (fs.existsSync(person_image_path)) {
        person_base64_image = ImageToBase64(person_image_path);
      }
    }

    // Flutter로 응답 결과 반환
    return res.status(200).json({
      message: '나의 옷장을 성공적으로 불러왔습니다.',
      clothes: clothes_with_images,
      person_base64_image: person_base64_image,
    });

  } catch (error) {
    return res.status(500).json({
      message: '나의 옷장을 불러오지 못 하였습니다.',
      error: error.message,
    });
  }
};