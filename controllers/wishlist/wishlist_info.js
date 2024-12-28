/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const fs = require('fs-extra');
const path = require('path');
const {Sequelize} = require('sequelize');

const {Clothes, Wishlist} = require('../../models');
const {ImageToBase64} = require('../utils/file_utils');

exports.info = async (req, res) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 데이터베이스에 유저의 위시리스트 불러오기
    const wishlist = await Wishlist.findAll({
        where: {user_id},
        include: [
          {
            model: Clothes,
            as: 'Clothes', 
            attributes: [
              'clothes_id',
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
            ],where: Sequelize.literal(`is_sale = true`),
          },
        ],
      });

    // 유효성 체크
    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({
        message: '위시리스트 불러오기를 실패하였습니다.',
        error: '위시리스트가 비어있습니다.'
      });
    }

    // '~/sam/results/cloth' 디렉터리를 불러옵니다.
    const cloth_dir = path.join(__dirname, '../../sam/results/cloth');

    const wishlist_clothes_with_images =
        wishlist
            .map((item) => {
              const clothes = item.Clothes;
              if (!clothes) {
                // Clothes 객체가 존재하지 않다면 null를 반환
                return null;
              }

              const image_path =
                  path.join(cloth_dir, `${clothes.image_name}.jpg`);
              let base64_image = null;

              // 이미지 존재 유효성 체크
              if (fs.existsSync(image_path)) {
                base64_image = ImageToBase64(image_path);
              }

              return {
                clothes_id: clothes.clothes_id,
                image_name: clothes.image_name,
                base64_image,
                clothes_name: clothes.clothes_name,
                rating: clothes.rating,
                clothes_type: clothes.clothes_type,
                clothes_style: clothes.clothes_style,
                memo: clothes.memo,
                size: clothes.size,
                price: clothes.price,
                post_name: clothes.post_name,
                sale_type: clothes.sale_type,
              };
            })
            // 유효한 entries 반환을 위한 null 제거
            .filter(Boolean);

    return res.status(200).json({
      message: '위시리스트 불러오기를 성공하였습니다.',
      clothes: wishlist_clothes_with_images
    });
  } catch (error) {
    return res.status(500).json({
      message: '위시리스트 불러오기를 성공하였습니다.',
      error: error.message
    });
  }
};