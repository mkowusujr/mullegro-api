const cartService = require('../../../src/api/services/cart.service');
// const userService = require('../../../src/api/services/user.service');
// const postService = require('../../../src/api/services/post.service');

describe('Cart Service', () => {
    it('should be created', () => {
      expect(cartService).toBeTruthy();
    });

    let db, Cart, User, Post;

    beforeEach(async () => {
        db = require('../../../src/api/models/index');
        Cart = db.carts;
        User = db.users;
        Post = db.posts;
        await db.sequelize.sync({ force: true });
        spyOn(console, 'error');
    });

    describe('createCart', () => {
        it('creates a cart for a user', async () => {
            let dummyUser = await User.create({
                name: 'Dummy User',
                address: 'USA',
                username: 'dummy_username',
                email: 'dummay@email.com'
            });

            let response = await cartService.createCart(dummyUser);
            expect(response).toBe('Cart created successfully');
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
            pending()
        });
        it('throws an error if there is an issue', async () => {
            pending()
        });
    });

    describe('removeFromCart', () => {
        it('removes one item from the cart', async () => {
            pending()
        });
        it('throws an error if there is an issue', async () => {
            pending()
        });
    });

    describe('getCartItems', () => {
        it('gets all the items in the cart', async () => {
            pending()
        });
        it('throws an error if there is an issue', async () => {
            pending()
        });
    });

    describe('clearCart', () => {
        it('removes all the items in the cart', async () => {
            pending()
        });
        it('throws an error if there is an issue', async () => {
            pending()
        });
    });
});