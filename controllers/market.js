/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const fs = require('fs');
const path = require('path');
const {User, Clothes} = require('../models');

function ImageToBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }
    const imageBuffer = fs.readFileSync(imagePath);
    return Buffer.from(imageBuffer).toString('base64');
  } catch (error) {
    console.error(`Error processing file at ${imagePath}:`, error.message);
    throw error;
  }
}

exports.register_clothes = async (req, res, next) => {
  try {
    // JWT에서 유저 정보 가져오기
    const user_id = req.user.user_id;  // JWT 디코드된 정보에서 id 사용

    const {clothes_id, post_name, sale_type, price, bank_account} = req.body;
    // 필수 필드 확인 (기존 필드 이름으로 변경)
    if (!user_id || !clothes_id || !post_name || !sale_type || !price ||
        !bank_account) {
      return res.status(400).json({
        error:
            'Missing required fields: clothes_id, post_name, sale_type, price, or bank_account.',
      });
    }

    // 옷 정보 업데이트
    const [updatedClothesCount] = await Clothes.update(
        {
          is_sale: true,
          post_name: post_name,
          sale_type: sale_type,
          price: price,
        },
        {
          where: {clothes_id},  // clothes_id 기준으로 업데이트
        });

    // 업데이트 결과 확인
    if (updatedClothesCount === 0) {
      return res.status(404).json({
        error: 'Clothes not found or no changes made.',
      });
    }

    // 계좌 정보 업데이트
    const [updatedUserCount] =
        await User.update({bank_account: bank_account}, {where: {user_id}});

    // 업데이트 결과 확인
    if (updatedUserCount === 0) {
      return res.status(404).json({
        error: 'User not found or no changes made.',
      });
    }

    // 성공 응답
    return res.status(200).json({
      message:
          'Clothes registered for sale and bank account updated successfully.',
    });
  } catch (error) {
    console.error('[SALES ERROR]', error);
    return res.status(500).json({
      error: 'Sales failed.',
      details: error.message,
    });
  }
};

exports.market_info = async (req, res, next) => {
  try {
    // JWT에서 유저 정보 가져오기
    const user_id = req.user.user_id;  // JWT 디코드된 정보에서 id 사용
    const clothes = await Clothes.findAll({
      where: {
        user_id,
        is_sale: true,
      },
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
        error: 'No clothing information found for the user.',
      });
    }

    // Cloth 디렉토리 경로 설정
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // clothes 배열을 순회하며 이미지 및 데이터를 포함한 새로운 구조 생성
    const clothes_with_images = clothes.map((item) => {
      const image_path = path.join(cloth_dir, `${item.image_name}.jpg`);
      let base64_image = null;

      // 이미지가 존재할 경우 base64 변환
      if (fs.existsSync(image_path)) {
        base64_image = ImageToBase64(image_path);
      } else {
        console.warn(`Image file not found: ${item.image_name}`);
      }

      // 새로운 객체 생성
      return {
        image_name: item.image_name,
        base64_image,  // base64 변환된 이미지 추가
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

    // 최종 결과 반환
    return res.status(200).json({
      clothes: clothes_with_images,  // 이미지와 데이터를 포함한 배열
    });

  } catch (error) {
    console.error('[MARKET INFO ERROR]', error);
    return res.status(500).json({
      error: 'Failed to load market info.',
      details: error.message,
    });
  }
};
exports.purchase_clothes = async (req, res, next) => {
  try {
    // JWT에서 유저 정보 가져오기
    const user_id = req.user.user_id;  // JWT 디코드된 정보에서 user_id 사용
    const {clothes_id} = req.body;     // 요청 바디에서 clothes_id 추출

    // 필수 필드 확인
    if (!user_id || !clothes_id) {
      return res.status(400).json({
        error: 'Missing required fields: userId or clothes_id.',
      });
    }

    // 1. 구매할 옷 정보 확인
    const clothes = await Clothes.findOne({
      where: {clothes_id, is_sale: true, is_sold: false},  // 판매 상태 확인
    });

    // 옷이 존재하지 않거나 이미 판매된 경우
    if (!clothes) {
      return res.status(404).json({
        error: 'Clothes not found, already sold, or not available for sale.',
      });
    }

    // 2. 판매 상태 업데이트 (is_sold = true)
    const [updatedCount] = await Clothes.update(
        {is_sold: true, is_sale: false},  // 판매된 상태로 변경
        {where: {clothes_id}});

    if (updatedCount === 0) {
      return res.status(500).json({
        error: 'Failed to update clothes status.',
      });
    }

    // 3. 구매 성공 응답 반환
    return res.status(200).json({
      message: 'Clothes purchased successfully.',
      purchasedClothes: {
        clothes_id: clothes.clothes_id,
        clothes_name: clothes.clothes_name,
        price: clothes.price,
        sold_to: user_id,
      },
    });
  } catch (error) {
    console.error('[MARKET PURCHASE ERROR]', error);
    return res.status(500).json({
      error: 'Failed to purchase clothes.',
      details: error.message,
    });
  }
};