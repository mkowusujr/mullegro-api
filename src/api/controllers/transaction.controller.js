const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const transactionService = require('../services/transaction.service');
const userService = require('../services/user.service');

/**
 * @swagger
 * /api/transactions:
 *    post:
 *      tags: ['Transaction Controller']
 *      description: Add a new transaction
 *      responses:
 *        200:
 *          description: Success
 */
router.post('', auth.verifyToken, async (req, res) => {
  try {
    let transaction = await transactionService.addToTransactions(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 *
 */
router.get('', auth.verifyToken, async (req, res) => {
  try {
    let transaction = await transactionService.getFullTransactionHistory(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 *
 */
router.get(
  '/transaction/:transactionId',
  auth.verifyToken,
  async (req, res) => {
    try {
      let transactionId = req.params.transactionId;
      let transaction = await transactionService.getTransaction(transactionId);
      return res.status(200).send(transaction);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
);

module.exports = router;
