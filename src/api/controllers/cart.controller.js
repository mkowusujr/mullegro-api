const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const userService = require('../services/user.service');
const cartService = require('../services/cart.service');

/**
 * @swagger
 * /api/cart:
 *    get:
 *      tags: ['Cart Controller']
 *      summary: Gets current user's cart
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Cart'
 *        400:
 *          description: Error getting user's cart
 */
router.get('', auth.verifyToken, async (req, res) => {
  try {
    let cartItems = await cartService.getCart(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(cartItems);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @swagger
 * /api/cart:
 *    post:
 *      tags: ['Cart Controller']
 *      summary: Adds the post to the current user's cart
 *      requestBody:
 *        description: The post to add to the cart
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      responses:
 *        200:
 *          description: Successfully added post to cart
 *        400:
 *          description: Error adding to the user's cart
 */
router.post('', auth.verifyToken, async (req, res) => {
  try {
    let postId = req.body.id;
    let response = await cartService.addToCart(
      await userService.getCurrentUser(res),
      postId
    );
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @swagger
 * /api/cart:
 *    delete:
 *      tags: ['Cart Controller']
 *      summary: Clears the current user's cart
 *      responses:
 *        200:
 *          description: Successfully cleared the cart
 *        400:
 *          description: Error clearing the user's cart
 */
router.delete('', auth.verifyToken, async (req, res) => {
  try {
    let response = await cartService.clearCart(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @swagger
 * /api/cart/post/{id}:
 *    delete:
 *      tags: ['Cart Controller']
 *      summary: Removes the post to the current user's cart
 *      parameters:
 *        - $ref: '#/components/parameters/postIdParam'
 *      responses:
 *        200:
 *          description: Successfully removed post to cart
 *        400:
 *          description: Error removing post from the user's cart
 */
router.delete('/post/:id', auth.verifyToken, async (req, res) => {
  try {
    let postId = req.params.id;

    let response = await cartService.removeFromCart(
      await userService.getCurrentUser(res),
      postId
    );
    return res.status(200).send(response);
  } catch (error) {
    return res.status(404).send(error);
  }
});

module.exports = router;
