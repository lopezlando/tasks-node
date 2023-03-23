const request = require('supertest');
const { app, server } = require('../index');
const { connection } = require('../_helpers/db');
const { generateRandomString } = require('../_helpers/functions');
const { ObjectId } = require('mongodb');

describe('Task test suite', () => {
  afterAll(async () => {
    await connection.close();
    server.close();
  });

  let token, taskId;

  const invalidId = new ObjectId().toString();

  const routes = {
    create: '/api/tasks/create',
    modify: '/api/tasks/modify',
    get: '/api/tasks',
    deleteTask: '/api/tasks/deleteTask',
    authenticate: '/api/users/authenticate',
  };

  const tasksPayload = [
    {
      name: 'task 1',
      description: 'fold clothes',
      completed: true,
    },
    {
      name: 'task 2',
      description: 'do the dishes',
    },
  ];

  it('should log into user in order to store the jwt token', async () => {
    const res = await request(app).post(routes.authenticate).send({
      email: 'test@tasksnode.com',
      password: '123456',
    });

    token = res.body.token;
  });

  describe(`POST ${routes.create}`, () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post(routes.create)
        .send(tasksPayload[0])
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(tasksPayload[0]));
    });

    it('should create another task', async () => {
      const res = await request(app)
        .post(routes.create)
        .send(tasksPayload[1])
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(tasksPayload[1]));

      //stores the task id in a variable for further testing
      taskId = res.body._id;
    });

    it('should trigger validation errors', async () => {
      const wrongTaskPayload = {
        description: generateRandomString(301),
        completed: 'not a boolean value',
      };

      const errors = [
        'Name is required and should be at most 50 characters',
        'Description should be at most 300 characters',
        'Completed should be a boolean value',
      ];

      const res = await request(app)
        .post(routes.create)
        .send(wrongTaskPayload)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      res.body.errors.forEach((error, i) => {
        expect(error.msg).toBe(errors[i]);
      });
    });
  });

  describe(`GET ${routes.get}/:id`, () => {
    it('should get a task by ID', async () => {
      const res = await request(app)
        .get(`${routes.get}/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(tasksPayload[1]));
    });

    it('should not find a task with that id', async () => {
      const res = await request(app)
        .get(`${routes.get}/${invalidId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.errors[0].msg).toBe('There is no task with that ID.');
    });

    it('should trigger mongo ID validation error', async () => {
      const res = await request(app)
        .get(`${routes.get}/12345`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body.errors[0].msg).toBe(
        'Invalid ID, must be a Mongo ObjectID'
      );
    });
  });

  describe(`GET ${routes.get}`, () => {
    it('should retrieve all tasks', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should retrieve only task 2 (second page, limit of 1)', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 2, limit: 1 });

      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe('task 2');
    });

    it('should retrieve only task 1 based on query parameters', async () => {
      const res = await request(app)
        .get(`${routes.get}`)
        .set('Authorization', `Bearer ${token}`)
        .query({
          page: 1,
          limit: 10,
          name: 'task 1',
          description: 'fold c',
          completed: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe('task 1');
    });
  });

  describe(`PUT ${routes.modify}`, () => {
    const modifiedTask = {
      name: 'modified name',
      description: 'modified description',
      completed: true,
    };
    it('should modify a task', async () => {
      const res = await request(app)
        .put(`${routes.modify}/${taskId}`)
        .send(modifiedTask)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual(expect.objectContaining(modifiedTask));
    });

    it('should trigger validation errors', async () => {
      const wrongTaskPayload = {
        name: generateRandomString(51),
        description: generateRandomString(301),
        completed: 'not a boolean value',
      };
      const wrongId = '123';

      const errors = [
        'Invalid ID, must be a Mongo ObjectID',
        'Name should be at most 50 characters',
        'Description should be at most 300 characters',
        'Completed should be a boolean value',
      ];

      const res = await request(app)
        .put(`${routes.modify}/${wrongId}`)
        .send(wrongTaskPayload)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      res.body.errors.forEach((error, i) => {
        expect(error.msg).toBe(errors[i]);
      });
    });

    it('should not find a task with that id', async () => {
      const res = await request(app)
        .put(`${routes.modify}/${invalidId}`)
        .send(modifiedTask)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.errors[0].msg).toBe('There is no task with that ID.');
    });
  });

  describe(`DELETE ${routes.deleteTask}`, () => {
    it('should not find a task with that id', async () => {
      const res = await request(app)
        .delete(`${routes.deleteTask}/${invalidId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.errors[0].msg).toBe('There is no task with that ID.');
    });

    it('should trigger mongo ID validation error', async () => {
      const res = await request(app)
        .delete(`${routes.deleteTask}/12345`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(422);
      expect(res.body.errors[0].msg).toBe(
        'Invalid ID, must be a Mongo ObjectID'
      );
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`${routes.deleteTask}/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('The specified task was deleted.');
    });
  });
});
