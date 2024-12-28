const passport = require('passport');
const localStrategy = require('../passport/local_strategy');  // 올바르게 로드
const {User} = require('../models');
const bcrypt = require('bcrypt');

// Mock 설정
jest.mock('../models', () => ({
                         User: {
                           findOne: jest.fn(),
                         },
                       }));
jest.mock('bcrypt', () => ({
                      compare: jest.fn(),
                    }));

describe('Local Strategy Tests', () => {
  let mockDone;

  beforeAll(() => {
    localStrategy();  // 로컬 전략 초기화
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDone = jest.fn();  // Mock Passport의 `done` 함수
  });

  it('should authenticate successfully with correct email and password',
     async () => {
       const mockUser = {
         email: 'test@example.com',
         password: 'hashedPassword',
       };

       // Mock 데이터베이스 호출
       User.findOne.mockResolvedValue(mockUser);

       // Mock bcrypt 비교
       bcrypt.compare.mockResolvedValue(true);

       // 전략 호출
       const strategy = passport._strategies.local;
       await strategy._verify('test@example.com', 'correctPassword', mockDone);

       // Assertions
       expect(User.findOne).toHaveBeenCalledWith({
         where: {email: 'test@example.com'},
       });
       expect(bcrypt.compare)
           .toHaveBeenCalledWith('correctPassword', 'hashedPassword');
       expect(mockDone).toHaveBeenCalledWith(null, mockUser);
     });

  it('should fail if user is not found', async () => {
    User.findOne.mockResolvedValue(null);  // No user found

    const strategy = passport._strategies.local;
    await strategy._verify('test@example.com', 'anyPassword', mockDone);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({
      where: {email: 'test@example.com'},
    });
    expect(mockDone).toHaveBeenCalledWith(null, false, {
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
    });
  });

  it('should fail if password does not match', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    User.findOne.mockResolvedValue(mockUser);  // User exists
    bcrypt.compare.mockResolvedValue(false);   // Password mismatch

    const strategy = passport._strategies.local;
    await strategy._verify('test@example.com', 'wrongPassword', mockDone);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({
      where: {email: 'test@example.com'},
    });
    expect(bcrypt.compare)
        .toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    expect(mockDone).toHaveBeenCalledWith(null, false, {
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
    });
  });

  it('should handle server errors', async () => {
    const mockError = new Error('Database Error');
    User.findOne.mockRejectedValue(mockError);  // Simulate database error

    const strategy = passport._strategies.local;
    await strategy._verify('test@example.com', 'anyPassword', mockDone);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({
      where: {email: 'test@example.com'},
    });
    expect(mockDone).toHaveBeenCalledWith(mockError);
  });
});