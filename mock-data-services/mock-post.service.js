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
  let min = 0;
  return Math.floor(Math.random() * (max - min));
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
  randomIndex = getRandomInt(conditionOptions.length - 1);
  return conditionOptions[randomIndex];
};

randomCategory = () => {
  const typeOptions = getInstrumentsList();
  randomIndex = getRandomInt(typeOptions.length - 1);
  return typeOptions[randomIndex];
};

exports.createPosts = async users => {
  let minPrice = 60;
  let maxPrice = 2000;

  users.forEach(async user => {
    let maxAmountOfPostPerUser = getRandomInt(10);

    for (let i = 0; i < maxAmountOfPostPerUser; i++) {
      let instrumentType = randomCategory();
      await postService.createNewPost(user, {
        title: `${randomTitlePrefix()} ${instrumentType}`,
        price: faker.commerce.price(minPrice, maxPrice),
        description: faker.lorem.sentences(),
        condition: randomCondition(),
        category: instrumentType,
        status: 'Available',
        displayPicture: faker.image.cats(500, 500, true)
      });
    }
  });
};
