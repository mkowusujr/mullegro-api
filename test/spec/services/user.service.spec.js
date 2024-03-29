const userService = require('../../../src/api/services/user.service');

describe('User Service', () => {
  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  let db, User, newUser;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      User = db.users;
      newUser = await User.create({
        name: 'John Doe',
        username: 'fake_user',
        address: 'America',
        email: 'notreal@email.com',
        password: 'safeAndSecurePassword'
      });
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
    } catch (error) {
      throw error;
    }
  });

  describe('createUser', () => {
    it('can create a user', async () => {
      try {
        let userObject = {
          name: 'William Doe',
          username: 'fake_user2',
          address: 'America',
          email: 'williamdoe@email.com',
          password: 'safeAndSecurePassword'
        };

        let response = await userService.createUser(userObject);

        expect(response.name).toBe(userObject.name);
        expect(response.username).toBe(userObject.username);
        expect(response.address).toBe(userObject.address);
        expect(response.email).toBe(userObject.email);
        expect(response.password).toBeTruthy();
        expect(response.password).not.toBe(userObject.password);
      } catch (error) {
        throw error;
      }
    });
    it("doesn't allow duplicate usernames in the database", async () => {
      try {
        let userObject = {
          name: 'John Doe Jr',
          username: 'fake_user',
          address: 'America',
          email: 'notreal@email.com',
          password: 'safeAndSecurePassword'
        };

        let response = await userService.createUser(userObject);
        if (!response || response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
    it("doesn't allow duplicate emails in the database", async () => {
      try {
        let userObject = {
          name: 'John Doe Jr',
          username: 'fake_user2423',
          address: 'America',
          email: 'notreal@email.com',
          password: 'safeAndSecurePassword'
        };

        let response = await userService.createUser(userObject);
        if (!response || response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getUserById', () => {
    it('fetches a user from the database', async () => {
      try {
        let userId = 1;

        let response = await userService.getUserById(userId);

        expect(response.id).toEqual(userId);
        expect(response.name).toEqual(newUser.name);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let userId = 12;
        let response = await userService.getUserById(userId);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getUserByEmail', () => {
    it('fetches a user from the database', async () => {
      try {
        let userEmail = 'notreal@email.com';

        let response = await userService.getUserByEmail(userEmail);

        expect(response.email).toEqual(userEmail);
        expect(response.name).toEqual(newUser.name);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let userEmail = 'notreal2@email.com';
        let response = await userService.getUserByEmail(userEmail);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getUserByUsername', () => {
    it('fetches a user from the database', async () => {
      try {
        let userUsername = 'fake_user';

        let response = await userService.getUserByUsername(userUsername);

        expect(response.username).toEqual(userUsername);
        expect(response.name).toEqual(newUser.name);
      } catch (error) {
        throw error;
      }
    });
    it("throws an error if the username doesn't exist", async () => {
      try {
        let userUsername = 'fake_user3';
        let response = await userService.getUserByUsername(userUsername);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
    it('throws an error if nothing is passed in', async () => {
      try {
        let response = await userService.getUserByUsername();
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getUser', () => {
    it('can fetch a user by email', async () => {
      try {
        let userEmail = 'notreal@email.com';
        let response = await userService.getUser(userEmail);

        expect(response.email).toEqual(userEmail);
      } catch (error) {
        throw error;
      }
    });
    it('can fetch a user by username', async () => {
      try {
        let userUsername = 'fake_user';
        let response = await userService.getUser(userUsername);

        expect(response.username).toEqual(userUsername);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if nothing is passed in', async () => {
      try {
        let response = await userService.getUser();
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user from the http response', async () => {
      try {
        let res = { locals: { user: newUser } };

        let response = await userService.getCurrentUser(res);
        expect(response.id).toEqual(newUser.id);
        expect(response.name).toEqual(newUser.name);
        expect(response.email).toEqual(newUser.email);
        expect(response.username).toEqual(newUser.username);
      } catch (error) {
        throw error;
      }
    });
    it("throws an error if the username doesn't exist", async () => {
      try {
        let res = {};
        let response = await userService.getCurrentUser(res);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getAuthorizedUser', () => {
    it('should get the authorized user', async () => {
      try {
        let userObject = {
          name: 'William Doe',
          username: 'fake_user2',
          address: 'America',
          email: 'williamdoe@email.com',
          password: 'safeAndSecurePassword'
        };
        let dummyUser = await userService.createUser(userObject);

        let loginObject = {
          emailOrUsername: dummyUser.username,
          password: userObject.password
        };

        let response = await userService.getAuthorizedUser(loginObject);
        expect(response.name).toBe(dummyUser.name);
        expect(response.username).toBe(dummyUser.username);
        expect(response.address).toBe(dummyUser.address);
        expect(response.email).toBe(dummyUser.email);
      } catch (error) {
        throw error;
      }
    });
    it('should throw an error in the input password is incorrect', async () => {
      try {
        let userObject = {
          name: 'William Doe',
          username: 'fake_user2',
          address: 'America',
          email: 'williamdoe@email.com',
          password: 'safeAndSecurePassword'
        };
        let dummyUser = await userService.createUser(userObject);
        let loginObject = {
          emailOrUsername: dummyUser.username,
          password: 'incorrectPassword'
        };
        let response = await userService.getAuthorizedUser(loginObject);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('can fetch all the users in the database', async () => {
      try {
        newUser2 = await User.create({
          name: 'Jessica Doe',
          username: 'not_real_user',
          address: 'America',
          email: 'fake@email.com',
          password: 'safeAndSecurePassword'
        });

        let response = await userService.findAll();

        expect(response.length).toEqual(2);
      } catch (error) {
        throw error;
      }
    });
    it('can search for the users by username', async () => {
      try {
        newUser2 = await User.create({
          name: 'Jessica Doe',
          username: 'jenny_is_cool',
          address: 'America',
          email: 'fake@email.com',
          password: 'safeAndSecurePassword'
        });

        let response = await userService.findAll('jenny');

        expect(response.length).toEqual(1);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        jest
          .spyOn(userService, 'findAll')
          .mockReturnValue(Promise.reject('Error'));
        let response = await userService.findAll();
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(typeof error).toBe("string");
      }
    });
  });

  describe('deleteUser', () => {
    it('delete a user', async () => {
      try {
        let response = await userService.deleteUser(newUser.username);
        let allUsers = await userService.findAll();
        
        expect(response).toBe('Deleted successfully');
        expect(allUsers.length).toBe(0);
      } catch (error) {
        console.info(JSON.stringify(error))
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let response = await userService.deleteUser('a_fake_username');
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('updateUser', () => {
    it('can update a user', async () => {
      try {
        let userObject = {
          name: 'William Doe',
          username: 'fake_user20',
          address: 'America',
          email: 'williamdoe@email.com',
          password: 'safeAndSecurePassword'
        };

        let response = await userService.updateUser(newUser, userObject);

        expect(response.name).toBe(userObject.name);
        expect(response.username).toBe(userObject.username);
        expect(response.address).toBe(userObject.address);
        expect(response.email).toBe(userObject.email);
        expect(response.password).toBeTruthy();
      } catch (error) {
        throw error;
      }
    });
    it("doesn't allow duplicate usernames in the database", async () => {
      await User.create({
        name: 'John Doe',
        username: 'fake_user2',
        address: 'America',
        email: 'notreal2@email.com',
        password: 'safeAndSecurePassword'
      })
        .then(async () => {
          let userObject = {
            name: 'John Doe Jr',
            username: 'fake_user2',
            address: 'America',
            email: 'notreal@email.com',
            password: 'safeAndSecurePassword'
          };
          let response = await userService.updateUser(newUser, userObject);
          if (!response || response) throw new Error("Didn't throw error");
        })
        .catch(error => {
          expect(console.error).toHaveBeenCalled();
        });
    });
    it("doesn't allow duplicate emails in the database", async () => {
      await User.create({
        name: 'John Doe',
        username: 'fake_user21',
        address: 'America',
        email: 'notreal2@email.com',
        password: 'safeAndSecurePassword'
      })
        .then(async () => {
          let userObject = {
            name: 'John Doe Jr',
            username: 'fake_user',
            address: 'America',
            email: 'notreal2@email.com',
            password: 'safeAndSecurePassword'
          };
          let response = await userService.updateUser(newUser, userObject);
          if (!response || response) throw new Error("Didn't throw error");
        })
        .catch(error => {
          expect(console.error).toHaveBeenCalled();
        });
    });
  });
});
