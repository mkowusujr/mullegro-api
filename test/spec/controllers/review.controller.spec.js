const server = require('../../../src/server');
const reviewController = require('../../../src/api/controllers/review.controller');
const request = require('supertest');
const jwtMaker = require('../helpers/create-jwt');

describe('Review Controller', () => {
  it('should be created', () => {
    expect(reviewController).toBeTruthy();
  });

  let db, User, Post, Review, dummyUsers, dummyUsername, token, dummyPosts;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Review = db.reviews;
      User = db.users;
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'log');
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

      token = jwtMaker.createJwt(dummyUsers[0]);
      dummyUsername = dummyUsers[0].username;
    } catch (error) {
      fail(error);
    }
  });

  describe("endpoint: '/api/reviews/user/reviews", () => {
    describe('HTTP POST method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).post(
            '/api/reviews/user/reviews'
          );
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it('should create a post', async () => {
        try {
          let user = dummyUsers[0];
          let post = dummyPosts[0];
          let review = {
            rating: 4,
            description: 'This was cool',
            postId: post.id
          };

          const response = await request(server)
            .post('/api/reviews/user/reviews')
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(review);
          expect(response.status).toEqual(200);
          expect(response.body.userId).toEqual(user.id);
          expect(response.body.postId).toEqual(post.id);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 400 response if there is an issue', async () => {
        try {
          let post = dummyPosts[0];
          let review = {};

          const response = await request(server)
            .post('/api/reviews/user/reviews')
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(review);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/reviews/review/:reviewId", () => {
    describe('HTTP GET method', () => {
      it('should fetch a review by id', async () => {
        try {
          let reviewId = 1;

          const response = await request(server)
            .get(`/api/reviews/review/${reviewId}`)
            .set('Content-category', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.id).toEqual(reviewId);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let reviewId = 404;

          const response = await request(server)
            .get(`/api/reviews/review/${reviewId}`)
            .set('Content-category', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
    describe('HTTP PUT method', () => {
      it('should require authorization', async () => {
        try {
          let reviewId = 1;
          const response = await request(server).put(
            `/api/reviews/review/${reviewId}`
          );
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it('can update a review', async () => {
        try {
          let user = dummyUsers[0];
          let reviewId = 4;
          let updatedReviewDetails = {
            rating: 4.8,
            description: 'This was cooler than I thought'
          };

          const response = await request(server)
            .put(`/api/reviews/review/${reviewId}`)
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(updatedReviewDetails);

          expect(response.status).toEqual(200);
          expect(response.body.id).toEqual(reviewId);
          expect(response.body.userId).toEqual(user.id);
          expect(response.body.rating).toEqual(updatedReviewDetails.rating);
          expect(response.body.description).toBe(
            updatedReviewDetails.description
          );
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let reviewId = 404;
          let updatedReviewDetails = {};
          const response = await request(server)
            .put(`/api/reviews/review/${reviewId}`)
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(updatedReviewDetails);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/reviews/post/:postId/review", () => {
    describe('HTTP GET method', () => {
      it('should fetch a review by id', async () => {
        try {
          let postId = 1;

          const response = await request(server)
            .get(`/api/reviews/post/${postId}/review`)
            .set('Content-category', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.postId).toEqual(postId);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let postId = 404;

          const response = await request(server)
            .get(`/api/reviews/post/${postId}/review`)
            .set('Content-category', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/reviews/user/:username/reviews", () => {
    describe('HTTP GET method', () => {
      it('can get all the reviews a user created', async () => {
        try {
          let actualAmountOfReviewUserOneMade = 1;

          const response = await request(server)
            .get(`/api/reviews/user/${dummyUsername}/reviews`)
            .set('Content-category', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(actualAmountOfReviewUserOneMade);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let username = 'notARealUserName';

          const response = await request(server)
            .get(`/api/reviews/user/${username}/reviews`)
            .set('Content-category', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/reviews/user/:username/posts/reviews", () => {
    describe('HTTP GET method', () => {
      it('should gets all the reviews that the specified user has made', async () => {
        try {
          let actualAmountOfReviewsMadeOnPostsBelongingToUserOne = 3;

          const response = await request(server)
            .get(`/api/reviews/user/${dummyUsername}/posts/reviews`)
            .set('Content-category', 'application/json');

          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(
            actualAmountOfReviewsMadeOnPostsBelongingToUserOne
          );
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let username = 'notARealUserName';

          const response = await request(server)
            .get(`/api/reviews/user/${username}/posts/reviews`)
            .set('Content-category', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/reviews/user/:username/stats", () => {
    describe('HTTP GET method', () => {
      it('can get all the reviews a user created', async () => {
        try {
          let actualAmountOfReviewUserOneMade = 1;

          const response = await request(server)
            .get(`/api/reviews/user/${dummyUsername}/stats`)
            .set('Content-category', 'application/json');

          expect(response.status).toEqual(200);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let username = 'notARealUserName';

          const response = await request(server)
            .get(`/api/reviews/user/${username}/stats`)
            .set('Content-category', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });
});
