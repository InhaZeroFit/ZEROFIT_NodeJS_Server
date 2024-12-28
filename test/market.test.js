/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

// 1. Import modules
const fs = require('fs-extra');
const path = require('path');

// 2. Import custom modules
const {sale, purchase, info} = require('../controllers/market');
const {User, Clothes} = require('../models');
const {ImageToBase64} = require('../controllers/utils/file_utils');

// Define mock
jest.mock(
    '../models',
    () => ({
      Clothes: {update: jest.fn(), findOne: jest.fn(), findAll: jest.fn()},
      User: {
        update: jest.fn(),
      },
    }));


jest.mock('fs-extra');
jest.mock('path');
jest.mock('../controllers/utils/file_utils', () => ({
                                               ImageToBase64: jest.fn(),
                                             }));
describe('Market API Tests', () => {
  describe('POST /market/sale', () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('의류장터에 정상적인 판매 등록', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {
          clothes_id: 1,
          post_name: '예쁜 옷',
          sale_type: ['직거래'],
          price: 5000,
          bank_account: '111-222-3333',
        },
      };

      Clothes.update.mockResolvedValue([1]);
      User.update.mockResolvedValue([1]);

      await sale(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터에 옷 등록을 성공하였습니다.',
      });
    });

    it('요청 body에 일부 필드 누락', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {
          post_name: '예쁜 옷',
          sale_type: ['직거래'],
          price: 5000,
          bank_account: '111-222-3333',
        },
      };

      await sale(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '요청 body에 일부 필드가 누락되었습니다.',
      });
    });

    it('옷 정보 업데이트 실패', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {
          clothes_id: 1,
          post_name: '예쁜 옷',
          sale_type: ['직거래'],
          price: 5000,
          bank_account: '111-222-3333',
        },
      };

      Clothes.update.mockResolvedValue([0]);

      await sale(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '데이터베이스에 옷이 존재하지 않거나 업데이트 할 수 없습니다.',
      });
    });

    it('유저 계좌정보 업데이트 실패', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {
          clothes_id: 1,
          post_name: '예쁜 옷',
          sale_type: ['직거래'],
          price: 5000,
          bank_account: '111-222-3333',
        },
      };

      Clothes.update.mockResolvedValue([1]);
      User.update.mockResolvedValue([0]);

      await sale(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '데이터베이스에 유저를 찾을 수 없거나 업데이트 할 수 없습니다.',
      });
    });

    it('예외 발생으로 인한 500 반환', async () => {
      Clothes.update.mockRejectedValue(new Error('데이터베이스 에러'));

      await sale(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터에 옷 등록을 실패하였습니다.',
        error: '데이터베이스 에러'
      });
    });
  });

  describe('POST /market/purchase', () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('의류장터에 정상적인 옷 구매', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {
          clothes_id: 1,
        }
      };

      Clothes.findOne.mockResolvedValue({
        clothes_id: 1,
        clothes_name: '예쁜 옷',
        price: 5000,
      });
      Clothes.update.mockResolvedValue([1]);

      await purchase(mockRequest, mockResponse, mockNext);

      expect(Clothes.findOne).toHaveBeenCalledWith({
        where: {clothes_id: 1, is_sale: true, is_sold: false},
      });
      expect(Clothes.update)
          .toHaveBeenCalledWith(
              {is_sold: true, is_sale: false, sold_to: 1},
              {where: {clothes_id: 1}});

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '옷 구매를 성공하였습니다.',
        purchasedClothes: {
          clothes_id: 1,
          clothes_name: '예쁜 옷',
          price: 5000,
          sold_to: 1,
        },
      });
    });

    it('요청 body에 일부 필드 누락', async () => {
      mockRequest = {user: {user_id: 1}, body: {}};

      await purchase(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '옷 구매를 실패하였습니다.',
        error: '요청 body에 일부 필드가 누락되었습니다.'
      })
    });

    it('구매를 위한 옷 정보 불러오기 실패', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Clothes.findOne.mockResolvedValue(null);

      await purchase(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '옷 구매를 실패하였습니다.',
        error: '옷이 존재하지 않거나 이미 판매가 된 옷입니다.',
      });
    });

    it('옷 판매 상태 업데이트 실패', async () => {
      mockRequest = {user: {user_id: 1}, body: {clothes_id: 1}};

      Clothes.findOne.mockResolvedValue([1]);
      Clothes.update.mockResolvedValue([0]);

      await purchase(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '옷 구매를 실패하였습니다.',
        error: '옷 판매 상태 업데이트를 실패하였습니다.'
      })
    });

    it('예외 발생으로 인한 500 반환', async () => {
      mockRequest = {
        user: {user_id: 1},
        body: {clothes_id: 1},
      };

      Clothes.findOne.mockRejectedValue(new Error('데이터베이스 에러'));

      await purchase(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '옷 구매를 실패하였습니다.',
        error: '데이터베이스 에러',
      });
    });
  });

  describe('POST /market/info', () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('정상적인 의류장터 불러오기', async () => {
      mockRequest = {
        user: {user_id: 1},
      };

      Clothes.findAll.mockResolvedValue([{
        image_name: '1735302466242-1',
        clothes_name: '예쁜 옷',
        rating: 4,
        clothes_type: ['상의', '하의'],
        clothes_style: ['캐주얼', '미니멀'],
        memo: 'no-memo',
        size: ['S'],
        price: 5000,
        post_name: 'S급 급처분 합니다!',
        sale_type: ['직거래', '택배'],
        clothes_id: 1
      }]);
      fs.existsSync.mockReturnValue(true);
      ImageToBase64.mockReturnValue('mockBase64String');

      await info(mockRequest, mockResponse, mockNext);

      expect(Clothes.findAll).toHaveBeenCalledWith({
        where: expect.any(Object),
        attributes: expect.any(Array)
      });
      expect(fs.existsSync)
          .toHaveBeenCalledWith(
              path.join(__dirname, '../sam/results/cloth/1735302466242-1.jpg'));
      expect(ImageToBase64)
          .toHaveBeenCalledWith(
              path.join(__dirname, '../sam/results/cloth/1735302466242-1.jpg'));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터를 성공적으로 불러왔습니다.',
        clothes: [{
          image_name: '1735302466242-1',
          base64_image: 'mockBase64String',
          clothes_name: '예쁜 옷',
          rating: 4,
          clothes_type: ['상의', '하의'],
          clothes_style: ['캐주얼', '미니멀'],
          memo: 'no-memo',
          size: ['S'],
          price: 5000,
          post_name: 'S급 급처분 합니다!',
          sale_type: ['직거래', '택배'],
          clothes_id: 1
        }]
      })
    });

    it('모든 옷 정보 불러오기 실패', async () => {
      mockRequest = {user: {user_id: 1}};

      Clothes.findAll.mockResolvedValue(null);

      await info(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터를 불러오는데 실패하였습니다.',
        error: '해당 유저에 대한 옷 정보를 찾을 수 없습니다.'
      });
    });

    it('예외 발생으로 인한 500 반환', async () => {
      mockRequest = {user: {user_id: 1}};

      Clothes.findAll.mockRejectedValue(
          new Error('예외 발생으로 인한 500 반환'));
      await info(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: '의류장터를 불러오는데 실패하였습니다.',
        error: '예외 발생으로 인한 500 반환'
      })
    });
  });
});