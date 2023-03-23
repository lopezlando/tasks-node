const request = require('supertest');
const { app, server } = require('../index');
const { connection } = require('../_helpers/db');

describe('User test suite', () => {
  beforeAll(() => {
    connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
    server.close();
  });

  let testUser, secondUser, token;
  const usersPayload = [
    {
      email: 'test@tasksnode.com',
      name: 'test',
      lastName: 'user',
      password: '123456',
    },
    {
      email: 'test2@tasksnode.com',
      name: 'test',
      lastName: 'user2',
      password: '123457',
    },
  ];
  const routes = {
    register: '/api/users/register',
    authenticate: '/api/users/authenticate',
    get: '/api/users',
  };

  describe(`POST ${routes.register}`, () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post(routes.register)
        .send(usersPayload[0]);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(
        expect.objectContaining({
          email: usersPayload[0].email,
          name: usersPayload[0].name,
          lastName: usersPayload[0].lastName,
        })
      );
      expect(typeof res.body.id).toBe('string');
      expect(res.body.id.length).toBeGreaterThan(0);
      testUser = res.body;
    });

    it('should create a second user (for get endpoint testing) ', async () => {
      const res = await request(app)
        .post(routes.register)
        .send(usersPayload[1]);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(
        expect.objectContaining({
          email: usersPayload[1].email,
          name: usersPayload[1].name,
          lastName: usersPayload[1].lastName,
        })
      );
      expect(typeof res.body.id).toBe('string');
      expect(res.body.id.length).toBeGreaterThan(0);
      secondUser = res.body;
    });

    it('should trigger validation errors', async () => {
      const wrongUserPayload = {
        email: 'test@tasksnode',
        name: 't',
        lastName: 'u',
        password: '12345',
      };

      const errors = [
        'Email is not valid.',
        'Password must be between 6 and 20 characters long.',
        'Name must be between 2 and 30 characters long.',
        'Last Name must be between 2 and 30 characters long.',
      ];

      const res = await request(app)
        .post(routes.register)
        .send(wrongUserPayload);

      expect(res.status).toBe(422);
      res.body.errors.forEach((error, i) => {
        expect(error.msg).toBe(errors[i]);
      });
    });

    it('should trigger email in use error', async () => {
      const res = await request(app)
        .post(routes.register)
        .send(usersPayload[0]);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toStrictEqual('Email already in use.');
    });
  });

  describe(`POST ${routes.authenticate}`, () => {
    it('should log in the new user', async () => {
      const res = await request(app).post(routes.authenticate).send({
        email: usersPayload[0].email,
        password: usersPayload[0].password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(testUser));
      expect(typeof res.body.token).toBe('string');
      token = res.body.token;
    });

    it('should trigger validation errors', async () => {
      const invalidUser = {
        email: `${generateRandomString(65)}@${generateRandomString(256)}.com`,
        password: generateRandomString(21),
      };

      const errors = [
        'Email should not exceed maximum email length.',
        'Password must be at most 20 characters long.',
      ];

      const res = await request(app)
        .post(routes.authenticate)
        .send(invalidUser);

      expect(res.status).toBe(422);
      res.body.errors.forEach((error, i) => {
        expect(error.msg).toBe(errors[i]);
      });
    });

    it('should contain invalid credentials', async () => {
      const res = await request(app).post(routes.authenticate).send({
        email: 'wrong@email.com',
        password: 'wrongPassword123',
      });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe('Incorrect username or password.');
      expect(res.body.token).toBeUndefined();
    });
  });

  describe(`GET ${routes.get}/:id`, () => {
    it('should retrieve user by id', async () => {
      const res = await request(app)
        .get(`${routes.get}/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(testUser));
    });

    it('should throw invalid token error', async () => {
      const res = await request(app).get(`${routes.get}/${testUser.id}`);

      expect(res.status).toBe(401);
      expect(res.body.errors[0].msg).toBe('Invalid Token');
    });

    it('should throw invalid mongo ID', async () => {
      const res = await request(app)
        .get(`${routes.get}/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body.errors[0].msg).toBe(
        'Invalid ID, must be a Mongo ObjectID'
      );
    });

    it('should throw invalid ID error (no user with that id)', async () => {
      let invalidId;

      //ensures that we'll create an invalid Id. if the id ends with 1, we'll change the last character to a 2. In any other case, we'll change the last character to a 1
      testUser.id[testUser.id.length - 1] === '1'
        ? (invalidId = testUser.id.slice(0, -1) + '2')
        : (invalidId = testUser.id.slice(0, -1) + '1');

      const res = await request(app)
        .get(`${routes.get}/${invalidId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.errors[0].msg).toBe('There is no user with that ID.');
    });
  });

  describe(`GET ${routes.get}`, () => {
    it('should retrieve all users', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(
        expect.objectContaining([testUser, secondUser])
      );
    });

    it('should retrieve only testUser (first page, limit of 1)', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining([testUser]));
    });

    it('should retrieve only secondUser (second page, limit of 1)', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 2, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining([secondUser]));
    });

    it('should retrieve only testUser (queryParameters partial/complete match, page and limit defaulted)', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: 'test',
          lastName: 'user',
          email: 'test@',
        });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining([testUser]));
    });

    it('should retrieve an empty array (no matches to the query parameters)', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ email: 'wrong@email.com' });

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual([]);
    });

    it('should trigger validation errors', async () => {
      const errors = [
        'Email should not exceed maximum email length',
        'Name should be at most 50 characters',
        'Last name should be at most 50 characters',
      ];

      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          name: generateRandomString(51),
          lastName: generateRandomString(51),
          email: `${generateRandomString(65)}@${generateRandomString(256)}.com`,
        });

      expect(res.status).toBe(422);
      res.body.errors.forEach((error, i) => {
        expect(error.msg).toBe(errors[i]);
      });
    });
  });
});

//used to create overly lenghty strings in order to trigger validations
function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
