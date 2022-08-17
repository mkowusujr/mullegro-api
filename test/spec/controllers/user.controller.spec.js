const server = require('../../../src/server');
const userController = require('../../../src/api/controllers/user.controller');
const userService = require('../../../src/api/services/user.service');
const request = require('supertest');
const jwtMaker = require('../helpers/create-jwt');
const { response } = require('../../../src/api/controllers/user.controller');

const checkToSeeIsUserObject = (object) => {
  expect(object.hasOwnProperty('id')).toBeTrue();
  expect(object.hasOwnProperty('name')).toBeTrue();
  expect(object.hasOwnProperty('email')).toBeTrue();
  expect(object.hasOwnProperty('username')).toBeTrue();
  expect(object.hasOwnProperty('password')).toBeTrue();
};

describe('User Controller', () => {
  it('should be created', () => {
    expect(userController).toBeTruthy();
  });

  let db, User;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      User = db.users;
      spyOn(console, 'log');
      spyOn(console, 'error');
    } catch (error) {
      fail(error);
    }
  });

  describe("endpoint: '/api/users/register', ", () => {
    describe('HTTP POST method', () => {
      it('should create an account and token for a user', async () => {
        try {
          let userObject = {
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com',
            password: 'dummyPassword'
          };

          let response = await request(server)
            .post('/api/users/register')
            .set('Content-Type', 'application/json')
            .send(userObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.data).toBeTruthy();
          expect(response.body.token).toBeTruthy();
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let userObject = {};

          const response = await request(server)
            .post('/api/users/register')
            .set('Content-Type', 'application/json')
            .send(userObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/users/user/details', ", () => {
    describe('HTTP POST method', () => {
      it("should accepts a user's username and password and return a token", async () => {
        try {
          let userObject = {
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com',
            password: 'dummyPassword'
          };
          await userService.createUser(userObject);

          let loginObject = {
            email_or_username: 'dummy_username',
            password: 'dummyPassword'
          };

          let response = await request(server)
            .post('/api/users/login')
            .set('Content-Type', 'application/json')
            .send(loginObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
          expect(response.body.data.name).toBe(userObject.name);
          expect(response.body.data.username).toBe(userObject.username);
          expect(response.body.data.email).toBe(userObject.email);
        } catch (error) {
          fail(error);
        }
      });
      it("should accepts a user's email and password and return a token", async () => {
        try {
          let userObject = {
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com',
            password: 'dummyPassword'
          };
          await userService.createUser(userObject);

          let loginObject = {
            email_or_username: 'dummay@email.com',
            password: 'dummyPassword'
          };

          let response = await request(server)
            .post('/api/users/login')
            .set('Content-Type', 'application/json')
            .send(loginObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
          expect(response.body.data.name).toBe(userObject.name);
          expect(response.body.data.username).toBe(userObject.username);
          expect(response.body.data.email).toBe(userObject.email);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 400 response if there is an issue', async () => {
        try {
          let userObject = {
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com',
            password: 'dummyPassword'
          };
          await userService.createUser(userObject);

          let loginObject = {
            email_or_username: 'dummy_username',
            password: 'incorrectPassword'
          };

          const response = await request(server)
            .post('/api/users/login')
            .set('Content-Type', 'application/json')
            .send(loginObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/users/user/details', ", () => {
    describe('HTTP GET method', () => {
      it('it should require authorization', async () => {
        try {
          const response = await request(server).get('/api/users/user/details');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it('should get the details of the current user', async () => {
        try {
          let userObject = {
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com',
            password: 'dummyPassword'
          };
          await userService.createUser(userObject);
          let token = jwtMaker.createJwt(userObject);

          let response = await request(server)
            .get('/api/users/user/details')
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.name).toBe(userObject.name);
          expect(response.body.username).toBe(userObject.username);
          expect(response.body.email).toBe(userObject.email);
          expect(response.body.address).toBe(userObject.address);
          expect(response.body.password).toBeFalsy();
        } catch (error) {
          fail(error);
        }
      });
      xit('sends 404 if there is an error', async () => {});
    });
  });

  describe("endpoint: '/api/users', ", () => {
    describe('HTTP GET method', () => {
      it('should get all the users in the database', async () => {
        try {
          await User.bulkCreate([
            {
              name: 'Dummy User',
              address: 'USA',
              username: 'dummy_username',
              email: 'dummay@email.com',
              password: 'dummyPassword'
            },
            {
              name: 'Dummy User2',
              address: 'USA',
              username: 'dummy_username2',
              email: 'dummay2@email.com',
              password: 'dummyPassword'
            }
          ]);

          const response = await request(server)
            .get('/api/users')
            .set('Content-Type', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
          response.body.forEach((object) => checkToSeeIsUserObject(object));
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {});
    });
  });

  describe("endpoint: '/api/users/user/:username', ", () => {
    describe('HTTP GET method', () => {
      it('should get a user by username', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          let username = dummyUser.username;

          const response = await request(server)
            .get(`/api/users/user/${username}`)
            .set('Content-Type', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.username).toBe(username);
        } catch (error) {
          fail(error);
        }
      });
      it('sends 404 if there is an error', async () => {
        try {
          let username = 'not_a_real_user';

          const response = await request(server).get(
            `/api/users/user/${username}`
          );

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });

    describe('HTTP DELETE method', () => {
      it('delete a user by username', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          let username = dummyUser.username;

          const response = await request(server).delete(
            `/api/users/user/${username}`
          );

          expect(response.status).toEqual(200);
        } catch (error) {
          fail(error);
        }
      });
      it('sends 404 if there is an error', async () => {
        try {
          let username = 'not_a_real_user';

          const response = await request(server).delete(
            `/api/users/user/${username}`
          );

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint '/api/users/search, ", () => {
    describe('HTTP GET METHOD', () => {
      it('should be able to find users with a query string', async () => {
        try {
          await User.bulkCreate([
            {
              name: 'Dummy User',
              address: 'USA',
              username: 'water_is_the_best',
              email: 'water_is_the_best@email.com',
              password: 'dummyPassword'
            },
            {
              name: 'Dummy User2',
              address: 'USA',
              username: 'johny_applesauce',
              email: 'johny_applesauce@email.com',
              password: 'dummyPassword'
            },
            {
              name: 'Dummy User3',
              address: 'USA',
              username: 'george_is_cool',
              email: 'george_is_cool@email.com',
              password: 'dummyPassword'
            }
          ]);
          let searchTerm = 'a';
          let queryUrl = '?query=' + searchTerm;

          const response = await request(server)
            .get('/api/users/search' + queryUrl)
            .set('Content-Type', 'application/json');

          expect(response.body.length).toEqual(2);
          response.body.forEach((user) => expect(user.username).toContain('a'));
        } catch (error) {
          fail(error);
        }
      });
    });
  });
});
