/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

// 1. Import modules
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

// 2. Import custom modules
const {User} = require('../../models');

exports.join = async (req, res, next) => {
  // 요청 body로부터 필드 가져오기
  const {email, nick, password, phone_number, name, gender, address, payment} =
      req.body;

  try {
    // 입력 필드 유효성 체크
    if (!name || !email || !password || !address) {
      return res.status(400).json(
          {message: '요청 body에 일부 필드가 누락되었습니다.'});
    }

    // 이메일 중복 확인
    const existed_user = await User.findOne({where: {email}});
    if (existed_user) {
      return res.status(409).json({message: '이메일이 이미 존재합니다.'});
    };

    // 비밀번호 암호화
    const hashed_password = await bcrypt.hash(password, 12);

    // 데이터베이스에 유저 정보 등록
    const new_user = await User.create({
      name,
      email,
      password: hashed_password,
      address: address,
      nick: nick || 'no_nick',
      phone_number: phone_number || 'no_phone_number',
      gender: gender || 'Other',
      payment: payment || 'no_payment',
    });

    // Flutter로 응답 결과 반환
    return res.status(200).json({
      message: '회원가입이 정상적으로 성공했습니다.',
      user: {
        id: new_user.user_id,
        name: new_user.name,
        email: new_user.email,
        address: new_user.address
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
        {message: '내부 서버 오류.', error: error.message});
  }
};