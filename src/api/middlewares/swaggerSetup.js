const swaggerJSDoc = require('swagger-jsdoc');

const userSchemaProperties = {
  name: {
    type: 'string',
    example: 'jane doe',
    required: true
  },
  email: {
    type: 'string',
    example: 'jane.doe@example.com',
    required: true
  },
  username: {
    type: 'string',
    example: 'jane.doe',
    required: true
  },
  address: {
    type: 'string',
    example: 'somewhere 1234 dr',
    required: true
  },
  password: {
    type: 'string',
    example: 'goodPassword',
    required: true
  }
};

const schemas = {
  User: {
    type: Object,
    description: 'Data object for a user',
    properties: userSchemaProperties
  },
  Users: {
    type: Array,
    items: {
      $ref: '#/components/schemas/User'
    }
  },
  LoginInput: {
    type: Object,
    properties: {
      emailOrUsername: {
        type: 'string',
        example: 'jane.doe@example.com ',
        required: true
      },
      password: {
        type: 'string',
        example: 'goodPassword',
        required: true
      }
    }
  }
};

const parameters = {
  userIdParam: {
    in: 'path',
    name: 'id',
    type: 'number',
    required: true,
    description: 'Id of the user to get'
  },
  usernameParam: {
    in: 'path',
    name: 'username',
    type: 'string',
    required: true,
    description: 'Username of the user to get'
  },
  searchUserParam: {
    in: 'query',
    name: 'username',
    type: 'string',
    required: true,
    description: 'The search query to look for users with'
  }
};

const components = {
  schemas: schemas,
  parameters: parameters
};

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mullegro API',
    version: '1.0.0',
    description: 'This is a REST API application made with Express.'
  },
  components: components
};

const swaggerOptions = {
  defaultModelsExpandDepth: -1,
  swaggerDefinition,
  apis: [
    './src/api/controllers/user.controller.js',
    './src/api/controllers/post.controller.js',
    './src/api/controllers/cart.controller.js',
    './src/api/controllers/transaction.controller.js'
  ]
};

module.exports = swaggerJSDoc(swaggerOptions);
