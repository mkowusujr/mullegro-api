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
    })
  })
});
