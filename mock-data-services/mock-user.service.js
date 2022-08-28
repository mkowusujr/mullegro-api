const { faker } = require('@faker-js/faker');
const userService = require('../src/api/services/user.service');

exports.createMockUsers = async amount => {
  let users = [];
  for (let i = 0; i < amount; i++) {
    let user = await userService.createUser({
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      password: faker.internet.password(20)
    });

    users.push(user);
  }
  return users;
};
