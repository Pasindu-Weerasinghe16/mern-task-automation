const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const request = require('supertest');
const express = require('express');

// Create a simple mock app for testing API endpoints without database
const createMockApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock auth routes
  app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    res.status(201).json({ 
      token: 'mock_token_123', 
      userId: 'mock_user_id',
      username: username 
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password123') {
      res.status(200).json({ 
        token: 'mock_token_123', 
        userId: 'mock_user_id',
        username: 'testuser'
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  // Mock tasks routes
  app.post('/api/tasks', (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    res.status(201).json({
      _id: 'mock_task_id',
      title,
      description,
      status: status || 'pending',
      userId: 'mock_user_id',
      createdAt: new Date()
    });
  });

  app.get('/api/tasks', (req, res) => {
    res.status(200).json([
      {
        _id: 'mock_task_id',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        userId: 'mock_user_id'
      }
    ]);
  });

  app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status } = req.body;
    res.status(200).json({
      _id: req.params.id,
      title: title || 'Updated Task',
      description: description || 'Updated Description',
      status: status || 'in-progress',
      userId: 'mock_user_id'
    });
  });

  app.delete('/api/tasks/:id', (req, res) => {
    res.status(200).json({ message: 'Task deleted successfully' });
  });

  return app;
};

describe('API Tests (Mock)', () => {
  let app;

  beforeAll(() => {
    app = createMockApp();
  });

  // Test 1: User registration and login
  describe('Auth API Tests', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
      expect(res.body.username).toEqual('testuser');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  // Test 2: Task CRUD operations
  describe('Task API Tests', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          status: 'pending'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toEqual('Test Task');
    });

    it('should get all tasks for user', async () => {
      const res = await request(app)
        .get('/api/tasks');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(1);
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put('/api/tasks/mock_task_id')
        .send({
          title: 'Updated Task',
          description: 'This is an updated task',
          status: 'in-progress'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Updated Task');
      expect(res.body.status).toEqual('in-progress');
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete('/api/tasks/mock_task_id');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });
  });
});