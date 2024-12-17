/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: 'Unauthorized: No token provided'});
  }

  const token = authHeader.split(' ')[1];  // Token extraction after Bearer
  try {
    // JWT Verification
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    // Verify that the token matches the user information with the email in the
    // body of the request
    if (decoded_token.user_id !== req.body.userId) {
      return res.status(403).json({message: 'Forbidden: user_id mismatch'});
    }

    // Save to decoded information (req.user)
    req.user = {
      'user_id': decoded_token.user_id,
    };

    next();  // Proceed to the next middleware
  } catch (error) {
    console.error('[JWT VERIFY ERROR]', error);
    return res.status(401).json({message: 'Unauthorized: Invalid token'});
  }
};

module.exports = jwtMiddleware;