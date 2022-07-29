const userService = require("../../../src/api/services/user.service");

describe("User Service", () => {
  it("should be created", () => {
    expect(userService).toBeTruthy();
  });

  let db;
  let User;
  let newUser;

  beforeEach(async () => {
    db = require("../../../src/api/models/index");
    await db.sequelize.sync({ force: true });
    User = db.users;
    newUser = await User.create({
      name: "John Doe",
      username: "fake_user",
      address: "America",
      email: "notreal@email.com",
      password: "safeAndSecurePassword",
    });
    spyOn(console, "error");
  });

  describe("createUser", () => {
    it("can create a user", async () => {
      let userObject = {
        name: "William Doe",
        username: "fake_user2",
        address: "America",
        email: "williamdoe@email.com",
        password: "safeAndSecurePassword",
      };

      let response = await userService.createUser(userObject);

      expect(response.name).toBe(userObject.name);
      expect(response.username).toBe(userObject.username);
      expect(response.address).toBe(userObject.address);
      expect(response.email).toBe(userObject.email);
      expect(response.password).toBeTruthy();
      expect(response.password).not.toBe(userObject.password);
    });
    it("doesn't allow duplicate usernames in the database", async () => {
      try {
        let userObject = {
          name: "John Doe Jr",
          username: "fake_user",
          address: "America",
          email: "notreal@email.com",
          password: "safeAndSecurePassword",
        };

        let response = await userService.createUser(userObject);
        if (!response || response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
    it("doesn't allow duplicate emails in the database", async () => {
      try {
        let userObject = {
          name: "John Doe Jr",
          username: "fake_user2423",
          address: "America",
          email: "notreal@email.com",
          password: "safeAndSecurePassword",
        };

        let response = await userService.createUser(userObject);
        if (!response || response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("getUserById", () => {
    it("fetches a user from the database", async () => {
      let userId = 1;

      let response = await userService.getUserById(userId);

      expect(response.id).toEqual(userId);
      expect(response.name).toEqual(newUser.name);
    });
    it("throws an error if there is an issue", async () => {
      try {
        let userId = 12;
        let response = await userService.getUserById(userId);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("getUserByEmail", () => {
    it("fetches a user from the database", async () => {
      let userEmail = "notreal@email.com";

      let response = await userService.getUserByEmail(userEmail);

      expect(response.email).toEqual(userEmail);
      expect(response.name).toEqual(newUser.name);
    });
    it("throws an error if there is an issue", async () => {
      try {
        let userEmail = "notreal2@email.com";
        let response = await userService.getUserByEmail(userEmail);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("getUserByUsername", () => {
    it("fetches a user from the database", async () => {
      let userUsername = "fake_user";

      let response = await userService.getUserByUsername(userUsername);

      expect(response.username).toEqual(userUsername);
      expect(response.name).toEqual(newUser.name);
    });
    it("throws an error if the username doesn't exist", async () => {
      try {
        let userUsername = "fake_user3";
        let response = await userService.getUserByUsername(userUsername);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
    it("throws an error if nothing is passed in", async () => {
      try {
        let response = await userService.getUserByUsername();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("getUser", () => {
    it("can fetch a user by email", async () => {
      let userEmail = "notreal@email.com";
      let response = await userService.getUser(userEmail);

      expect(response.email).toEqual(userEmail);
    });
    it("can fetch a user by username", async () => {
      let userUsername = "fake_user";
      let response = await userService.getUser(userUsername);

      expect(response.username).toEqual(userUsername);
    });
    it("throws an error if nothing is passed in", async () => {
      try {
        let response = await userService.getUser();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("getCurrentUser", () => {
    it("should get the current user from the http response", async () => {
      let res = { locals: { user: newUser } };

      let response = await userService.getCurrentUser(res);
      expect(response.id).toEqual(newUser.id);
      expect(response.name).toEqual(newUser.name);
      expect(response.email).toEqual(newUser.email);
      expect(response.username).toEqual(newUser.username);
    });
    it("throws an error if the isername doesn't exist", async () => {
      try {
        let res = {};
        let response = await userService.getCurrentUser(res);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe("findAll", () => {
    it("can fetch all the users in the database", async () => {
      newUser2 = await User.create({
        name: "Jessica Doe",
        username: "not_real_user",
        address: "America",
        email: "fake@email.com",
        password: "safeAndSecurePassword",
      });

      let response = await userService.findAll();

      expect(response.length).toEqual(2);
    });
    it("throws an error if there is an issue", async () => {
      try {
        spyOn(userService, "findAll").and.returnValue(Promise.reject("Error"));
        let response = await userService.findAll();
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(error).toEqual(jasmine.any(String));
      }
    });
  });

  describe("deleteUser", () => {
    it("delete a user", async () => {
      let response = await userService.deleteUser(newUser);
      let allUsers = await userService.findAll().catch();

      expect(response).toBe("Deleted successfully");
      expect(allUsers.length).toBe(0);
    });
    it("throws an error if there is an issue", async () => {
      try {
        let response = await userService.deleteUser({});
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
