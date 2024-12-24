/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

exports.logout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json(
          {message: '로그아웃 오류:', error: error.message});
    }
    req.session.destory
    return res.status(200).json({message: '로그아웃 성공!'})
  })
};