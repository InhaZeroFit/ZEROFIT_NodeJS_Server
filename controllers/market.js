const {User, Clothes} = require('../models');

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