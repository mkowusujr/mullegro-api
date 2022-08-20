const transcationHistoryService = require('../../../src/api/services/transcationHistoryService.service');
const userService = require('../../../src/api/services/user.service');

describe('Transcation History Service', () => {
  it('should be created', () => {
    expect(transcationHistoryService).toBeTruthy();
  });

  let db, Post, dummyUser, dummyPosts;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'error');

      dummyUser = await userService.createUser({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com',
        password: 'dummyPassword'
      });

      dummyPosts = await Post.bulkCreate(
        [
          {
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Good',
            address: 'USA',
            type: 'Clarinet',
            status: 'Not Sold'
          },
          {
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Mid',
            address: 'CANADA',
            type: 'Clarinet',
            status: 'Not Sold'
          },
          {
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Good',
            address: 'JAPAN',
            type: 'Clarinet',
            status: 'Not Sold'
          }
        ],
        { returning: true }
      );
    } catch (error) {
      fail(error);
    }
  });

  describe('createTransactionHistory', () => {
    it('creates a transaction history log for a user', async () => {
      try {
        
      } catch (error) {
        
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        //let dummyUser = {};
        let response = await transcationHistoryService
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('AddToTranscationHistory', () => {
    it('adds a transaction to a user\'s transaction history', async () => {});
    it('throws an error if there is an issue', async () => {});
  });

  describe('GetFullTransactionHistory', () => {
    it('gets all a user\'s transactions', async () => {});
    it('throws an error if there is an issue', async () => {});
  });

  describe('GetTransaction', () => {
    it('gets one transcation from a user\'s transaction history', async () => {});
    it('throws an error if there is an issue', async () => {});
  });
});
