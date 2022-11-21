const postService = require('../../../src/api/services/post.service');

describe('Post Service', () => {
  it('should be created', () => {
    expect(postService).toBeTruthy();
  });

  let db, Post, User;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      Post = db.posts;
      User = db.users;
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
    } catch (error) {
      throw error;
    }
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      try {
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId = 1;

        let response = await postService.getPost(postId);

        expect(response.id).toEqual(postId);
        expect(response).toEqual(expect.any(Post));
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.getPost();
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('can get all the posts in the database', async () => {
      try {
        let dummyPosts = await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Acceptable',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
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
        throw error;
      }
    });
    it('can search for the posts by title', async () => {
      try {
        await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Acceptable',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post 3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            }
          ],
          { returning: true }
        );

        let response = await postService.findAll('2');

        expect(response.length).toEqual(1);
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        jest.spyOn(postService, 'findAll').mockReturnValue(Promise.reject('Error'));
        let response = await postService.findAll();
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(error).toEqual(expect.any(String));
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
          condition: 'Used - Acceptable',
          category: 'Clarinet',
          status: 'Available'
        });
        await dummyUser.createPost({
          title: 'Dummy Post3',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let isCurrentUser = false;
        let response = await postService.findAllPostsForUser(
          dummyUser,
          isCurrentUser
        );

        expect(response.length).toEqual(2);
        response.forEach(post => {
          expect(post.userId).toEqual(dummyUser.id);
        });
      } catch (error) {
        throw error;
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
        let isCurrentUser = true;
        let response = await postService.findAllPostsForUser(
          dummyUser,
          isCurrentUser
        );

        expect(response).toEqual([]);
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let isCurrentUser = false;
        let response = await postService.findAllPostsForUser({}, isCurrentUser);
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
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
        throw error;
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
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId = 1;
        let newStatus = { status: 'Sold' };
        let response = await postService.updatePostStatus(postId, newStatus);

        expect(response.id).toBe(postId);
        expect(response.status).toBe(newStatus.status);
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.updatePostStatus(100, {});
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Acceptable',
          category: 'Clarinet',
          status: 'Available'
        });

        let postId = 1;
        let response = await postService.deletePost(dummyUser, postId);

        expect(response).toBe('Deleted successfully');
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error if there is an issue', async () => {
      try {
        let response = await postService.deletePost({}, 100);
        if (response || !response) throw new Error("Didn't throw error");
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
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('filter', () => {
    it('should return all posts of a certain category', async () => {
      try {
        await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Acceptable',
              category: 'Trumpet',
              status: 'Available'
            },
            {
              title: 'Dummy Post3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            }
          ],
          { returning: true }
        );

        let queryCategory = 'Clarinet';
        let response = await postService.filterPosts(queryCategory, null);

        expect(response.length).toEqual(2);
      } catch (error) {
        throw error;
      }
    });
    it('should return all posts of a certain condition', async () => {
      try {
        await Post.bulkCreate(
          [
            {
              title: 'Dummy Post',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            },
            {
              title: 'Dummy Post 2',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Acceptable',
              category: 'Trumpet',
              status: 'Available'
            },
            {
              title: 'Dummy Post3',
              price: 100.0,
              description: 'This is an instrument',
              condition: 'Used - Very Good',
              category: 'Clarinet',
              status: 'Available'
            }
          ],
          { returning: true }
        );
        let queryCondition = 'Used - Very Good';
        let response = await postService.filterPosts(null, queryCondition);

        expect(response.length).toEqual(2);
      } catch (error) {
        throw error;
      }
    });
  });

  describe('getAllConditionNames', () => {
    it('should get all possible post condition names', () => {
      response = postService.getAllConditionNames();
      expect(response.length).toEqual(6);
    });
  });

  describe('getAllCategoryNames', () => {
    it('should get all possible post category names', () => {
      response = postService.getAllCategoryNames();
      expect(response.length).toEqual(83);
    });
  });
});
