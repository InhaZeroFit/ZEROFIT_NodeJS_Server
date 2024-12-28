/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {Wishlist} = require('../../models');

exports.add = async (req, res) => {
  try {
    // 디코드된 JWT 토근으로부터 user_id 가져오기
    const user_id = req.user.user_id;

    // 요청 body로부터 필드 가져오기
    const {clothes_id} = req.body;

    // 입력 필드 유효성 체크
    if (!clothes_id) {
      return res.status(400).json(
          {message: '요청 body에 일부 필드가 누락되었습니다.'});
    }

    // 데이터베이스에 이미 등록된 위시리스트 있는지 검사
    const existed_item = await Wishlist.findOne({
      where: {user_id, clothes_id},
    });

    if (existed_item) {
      return res.status(400).json({
        message: '위시리스트 등록에 실패하였습니다.',
        error: '이미 위시리스트에 등록되었습니다.'
      });
    }

    // 데이터베이스에 위시리스트 등록
    const add_wishlist = await Wishlist.create({user_id, clothes_id});

    // 유효성 체크
    if (!add_wishlist || add_wishlist.length == 0) {
      return res.status(404).json({
        message: '위시리스트 등록에 실패하였습니다.',
        error: '데이터베이스에 위시리스트 CRUD중 오류가 발생하였습니다.',
      })
    }

    return res.status(200).json({message: '위시리스트 등록이 완료되었습니다.'});
  } catch (error) {
    return res.status(500).json(
        {message: '위시리스트 등록에 실패하였습니다.', error: error.message});
  }
};