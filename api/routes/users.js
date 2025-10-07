const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// GET /api/users - Получить всех пользователей
router.get('/', usersController.getAllUsers);

// GET /api/users/:id - Получить пользователя по ID
router.get('/:id', usersController.getUserById);

// GET /api/users/:userId/cart - Получить корзину пользователя
router.get('/:userId/cart', usersController.getUserCart);

// POST /api/users/cart - Добавить товар в корзину
router.post('/cart', usersController.addToCart);

// PUT /api/users/cart/:cartId - Обновить товар в корзине
router.put('/cart/:cartId', usersController.updateCartItem);

// DELETE /api/users/cart/:cartId - Удалить товар из корзины
router.delete('/cart/:cartId', usersController.removeFromCart);

// DELETE /api/users/:userId/cart - Очистить корзину пользователя
router.delete('/:userId/cart', usersController.clearCart);

module.exports = router;
