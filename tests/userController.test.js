const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = express();
const UserModel = require('../models/user.model');
const userController = require('../controllers/userControllers');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
    await UserModel.deleteMany({}); // Vide la collection avant chaque test
  });

app.use(express.json());
app.post('/register', userController.signUp);

describe('POST /register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
          .post('/register')
          .send({
            email: 'mihail.dimitriu05@gmail.com',
            password: '123456789',
            firstName: 'Mihail',
            lastName: 'Dimitriu',
          });
    
        expect(res.statusCode).toEqual(200); 
       // expect(res.body).toHaveProperty('user');
    
        const user = await UserModel.findOne({ email: 'mihail.dimitriu05@gmail.com' });
        expect(user).not.toBeNull();
        expect(user.firstName).toBe('Mihail');
      }, 20000); // Ajoutez un délai d'attente de 20 secondes
   

  it('should not register a user with an existing email', async () => {
    await UserModel.create({
      email: 'mihail.dimitriu05@gmail.com',
      password: '123456789',
      firstName: 'Mihail',
      lastName: 'Dimitriu',
    });

    const res = await request(app)
      .post('/register')
      .send({
        email: 'mihail.dimitriu05@gmail.com',
      password: '123456',
      firstName: 'Jane',
      lastName: 'Doe',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toBe('Le mel est déjà utilisé');
  });
});
