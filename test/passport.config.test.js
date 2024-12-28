/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */


const passport = require('passport');
const local = require('../passport/local_strategy');
const {User} = require('../models');

jest.mock('passport', () => ({
                        serializeUser: jest.fn(),
                        deserializeUser: jest.fn(),
                        use: jest.fn(),
                      }));

jest.mock('../models', () => ({
                         User: {
                           findOne: jest.fn(),
                         },
                       }));
jest.mock('../passport/local_strategy', () => jest.fn());

describe('Passport Config Tests', () => {
  beforeEach(() => {
    require('../passport')();  // Passport 초기화
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockDone = jest.fn();
  describe('serializeUser', () => {
    it('should serialize user email', () => {
      const mockUser = {email: 'test@example.com'};

      passport.serializeUser.mock.calls[0][0](mockUser, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, 'test@example.com');
    });
  });

  describe('deserializeUser', () => {
    it('should deserialize user by user_id', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        nick: 'testNick',
        name: 'Test Name',
      };

      User.findOne.mockResolvedValue(mockUser);

      await passport.deserializeUser.mock.calls[0][0](1, mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {user_id: 1},
        attributes: ['user_id', 'email', 'nick', 'name'],
      });
      expect(mockDone).toHaveBeenCalledWith(null, mockUser);
    });

    it('should handle missing user in deserializeUser', async () => {
      User.findOne.mockResolvedValue(null);  // User not found

      await passport.deserializeUser.mock.calls[0][0](1, mockDone);

      expect(User.findOne).toHaveBeenCalledWith({
        where: {user_id: 1},
        attributes: ['user_id', 'email', 'nick', 'name'],
      });
      expect(mockDone).toHaveBeenCalledWith(null, false);
    });
  });

  describe('local strategy', () => {
    it('should initialize local strategy', () => {
      expect(local).toHaveBeenCalled();
    });
  });
});