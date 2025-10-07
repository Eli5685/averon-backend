const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/dashboard - Получить общую статистику для дашборда
router.get('/dashboard', analyticsController.getDashboardStats);

// GET /api/analytics/sales - Получить статистику продаж по дням
router.get('/sales', analyticsController.getSalesChart);

// GET /api/analytics/products/top - Получить топ продуктов
router.get('/products/top', analyticsController.getTopProducts);

// GET /api/analytics/categories - Получить статистику по категориям
router.get('/categories', analyticsController.getCategoryStats);

// GET /api/analytics/users - Получить статистику пользователей
router.get('/users', analyticsController.getUserStats);

module.exports = router;
