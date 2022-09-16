const postService = require('../../../src/api/services/post.service');

describe('Post Service', () => {
  it('should be created', () => {
    expect(postService).toBeTruthy();
  });

  let db, Post, User;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Post = db.posts;
      User = db.users;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'error');
    } catch (error) {
      fail(error);
    }
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      try {
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          category: 'Clarinet',
          status: 'Not Sold'
        });
        let postId = 1;

        let response = await postService.getPost(postId);

        expect(response.id).toEqual(postId);
        expect(response).toEqual(jasmine.any(Post));
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.getPost();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('should get all the posts in the database', async () => {
      try {
        let dummyPosts = await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Good',
              address: 'USA',
              category: 'Clarinet',
              status: 'Not Sold'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Mid',
              address: 'CANADA',
              category: 'Clarinet',
              status: 'Not Sold'
            },
            {
              title: 'Dummy Post3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Good',
              address: 'JAPAN',
              category: 'Clarinet',
              status: 'Not Sold'
            }
          ],
          { returning: true }
        );

        let response = await postService.findAll();

        expect(response.length).toEqual(dummyPosts.length);
        for (let i = 0; i < response.length; i++) {
          expect(response[i].id).toEqual(i + 1);
        }
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        spyOn(postService, 'findAll').and.returnValue(Promise.reject('Error'));
        let response = await postService.findAll();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(error).toEqual(jasmine.any(String));
      }
    });
  });

  describe('findAllPostsForUser', () => {
    it("should get all of a user's posts", async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });
        await dummyUser.createPost({
          title: 'Dummy Post 2',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Mid',
          address: 'CANADA',
          category: 'Clarinet',
          status: 'Not Sold'
        });
        await dummyUser.createPost({
          title: 'Dummy Post3',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'JAPAN',
          category: 'Clarinet',
          status: 'Not Sold'
        });
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          category: 'Clarinet',
          status: 'Not Sold'
        });

        let response = await postService.findAllPostsForUser(dummyUser);

        expect(response.length).toEqual(2);
        response.forEach(post => {
          expect(post.userId).toEqual(dummyUser.id);
        });
      } catch (error) {
        fail(error);
      }
    });
    it('should return an empty list if user has no posts', async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });

        let response = await postService.findAllPostsForUser(dummyUser);

        expect(response).toEqual([]);
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.findAllPostsForUser({});
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('createNewPost', () => {
    it('should create a new post assiocated with a user', async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });

        let postObject = {
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          category: 'Clarinet',
          status: 'Not Sold'
        };

        let response = await postService.createNewPost(dummyUser, postObject);

        expect(response.title).toEqual(postObject.title);
        expect(response.price).toEqual(postObject.price);
        expect(response.description).toEqual(postObject.description);
        expect(response.condition).toEqual(postObject.condition);
        expect(response.address).toEqual(postObject.address);
        expect(response.category).toEqual(postObject.category);
        expect(response.status).toEqual(postObject.status);

        expect(response.userId).toEqual(dummyUser.id);
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });

        let postObject = {
          title: 'Dummy Post'
        };

        let response = await postService.createNewPost(dummyUser, postObject);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('updatePostStatus', () => {
    it('should update the status of a post', async () => {
      try {
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          category: 'Clarinet',
          status: 'Not Sold'
        });
        let postId = 1;
        let newStatus = { status: 'Sold' };
        let response = await postService.updatePostStatus(postId, newStatus);

        expect(response.id).toBe(postId);
        expect(response.status).toBe(newStatus.status);
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.updatePostStatus(100, {});
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('deletePost', () => {
    it('should delete a post from the database', async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });
        await dummyUser.createPost({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Mid',
          address: 'CANADA',
          category: 'Clarinet',
          status: 'Not Sold'
        });

        let postId = 1;
        let response = await postService.deletePost(dummyUser, postId);

        expect(response).toBe('Deleted successfully');
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.deletePost({}, 100);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
    it("should send an error if the user tries to delete a post they don't have", async () => {
      try {
        let dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });
        let response = await postService.deletePost(dummyUser, 1);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getPostsOfCategory', () => {
    it('should return a post', async () => {
      try {
        await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Good',
              address: 'USA',
              category: 'Clarinet',
              status: 'Not Sold'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Mid',
              address: 'CANADA',
              category: 'Trumpet',
              status: 'Not Sold'
            },
            {
              title: 'Dummy Post3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Good',
              address: 'JAPAN',
              category: 'Clarinet',
              status: 'Not Sold'
            }
          ],
          { returning: true }
        );

        let response = await postService.getPostsOfCategory('Clarinet');

        expect(response.length).toEqual(2);
      } catch (error) {
        fail(error);
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.getPost();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
