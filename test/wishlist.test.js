const request = require('supertest');  // Supertest for HTTP requests
const app = 'http://localhost:10103';  // 서버 URL

describe('Wishlist API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'discafile@naver.com',
      password: '1111',
    });

    token = res.body.token;
    userId = res.body.userId;

    // 응답이 올바른지 확인
    expect(res.status).toBe(200);
  });

  test('POST /wishlist/add - Add item to wishlist', async () => {
    const res = await request(app)
                    .post('/wishlist/add')
                    .set('Authorization', `Bearer ${token}`)  // JWT 토큰 설정
                    .send({
                      userId: 1,
                      clothes_id: 3,
                    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Item added to wishlist.');
  });

  test('GET /wishlist/info - Retrieve wishlist', async () => {
    const res = await request(app)
                    .get('/wishlist/info')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                      userId: 1,
                    });

    expect(res.status).toBe(200);
    expect(res.body.clothes).toBeInstanceOf(Array);  // clothes는 배열이어야 함
  });
});