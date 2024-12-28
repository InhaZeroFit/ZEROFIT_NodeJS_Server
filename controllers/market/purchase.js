/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

// 1. Import custom modules
const {Clothes} = require('../../models');

exports.purchase = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 요청 body로부터 필드 가져오기
    const {clothes_id} = req.body;

    // 입력 필드 유효성 체크
    if (!user_id || !clothes_id) {
      return res.status(400).json({
        message: '옷 구매를 실패하였습니다.',
        error: '요청 body에 일부 필드가 누락되었습니다.',
      });
    }

    // 구매를 위한 옷 정보 불러오기
    const clothes = await Clothes.findOne(
        {where: {clothes_id, is_sale: true, is_sold: false}});

    if (!clothes) {
      return res.status(404).json({
        message: '옷 구매를 실패하였습니다.',
        error: '옷이 존재하지 않거나 이미 판매가 된 옷입니다.',
      });
    }

    // 데이터베이스에 옷 판매 상태를 업데이트
    const [updatedCount] = await Clothes.update(
        {is_sold: true, is_sale: false, sold_to: user_id},
        {where: {clothes_id}});

    if (updatedCount === 0) {
      return res.status(500).json({
        message: '옷 구매를 실패하였습니다.',
        error: '옷 판매 상태 업데이트를 실패하였습니다.',
      });
    }

    // Flutter로 응답 결과 반환
    return res.status(200).json({
      message: '옷 구매를 성공하였습니다.',
      purchasedClothes: {
        clothes_id: clothes.clothes_id,
        clothes_name: clothes.clothes_name,
        price: clothes.price,
        sold_to: user_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: '옷 구매를 실패하였습니다.',
      error: error.message,
    });
  }
};