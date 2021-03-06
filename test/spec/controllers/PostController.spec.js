const postController = require('../../../src/api/controllers/post.controller');
let db;
let Post;
let User;

describe('PostController', () => {
  it('should be created', () => {
    expect(postController).toBeTruthy();
  });

  beforeEach(async () => {
    db = require('../../../src/api/models/index');
    Post = db.posts;
    User = db.users;
    await db.sequelize.sync({ force: true });
    spyOn(console, 'error');
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      let dummyPost = await Post.create({
        title: 'Dummy Post',
        price: 100.00,
        description: 'This is an instrument',
        condition: 'Good',
        address: 'USA',
        type: "Clarinet",
        status: "Not Sold"
      }); 
      let postId = 1;

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
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postController.getPost();
        if (response || !response) fail('Didn\'t throw error');
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
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
      for (let i = 0; i < response.length; i++){
        expect(response[i].id).toEqual(i+1);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        spyOn(postController, 'getAllPosts').and.returnValue(Promise.reject('Error'));
        let response = await postController.getAllPosts();
        if (response || !response) fail('Didn\'t throw error');
      } catch (error) {
        console.info(error)
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getAllPostsForUser', () => {
    it('should get all of a user\'s posts', async () => {
      let dummyUser = await User.create({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com'
      });
      await dummyUser.createPost({
          title: 'Dummy Post 2',
          price: 100.00,
          description: 'This is an instrument',
          condition: 'Mid',
          address: 'CANADA',
          type: "Clarinet",
          status: "Not Sold"
      });
      await dummyUser.createPost({
          title: 'Dummy Post3',
          price: 100.00,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'JAPAN',
          type: "Clarinet",
          status: "Not Sold"
      });
      await Post.create({
        title: 'Dummy Post',
        price: 100.00,
        description: 'This is an instrument',
        condition: 'Good',
        address: 'USA',
        type: "Clarinet",
        status: "Not Sold"
      });
      let response = await postController.getAllPostsForUser(dummyUser);
      
      expect(response.length).toEqual(2);
      response.forEach((post) => {
        expect(post.userId).toEqual(dummyUser.id);
      });
    });
    it('should throw an error if there is an issue', async () => {
      try {
        await postController.getAllPostsForUser({});
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('createNewPost', () => {
    it('should create a new post assiocated with a user', async () => {
      pending();
    });
    it('should throw an error if there is an issue', async () => {
      pending();
    });
  });

  describe('updatePost', () => {
    it('should update a user\'s post', async () => {
      pending();
    });
    it('should throw an error if there is an issue', async () => {
      pending();
    });
  });

  describe('updatePostStatus', () => {
    it('should update the status of a post', async () => {
      pending();
    });
    it('should throw an error if there is an issue', async () => {
      pending();
    });
  });

  describe('deletePost', () => {
    it('should delete a post from the database', async () => {
      pending();
    });
    it('should throw an error if there is an issue', async () => {
      pending();
    });
  });

});