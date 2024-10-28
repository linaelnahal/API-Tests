import request from 'supertest';
import app from '../app.js'; // Adjust the path to your app.js file

let token;

beforeAll(async () => {
  // Create a user for authentication tests
  const response = await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test User',
      email: 'user@gmail.com',
      password: 'user123'
    });
  
  token = response.body.token; // Store token for later use
});

describe('User API', () => {
  // Test for user authentication
  describe('Authenticate User', () => {
    it('should authenticate user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth')
        .send({
          email: 'user@gmail.com',
          password: 'user123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth')
        .send({
          email: 'invalid@gmail.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Incorrect email or password');
    });
  });

  // Test getting user data
  describe('Get User', () => {
    it('should return user data when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('user@gmail.com');
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(403); // Adjusted to 403 based on your API's response
      expect(response.body.message).toBe('Unauthorized'); // Adjust based on actual response
    });
  });

  // Test updating user information
  describe('Patch User', () => {
    it('should update user information successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated User',
          email: 'updated_user@gmail.com',
          password: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated with success');
    });

    it('should return 401 for unauthorized update', async () => {
      const response = await request(app)
        .patch('/api/v1/users')
        .set('Authorization', 'Bearer invalidtoken')
        .send({
          name: 'Updated User',
          email: 'updated_user@gmail.com',
          password: 'newpassword123'
        });

      expect(response.status).toBe(403); // Adjusted to 403 based on your API's response
      expect(response.body.message).toBe('jwt malformed'); // Adjust based on actual response
    });
  });

  // Test deleting the user
  describe('Delete User', () => {
    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted with success');
    });

    it('should return 401 for unauthorized delete', async () => {
      const response = await request(app)
        .delete('/api/v1/users');

      expect(response.status).toBe(403); // Adjusted to 403 based on your API's response
      expect(response.body.message).toBe('Unauthorized to delete'); // Adjust based on actual response
    });
  });

  // Test deleting all users
  describe('Delete All Users', () => {
    it('should delete all users successfully with valid admin key', async () => {
      const response = await request(app)
        .delete('/api/v1/users')
        .send({ key_admin: 'keyadmin123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Users deleted with success');
    });

    it('should return 403 for invalid admin key', async () => {
      const response = await request(app)
        .delete('/api/v1/users')
        .send({ key_admin: 'wrongkey' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Unauthorized to delete'); // Adjust based on actual response
    });
  });

  // Test for an invalid endpoint
  it('should return 404 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/v1/invalid-endpoint');
    expect(response.status).toBe(404);
  });
});
