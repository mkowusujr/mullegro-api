const { faker } = require('@faker-js/faker');
const { readFileSync } = require('fs');
const postService = require('../src/api/services/post.service');

getInstrumentsList = () => {
  const filename = './mock-data-services/instruments-list.txt';
  const contents = readFileSync(filename, 'utf-8');
  let instrumentsList = JSON.parse(contents);
  return instrumentsList;
};

getRandomInt = max => {
  return Math.floor(Math.random() * max);
};

randomTitlePrefix = () => {
  return `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}`;
};

randomCondition = () => {
  const conditionOptions = [
    'New',
    'Renewed',
    'Used - Like New',
    'Used - Very Good',
    'Used - Good',
    'Used - Acceptable'
  ];
  randomIndex = getRandomInt(conditionOptions.length);
  return conditionOptions[randomIndex];
};

randomType = () => {
  const typeOptions = getInstrumentsList();
  randomIndex = getRandomInt(typeOptions.length);
  return typeOptions[randomIndex];
};

exports.createPosts = async users => {
  let minPrice = 60;
  let maxPrice = 2000;

  users.forEach(async user => {
    maxAmountOfPostPerUser = getRandomInt(10);
    instrumentType = randomType();

    for (let i = 0; i < maxAmountOfPostPerUser; i++) {
      await postService.createNewPost(user, {
        title: `${randomTitlePrefix()} ${instrumentType}`,
        price: faker.commerce.price(minPrice, maxPrice),
        description: '',
        condition: randomCondition(),
        address: user.address,
        type: instrumentType,
        status: 'Available'
      });
    }
  });
};
