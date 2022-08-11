const server = require('../../../src/server');
const userController = require('../../../src/api/controllers/user.controller');
const request = require('supertest');
const jwtMaker = require('../helpers/create-jwt');

describe('User Controller', () => {
  it('should be created', () => {
    expect(userController).toBeTruthy();
  });

  let db;
  let User;

  beforeEach(async () => {
    db = require('../../../src/api/models/index');
    await db.sequelize.sync({ force: true });
    User = db.users;
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  describe("endpoint: '/api/usersregister', ", () => {
    describe('HTTP POST method', () => {
        it('should create an account and token for a user', async () => {
            let userObject = {
                name: 'Dummy User',
                address: 'USA',
                username: 'dummy_username',
                email: 'dummay@email.com',
                password: 'dummyPassword'
            }
            
            try {
                let response = await request(server)
                    .post( '/api/users/register')
                    .set('Content-Type', 'application/json')
                    .send(userObject)
                expect(console.log).toHaveBeenCalled();
                expect(response.status).toEqual(200);
                expect(response.body.data).toBeTruthy();
                expect(response.body.token).toBeTruthy();
            } catch (error) {
                fail(error);
            }
        });
        it('sends a 404 response if there is an issue', async () => {
            let userObject = {};

            try {
                const response = await request(server)
                .post( '/api/users/register')
                .set('Content-Type', 'application/json')
                .send(userObject)
                expect(console.log).toHaveBeenCalled();
                expect(response.status).toEqual(400);
              } catch (error) {
                fail(error);
              }
        })
    });
  });
});
