const { faker } = require('@faker-js/faker');
const userService = require('../src/api/services/user.service');

exports.createMockUsers = async amount => {
  let users = [];
  for (let i = 0; i < amount; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();

    let user = await userService.createUser({
      name: `${firstName} ${lastName}`,
      username: faker.internet.userName(firstName, lastName),
      email: faker.internet.email(firstName, lastName),
      address: faker.address.streetAddress(),
      password: faker.internet.password(20),
      bio: faker.lorem.sentences(),
      profile_picture: faker.image.cats(500, 500, true)
    });

    users.push(user);
  }
  return users;
};
