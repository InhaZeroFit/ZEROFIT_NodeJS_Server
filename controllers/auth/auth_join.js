/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../../models');
const User = db.User;

exports.join = async (req, res, next) => {
  const {email, nick, password, phone_number, name, gender, address, payment} =
      req.body;
  try {
    // Verify required inputs
    if (!name || !email || !password || !address) {
      return res.status(400).json({
        message: '필수적인 입력값이 누락: name or email or password or address'
      });
    }

    // Check duplication by email
    const existed_user = await User.findOne({where: {email}});
    if (existed_user) {
      return res.status(409).json({message: '이메일이 이미 존재합니다!'});
    };
    // Hash the password.
    const hashed_password = await bcrypt.hash(password, 12);

    // Create new user
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

    // Return successful response
    return res.status(200).json({
      message: '회원가입이 정상적으로 성공했습니다!',
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
        {message: '내부 서버 오류', error: error.message});
  }
};