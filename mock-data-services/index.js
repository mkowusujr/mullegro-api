const MockUserService = require('./mock-user.service');
const MockPostService = require('./mock-post.service');

exports.createMockData = async () => {
  let users = await MockUserService.createMockUsers(10);
  await MockPostService.createPosts(users);
};
