const reviewService = require('../../../src/api/services/review.service');

describe('Review Service', () => {
  it('should be created', () => {
    expect(reviewService).toBeTruthy();
  });

  let db, User, Post, Review, dummyUsers, dummyPosts;

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
            status: 'Sold',
            userId: 1
          },
          {
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Sold',
            userId: 1
          },
          {
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Sold',
            userId: 1
          },
          {
            title: 'Dummy Post4',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Sold',
            userId: 2
          }
        ],
        { returning: true }
      );

      await Review.bulkCreate(
        [
          {
            rating: 4,
            description: 'This was cool',
            userId: 2,
            postId: 1
          },
          {
            rating: 4.5,
            description: 'This was cool',
            userId: 2,
            postId: 2
          },
          {
            rating: 4.3,
            description: 'This was cool',
            userId: 2,
            postId: 3
          },
          {
            rating: 4.3,
            description: 'This was cool',
            userId: 1,
            postId: 4
          }
        ],
        { returning: true }
      );
    } catch (error) {
      fail(error);
    }
  });

  describe('createReview', () => {
    it('Create a review on a post', async () => {
      let user = dummyUsers[0];
      let post = dummyPosts[0];
      let review = {
        rating: 4,
        description: 'This was cool',
        postId: post.id
      };

      let createdReview = await reviewService.createReview(
        user,
        review
      );

      expect(createdReview.userId).toEqual(user.id);
      expect(createdReview.postId).toEqual(post.id);
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let user = {};
        let review = {};

        let response = await reviewService.createReview(user, review);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getReview', () => {
    it('can get a review by id', async () => {
      let reviewId = 1;
      let fetchedReview = await reviewService.getReview(reviewId);
      expect(fetchedReview.id).toEqual(reviewId);
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let reviewId = 404;

        let response = await reviewService.getReview(reviewId);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('updateReview', () => {
    it('can update a review belonging to the specified user', async () => {
      let user = dummyUsers[0];
      let reviewId = 4;
      let updatedReviewDetails = {
        rating: 4.8,
        description: 'This was cooler than I thought'
      };

      let updateReview = await reviewService.updateReview(
        user,
        reviewId,
        updatedReviewDetails
      );

      expect(updateReview.id).toEqual(reviewId);
      expect(updateReview.userId).toEqual(user.id);
      expect(updateReview.rating).toEqual(updatedReviewDetails.rating);
      expect(updateReview.description).toBe(updatedReviewDetails.description);
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let user = {};
        let reviewId = 1;
        let updatedReviewDetails = {};

        let response = await reviewService.updateReview(
          user,
          reviewId,
          updatedReviewDetails
        );
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getAllReviewsMadeByUser', () => {
    it('can get all the reviews a user created', async () => {
      let user = dummyUsers[0];
      let actualAmountOfReviewUserOneMade = 1;
      let reviews = await reviewService.getAllReviewsMadeByUser(user.username);

      expect(reviews.length).toEqual(actualAmountOfReviewUserOneMade);
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let username = 'doesNotExist';

        let response = await reviewService.getAllReviewsMadeByUser(username);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getAllReviewsFromPostsByUser', () => {
    it('can get all the reviews made on posts belonging to a user', async () => {
      let user = dummyUsers[0];
      let = actualAmountOfReviewsMadeOnPostsBelongingToUserOne = 3;
      let reviews = await reviewService.getAllReviewsFromPostsByUser(
        user.username
      );

      expect(reviews.length).toEqual(
        actualAmountOfReviewsMadeOnPostsBelongingToUserOne
      );
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let username = 'doesNotExist';

        let response = await reviewService.getAllReviewsFromPostsByUser(username);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('generateStatsForUser', () => {
    it('should generate the stats for a user', async () => {
      let username = dummyUsers[0].username;
      let actualAverageRating = 4.27;
      let actualAmountOfSoldPostsBelongingToUser = 3;

      let StatsForUser = await reviewService.generateStatsForUser(username);

      expect(StatsForUser.averageRating).toBeCloseTo(actualAverageRating, 2);
      expect(StatsForUser.amountOfPostsSold).toEqual(
        actualAmountOfSoldPostsBelongingToUser
      );
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let username = 'doesNotExist';

        let response = await reviewService.generateStatsForUser(username);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
