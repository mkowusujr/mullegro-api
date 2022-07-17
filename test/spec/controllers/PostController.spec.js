const postController = require('../../../src/api/controllers/post.controller');
const db = require('../../../src/api/models/index');
const Post = db.posts;
const User = db.users

describe('PostController', () => {
  it('should be created', () => {
    expect(postController).toBeTruthy();
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
      expect(response.title).toEqual(dummyPost.title);
      expect(response.price).toEqual(dummyPost.price);
      expect(response.description).toEqual(dummyPost.description);
      expect(response.condition).toEqual(dummyPost.condition);
      expect(response.address).toEqual(dummyPost.address);
      expect(response.type).toEqual(dummyPost.type);
      expect(response.status).toEqual(dummyPost.status);
    });
  });
});