const swaggerJSDoc = require('swagger-jsdoc');

/*CREATE USER SCHEMA*/
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

/*USER SCHEMA*/
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

/*LOGIN SCHEMA*/
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

/*POST SCHEMA*/
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
  category: {
    type: 'string',
    example: 'Clarinet'
  },
  status: {
    type: 'string',
    example: 'Available'
  },
  display_picture: {
    type: 'string',
    example: 'Image url'
  }
};

/*CART SCHEMA*/
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

/*TRANSACTION SCHEMA*/
const transactionSchemaProperties = {
  id: {
    type: 'number',
    example: 1
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

/*REVIEW SCHEMA*/
const reviewSchemaProperties = {
  id: {
    type: 'number',
    example: 1
  },
  rating: {
    type: 'number',
    example: 4.5
  },
  description: {
    type: 'string',
    example: 'This is in good condition'
  },
  userId: {
    type: 'number',
    example: 1
  },
  post: {
    type: 'number',
    example: 1
  }
};

/*FILTER OPTIONS SCHEMA*/
const filterOptionsSchemaProperties = {
  options: {
    type: 'array',
    items: {
      optionName: {
        type: 'string',
        example: 'Specific '
      }
    }
  }
};

/*DEFINING THE SCHEMAS*/
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
  },
  Review: {
    type: 'object',
    description: 'Data object for a review',
    properties: reviewSchemaProperties
  },
  FilterOptions: {
    type: 'object',
    description: 'Data object containing a list of filter options',
    properties: filterOptionsSchemaProperties
  }
};

/*BASE ID PARAM TEMPLATE*/
const baseIdParam = {
  in: 'path',
  type: 'number',
  required: true
};

/*BASE QUERY PARAM TEMPLATE*/
const baseQueryParam = {
  in: 'query',
  type: 'string',
  required: false
};

/*DEFINING THE PARAMETERS*/
const parameters = {
  userIdParam: {
    ...baseIdParam,
    description: 'Id of the user to get',
    name: 'User Id'
  },
  usernameParam: {
    in: 'path',
    name: 'username',
    type: 'string',
    required: true,
    description: 'Username of the user to get'
  },
  postIdParam: {
    ...baseIdParam,
    description: 'Id of post to get',
    name: 'Post Id'
  },
  transactionIdParam: {
    ...baseIdParam,
    description: 'Id of transaction to get',
    name: 'Transaction Id'
  },
  reviewIdParam: {
    ...baseIdParam,
    description: 'Id of the review to get',
    name: 'Review Id'
  },
  searchQuery: {
    ...baseQueryParam,
    description: 'The search term',
    name: 'Search Query',
    required: true
  },
  categoryQuery: {
    ...baseQueryParam,
    description: 'The category filter',
    name: 'Category Query'
  },
  conditionQuery: {
    ...baseQueryParam,
    description: 'The condition filter',
    name: 'Condition Query'
  }
};

/*DEFINING THE SECURITY*/
const security = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
};

/*DEFINING THE COMPONENTS*/
const components = {
  schemas: schemas,
  parameters: parameters,
  security: security
};

/*DEFINING THE SWAGGER DEFINITION*/
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mullegro API',
    version: '1.0.0',
    description: 'This is a REST API application made with Express.'
  },
  components: components
};

/*SETTING UP THE SWAGGER OPTIONS*/
const swaggerOptions = {
  defaultModelsExpandDepth: -1,
  swaggerDefinition,
  apis: [
    './src/api/controllers/user.controller.js',
    './src/api/controllers/post.controller.js',
    './src/api/controllers/cart.controller.js',
    './src/api/controllers/transaction.controller.js',
    './src/api/controllers/review.controller.js'
  ]
};

/*EXPORT THE SWAGGER DOCS SETUP*/
module.exports = swaggerJSDoc(swaggerOptions);
