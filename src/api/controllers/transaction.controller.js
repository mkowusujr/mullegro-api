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
 *      summary: Add a new transaction to the transaction history
 *      responses:
 *        200:
 *          description: Successfully added transaction to the transaction history
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Transaction'
 *        400: 
 *          description: Error adding transaction
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
 * @swagger
 * /api/transactions:
 *    get:
 *      tags: ['Transaction Controller']
 *      summary: Gets the user's transaction history
 *      responses:
 *        200:
 *          description: Successfully fetched current user's transaction history
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Transactions'
 *        400: 
 *          description: Error getting transaction history
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
 * @swagger
 * /api/transactions/transaction/{transactionId}:
 *    get:
 *      tags: ['Transaction Controller']
 *      summary: Gets a transaction from the current user's transaction history
 *      parameters:
 *        - $ref: '#/components/parameters/transactionIdParam'
 *      responses:
 *        200:
 *          description: Successfully fetched transaction from the transaction history
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Transaction'
 *        400:
 *          description: Error getting transaction
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
