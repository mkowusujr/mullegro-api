const cartService = require('../../../src/api/services/cart.service');

describe('Cart Service', () => {
  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  let db, Cart, User, Post, dummyUser, dummyUserCart;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      Cart = db.carts;
      User = db.users;
      Post = db.posts;
      jest.spyOn(console, 'error').mockImplementation(jest.fn());;

      dummyUser = await User.create({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com'
      });
      await cartService.createCart(dummyUser);
      dummyUserCart = await dummyUser.getCart();
    } catch (error) {
      throw error;
    }
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
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId = 1;

        await cartService.addToCart(dummyUser, postId);

        expect(post.cartId).toBe(dummyUser.cartId);
        expect(console.error).not.toHaveBeenCalled();
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let postId = 1;

        await cartService.addToCart(dummyUser, postId);
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId = 1;
        await cartService.addToCart(dummyUser, postId);

        await cartService.removeFromCart(dummyUser, postId);
        let cartItems = await dummyUserCart.getPosts();
        expect(cartItems.length).toBe(0);

        let oldPost = await Post.findByPk(postId);

        expect(oldPost).toBeTruthy();
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let postId = 1;

        await cartService.removeFromCart(dummyUser, postId);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('getCart', () => {
    it("gets current users' cart", async () => {
      try {
        let post = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let post2 = await Post.create({
          title: 'Dummy Post2',
          price: 100.0,
          description: 'This is an instrument too',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId1 = 1,
          postId2 = 2;
        await cartService.addToCart(dummyUser, postId1);
        await cartService.addToCart(dummyUser, postId2);

        let cart = await cartService.getCart(dummyUser);

        expect(cart.itemCount).toEqual(2);
        expect(cart.totalAmount).toEqual(200);
        expect(cart.posts.length).toEqual(2);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyUser2 = {};
        let response = await cartService.getCart(dummyUser2);
        if (response || !response) throw new Error("Didn't throw error");
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
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let post2 = await Post.create({
          title: 'Dummy Post2',
          price: 100.0,
          description: 'This is an instrument too',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        let postId1 = 1,
          postId2 = 2;
        await cartService.addToCart(dummyUser, postId1);
        await cartService.addToCart(dummyUser, postId2);

        let response = await cartService.clearCart(dummyUser);
        let cart = await cartService.getCart(dummyUser);

        expect(response.message).toBe('Successfully cleared cart');
        expect(cart.posts.length).toEqual(0);
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyUser2 = {};
        let response = await cartService.clearCart(dummyUser2);
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
