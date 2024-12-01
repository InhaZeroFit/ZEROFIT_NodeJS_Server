const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

  const token = authHeader.split(' ')[1];  // Bearer 이후의 토큰 추출

  try {
    // JWT 검증
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰에서 유저 정보와 요청 본문의 email이 일치하는지 확인
    if (decoded_token.user_id !== req.body.userId) {
      return res.status(403).json({message: 'Forbidden: user_id mismatch'});
    }

    // 디코딩된 정보(req.user)에 저장
    req.user = {
      'user_id': decoded_token.user_id,
    };

    next();  // 다음 미들웨어로 진행
  } catch (error) {
    console.error('[JWT VERIFY ERROR]', error);
    return res.status(401).json({message: 'Unauthorized: Invalid token'});
  }
};

module.exports = jwtMiddleware;