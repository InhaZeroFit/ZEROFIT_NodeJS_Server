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
const fs = require('fs-extra');
const path = require('path');
const {Sequelize} = require('sequelize');

// 2. Import custom modules
const {Clothes} = require('../../models');
const {ImageToBase64} = require('../utils/file_utils');

exports.info = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 데이터베이스에서 아래 조건에 해당하는 모든 옷 정보를 불러옵니다.
    const clothes = await Clothes.findAll({
      where: Sequelize.literal(`user_id != ${user_id} AND is_sale = true`),
      attributes: [
        'image_name',
        'clothes_name',
        'rating',
        'clothes_type',
        'clothes_style',
        'memo',
        'size',
        'price',
        'post_name',
        'sale_type',
        'clothes_id',
      ],
    });

    if (!clothes || clothes.length === 0) {
      return res.status(404).json({
        message: '의류장터를 불러오는데 실패하였습니다.',
        error: '해당 유저에 대한 옷 정보를 찾을 수 없습니다.',
      });
    }

    // Set the Cloth directory path
    const cloth_dir = path.join(__dirname, '../../sam/results/cloth');

    const clothes_with_images = clothes.map((item) => {
      const image_path = path.join(cloth_dir, `${item.image_name}.jpg`);
      let base64_image = null;

      // 옷의 이미지가 존재하면, base64로 인코딩
      if (fs.existsSync(image_path)) {
        base64_image = ImageToBase64(image_path);
      }

      return {
        image_name: item.image_name,
        base64_image,
        clothes_name: item.clothes_name,
        rating: item.rating,
        clothes_type: item.clothes_type,
        clothes_style: item.clothes_style,
        memo: item.memo,
        size: item.size,
        price: item.price,
        post_name: item.post_name,
        sale_type: item.sale_type,
        clothes_id: item.clothes_id,
      };
    });

    // Flutter로 응답 결과 반환
    return res.status(200).json({
      message: '의류장터를 성공적으로 불러왔습니다.',
      clothes: clothes_with_images,
    });

  } catch (error) {
    return res.status(500).json({
      message: '의류장터를 불러오는데 실패하였습니다.',
      error: error.message,
    });
  }
};