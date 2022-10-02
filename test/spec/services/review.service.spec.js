const reviewService = require('../../../src/api/services/review.service');

xdescribe('Review Service', () => {
  it('should be created', () => {
    expect(reviewService).toBeTruthy();
  });

  let db, User, Post, Review, dummyUsers, dummyPosts, dummyReviews;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Review = db.reviews;
      User = db.users;
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'error');

      dummyUsers = await User.bulkCreate(
        [
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
        ],
        { returning: true }
      );

      dummyPosts = await Post.bulkCreate(
        [
          {
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available',
            userId: 1
          },
          {
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available',
            userId: 1
          },
          {
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available',
            userId: 1
          }
        ],
        { returning: true }
      );

      dummyReviews = await Review.bulkCreate(
        [
          {
            rating: 4,
            description: 'This was cool',
            userId: 1,
            postId: 1
          },
          {
            rating: 4,
            description: 'This was cool',
            userId: 2,
            postId: 2
          },
          {
            rating: 4,
            description: 'This was cool',
            userId: 2,
            postId: 3
          }
        ],
        { returning: true }
      );
    } catch (error) {
      fail(error);
    }
  });

  describe('createReview', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('getReview', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('updateReview', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('getAllReviewsMadeByUser', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('getAllReviewsOnPostsByUser', () => {
    it('', async () => {});
    it('', async () => {});
  });

  describe('generateStatsForUser', () => {
    it('', async () => {});
    it('', async () => {});
  });
});
