const transcationService = require('../../../src/api/services/transactionHistories.service');
const userService = require('../../../src/api/services/user.service');

describe('Transcation Service', () => {
  it('should be created', () => {
    expect(transcationService).toBeTruthy();
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
    it('', async () => {});
    it('', async () => {});
  });

  describe('AddToTranscationHistory', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('', () => {
    it('', async () => {});
    it('', async () => {});
  });
});
