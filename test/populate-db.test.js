const request = require('supertest');
const { app, server } = require('../index');
const { connection } = require('../_helpers/db');

describe('Populate DB', () => {
  beforeAll(() => {
    connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
    server.close();
  });

  let token;

  const userPayload = {
    email: 'admin@admin.com',
    name: 'admin',
    lastName: 'user',
    password: '123456',
  };

  const tasksPayload = [
    {
      name: 'fold clothes',
      description: 'do it ASAP!',
      completed: 1,
    },
    {
      name: 'vacuum carpet',
      description: 'use the handheld vacuum for corners',
      completed: 0,
    },
    {
      name: 'wash dishes',
      description: 'use hot water and soap',
      completed: true,
    },
    {
      name: 'clean bathroom',
      description: 'scrub the toilet and shower',
      completed: false,
    },
    {
      name: 'dust surfaces',
      description: 'use a microfiber cloth',
      completed: 1,
    },
    {
      name: 'take out the trash',
      description: 'make sure to tie the bag tightly',
      completed: false,
    },
    {
      name: 'mop floors',
      description: 'use a bucket and mop with hot water and floor cleaner',
      completed: true,
    },
    {
      name: 'wash bedding',
      description: 'wash sheets, pillowcases, and blankets',
      completed: 0,
    },
    {
      name: 'organize closet',
      description: 'sort clothes by category and color',
      completed: true,
    },
    {
      name: 'clean windows',
      description: 'use a squeegee and window cleaner',
      completed: false,
    },
  ];

  const routes = {
    register: '/api/users/register',
    authenticate: '/api/users/authenticate',
    createTask: '/api/tasks/create',
  };

  it('should create the user', async () => {
    const res = await request(app).post(routes.register).send(userPayload);

    expect(res.status).toBe(200);
  });

  it('should log in with the new user', async () => {
    const res = await request(app).post(routes.authenticate).send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    token = res.body.token;

    console.info(`Here's your user token: ${token}`);
  });

  it('should create all tasks', async () => {

    // this is far from ideal since it loops over an endpoint that creates a single task at a time, but I don't have an endpoint to create many tasks at once yet. I might do it in the future.
    const promises = tasksPayload.map(async (task) => {
      const res = await request(app)
        .post(routes.createTask)
        .send(task)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
    await Promise.all(promises);
  });
});
