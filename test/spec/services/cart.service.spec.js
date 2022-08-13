const cartService = require('../../../src/api/services/cart.service');
const userService = require('../../../src/api/services/user.service');
const postService = require('../../../src/api/services/post.service');
const cart = require('../../../src/api/models/cart');

describe('Cart Service', () => {
  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  let db, Cart, User, Post, dummyUser, dummyUserCart;

  beforeEach(async () => {
    db = require('../../../src/api/models/index');
    Cart = db.carts;
    User = db.users;
    Post = db.posts;
    await db.sequelize.sync({ force: true });
    spyOn(console, 'error');

    dummyUser = await User.create({
      name: 'Dummy User',
      address: 'USA',
      username: 'dummy_username',
      email: 'dummay@email.com'
    });
    await cartService.createCart(dummyUser);
    dummyUserCart = await dummyUser.getCart();
  });

  describe('createCart', () => {
    it('creates a cart for a user', async () => {
      let dummyUser2 = await User.create({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username2',
        email: 'dummay2@email.com'
      });

      let response = await cartService.createCart(dummyUser2);
      let cart = await Cart.findByPk(2);

      expect(cart.userId).toBe(dummyUser2.id);
      expect(response).toBe('Created cart successfully');
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyUser = {};
        let response = await cartService.createCart(dummyUser);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('addToCart', () => {
    it('adds one item to the cart', async () => {
      try {
        let post = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let postId = 1;

        await cartService.addToCart(dummyUser, postId);

        expect(post.cartId).toBe(dummyUser.cartId);
        expect(console.error).not.toHaveBeenCalled();
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let postId = 1;

        await cartService.addToCart(dummyUser, postId);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('removeFromCart', () => {
    it('removes one item from the cart', async () => {
      try {
        let post = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let postId = 1;
        await cartService.addToCart(dummyUser, postId);

        await cartService.removeFromCart(dummyUser, postId);

        expect(await dummyUserCart.getPosts()).toEqual([]);
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let postId = 1;

        await cartService.removeFromCart(dummyUser, postId);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getCartItems', () => {
    it('gets all the items in the cart', async () => {
      try {
        let post = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let post2 = await Post.create({
          title: 'Dummy Post2',
          price: 100.0,
          description: 'This is an instrument too',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let postId1 = 1,
          postId2 = 2;
        await cartService.addToCart(dummyUser, postId1);
        await cartService.addToCart(dummyUser, postId2);

        let response = await cartService.getCartItems(dummyUser);

        expect(response.length).toEqual(2);
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyUser2 = {};
        let response = await cartService.getCartItems(dummyUser2);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('clearCart', () => {
    it('removes all the items in the cart', async () => {
      try {
        let post = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let post2 = await Post.create({
          title: 'Dummy Post2',
          price: 100.0,
          description: 'This is an instrument too',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let postId1 = 1,
          postId2 = 2;
        await cartService.addToCart(dummyUser, postId1);
        await cartService.addToCart(dummyUser, postId2);

        let response = await cartService.clearCart(dummyUser);

        expect(response).toBe('Successfully cleared cart');
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyUser2 = {};
        let response = await cartService.clearCart(dummyUser2);
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
