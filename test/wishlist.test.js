/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {Wishlist} = require('../models');
const {add} = require('../controllers/wishlist.js');

jest.mock(
    '../models', () => ({Wishlist: {findOne: jest.fn(), create: jest.fn()}}))

describe('Wishlist API Tests', () => {
  describe('POST /wishlist/add', () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockResponse = {status: jest.fn().mockReturnThis(), json: jest.fn()};

      mockNext = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('정상적인 위시리스트 추가', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Wishlist.findOne.mockResolvedValue(null);
      Wishlist.create.mockResolvedValue({
        id: 1,
        user_id: 1,
        clothes_id: 1,
        createdAt: '2024-12-28',
        updatedAt: '2024-12-28'
      });

      await add(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '위시리스트 등록이 완료되었습니다.'
      });
    });

    it('요청 body에 일부 필드 누락', async () => {
      mockRequest = {user: {user_id: 1}, body: {}};

      await add(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '요청 body에 일부 필드가 누락되었습니다.'
      })
    });

    it('이미 등록된 위시리스트 존재', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Wishlist.findOne.mockResolvedValue(1);

      await add(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '위시리스트 등록에 실패하였습니다.',
        error: '이미 위시리스트에 등록되었습니다.'
      });
    });

    it('위시리스트 등록 실패', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Wishlist.findOne.mockResolvedValue(null);
      Wishlist.create.mockResolvedValue(null);

      await add(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '위시리스트 등록에 실패하였습니다.',
        error: '데이터베이스에 위시리스트 CRUD중 오류가 발생하였습니다.',
      });
    });

    it('예외 발생으로 인한 500 반환', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Wishlist.findOne.mockRejectedValue(
          new Error('예외 발생으로 인한 500 반환'));

      await add(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '위시리스트 등록에 실패하였습니다.',
        error: '예외 발생으로 인한 500 반환'
      });
    });
  });
});