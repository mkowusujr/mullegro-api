const postController = require('../../../src/api/controllers/post.controller');
// const db = require('../../../src/api/models/index');
// const Post = db.posts;
// const User = db.users
let Post;
describe('PostController', () => {
  it('should be created', () => {
    expect(postController).toBeTruthy();
  });

  beforeEach(async () => {
    const db = require('../../../src/api/models/index');
    Post = db.posts;
    await db.sequelize.sync({ force: true });
  });

  describe('getPost', () => {
    it('should return a post', async (postId=1) => {
      let dummyPost = await Post.create({
        title: 'Dummy Post',
        price: 100.00,
        description: 'This is an instrument',
        condition: 'Good',
        address: 'USA',
        type: "Clarinet",
        status: "Not Sold"
      }); 
      
      let response = await postController.getPost(postId);
      expect(response.id).toEqual(postId);
      // expect(response.title).toEqual(dummyPost.title);
      // expect(response.price).toEqual(dummyPost.price);
      // expect(response.description).toEqual(dummyPost.description);
      // expect(response.condition).toEqual(dummyPost.condition);
      // expect(response.address).toEqual(dummyPost.address);
      // expect(response.type).toEqual(dummyPost.type);
      // expect(response.status).toEqual(dummyPost.status);
    });
    it('should throw an error if there is an issue', async (postId=1) => {
      try {
        await postController.getPost(postId);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('getAllPosts', () => {
    it('should get all the posts in the database', async () => {
      let dummyPosts = await Post.bulkCreate([
        {
          title: 'Dummy Post',
          price: 100.00,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: "Clarinet",
          status: "Not Sold"
        },
        {
          title: 'Dummy Post 2',
          price: 100.00,
          description: 'This is an instrument',
          condition: 'Mid',
          address: 'CANADA',
          type: "Clarinet",
          status: "Not Sold"
        },
        {
          title: 'Dummy Post3',
          price: 100.00,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'JAPAN',
          type: "Clarinet",
          status: "Not Sold"
        }],
        {returning: true}
      );
      let response = await postController.getAllPosts();
      expect(response.length).toEqual(dummyPosts.length);
      expect(response[0].id).toEqual(1);
      expect(response[1].id).toEqual(2);
      expect(response[2].id).toEqual(3);
    });
    it('should throw an error if there is an issue', async () => {
      try {
        await postController.getAllPosts();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  })
});