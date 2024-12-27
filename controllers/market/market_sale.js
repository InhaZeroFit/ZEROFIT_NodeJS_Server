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
const {User, Clothes} = require('../../models');

exports.sale = async (req, res, next) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 요청 body로부터 필드 가져오기
    const {clothes_id, post_name, sale_type, price, bank_account} = req.body;

    // 입력 필드 유효성 체크
    if (!user_id || !clothes_id || !post_name || !sale_type || !price ||
        !bank_account) {
      return res.status(400).json({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '요청 body에 일부 필드가 누락되었습니다.',
      });
    }

    // 데이터베이스에 옷 정보를 업데이트
    const [updatedClothesCount] = await Clothes.update(
        {
          is_sale: true,
          post_name: post_name,
          sale_type: sale_type,
          price: price,
        },
        {
          where: {clothes_id},
        });

    // 유효성 체크
    if (updatedClothesCount === 0) {
      return res.status(404).json({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '데이터베이스에 옷이 존재하지 않거나 업데이트 할 수 없습니다.',
      });
    }

    // 데이터베이스에 유저의 계좌정보를 업데이트
    const [updatedUserCount] =
        await User.update({bank_account: bank_account}, {where: {user_id}});

    // 유효성 체크
    if (updatedUserCount === 0) {
      return res.status(404).json({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '데이터베이스에 유저를 찾을 수 없거나 업데이트 할 수 없습니다.',
      });
    }

    // Flutter로 응답 결과 반환
    return res.status(200).json(
        {message: '의류장터에 옷 등록을 성공하였습니다.'});
  } catch (error) {
    return res.status(500).json({
      message: '의류장터에 옷 등록을 실패하였습니다.',
      error: error.message,
    });
  }
};