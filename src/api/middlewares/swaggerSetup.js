const swaggerJSDoc = require('swagger-jsdoc');

const createUserSchemaProperties = {
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

const userSchemaProperties = {
  id: {
    type: 'number',
    example: 1
  },
  name: {
    type: 'string',
    example: 'jane doe'
  },
  email: {
    type: 'string',
    example: 'jane.doe@example.com'
  },
  username: {
    type: 'string',
    example: 'jane.doe'
  },
  address: {
    type: 'string',
    example: 'somewhere 1234 dr'
  },
  password: {
    type: 'string',
    example: 'goodPassword'
  },
  bio: {
    type: 'string',
    example: 'A short paragraph about this user'
  },
  profile_picture: {
    type: 'string',
    example: 'imageUrl'
  }
};

const loginInputSchemaProperties = {
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
};

const postSchemaProperties = {
  id: {
    type: 'number',
    example: 1
  },
  title: {
    type: 'string',
    example: 'Navy Blue Clarinet'
  },
  price: {
    type: 'number',
    example: '120.00'
  },
  description: {
    type: 'string',
    example: 'This is a clean Navy Blue Clarinet'
  },
  condition: {
    type: 'string',
    example: 'Like New'
  },
  address: {
    type: 'string',
    example: 'The USA'
  },
  category: {
    type: 'string',
    example: 'Clarinet'
  },
  status: {
    type: 'string',
    example: 'Not Sold'
  },
  display_picture: {
    type: 'string',
    example: 'Image url'
  }
};

const cartSchemaProperties = {
  totalAmount: {
    type: 'number',
    example: 2000.0
  },
  itemCount: {
    type: 'number',
    example: 2
  },
  posts: {
    type: 'array',
    items: { $ref: '#/components/schemas/Post' }
  }
};

const transactionSchemaProperties = {
  id: {
    type: 'number',
    example: 1
  },
  dateString: {
    type: 'string',
    example: '09/21/2022'
  },
  totalAmount: {
    type: 'number',
    example: 2000.0
  },
  itemCount: {
    type: 'number',
    example: 2
  },
  posts: {
    type: 'array',
    items: { $ref: '#/components/schemas/Post' }
  }
};

const schemas = {
  CreateUser: {
    type: 'object',
    description: 'Data object for creating a user',
    properties: createUserSchemaProperties
  },
  User: {
    type: 'object',
    description: 'Data object for a user',
    properties: userSchemaProperties
  },
  Users: {
    type: 'array',
    description: 'List of user data objects',
    items: { $ref: '#/components/schemas/User' }
  },
  LoginInput: {
    type: 'object',
    description: 'The login form data',
    properties: loginInputSchemaProperties
  },
  Post: {
    type: 'object',
    description: 'Data object for a post',
    properties: postSchemaProperties
  },
  Posts: {
    type: 'array',
    description: 'List of post data objects',
    items: { $ref: '#/components/schemas/Post' }
  },
  Cart: {
    type: 'object',
    description: 'Data object for a cart',
    properties: cartSchemaProperties
  },
  Transaction: {
    type: 'object',
    description: 'Data object for a transaction',
    properties: transactionSchemaProperties
  },
  Transactions: {
    type: 'array',
    description: 'List of transaction data objects',
    items: { $ref: '#/components/schemas/Transaction' }
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

const security = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
};

const components = {
  schemas: schemas,
  parameters: parameters,
  security: security
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
