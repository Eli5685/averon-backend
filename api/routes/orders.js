const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// GET /api/orders - Получить все заказы
router.get('/', ordersController.getAllOrders);

// GET /api/orders/stats - Получить статистику заказов
router.get('/stats', ordersController.getOrdersStats);

// GET /api/orders/:id - Получить заказ по ID
router.get('/:id', ordersController.getOrderById);

// GET /api/orders/user/:userId - Получить заказы пользователя
router.get('/user/:userId', ordersController.getUserOrders);

// POST /api/orders - Создать новый заказ
router.post('/', ordersController.createOrder);

// PUT /api/orders/:id/status - Обновить статус заказа
router.put('/:id/status', ordersController.updateOrderStatus);

module.exports = router;
