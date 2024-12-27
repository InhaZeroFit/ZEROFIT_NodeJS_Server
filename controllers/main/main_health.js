/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

exports.health = async (req, res, next) => {
  try {
    res.status(200).json({message: 'health check에 성공하였습니다.'});
  } catch (error) {
    return res.status(500).json(
        {message: 'health check에 실패하였습니다.', error: error.message});
  }
};