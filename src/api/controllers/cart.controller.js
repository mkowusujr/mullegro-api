const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const userService = require('../services/user.service');
const cartService = require('../services/cart.service');

/**
 *
 */
router.get('', auth.verifyToken, async (req, res) => {
  try {
    let cartItems = await cartService.getCartItems(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(cartItems);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 *
 */
router.post('', auth.verifyToken, async (req, res) => {
  try {
    let postId = req.body.postId;
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
 *
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
 *
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
