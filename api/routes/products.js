const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET /api/products - Получить все продукты
router.get('/', productsController.getAllProducts);

// GET /api/products/search - Поиск продуктов
router.get('/search', productsController.searchProducts);

// GET /api/products/category/:category - Получить продукты по категории
router.get('/category/:category', productsController.getProductsByCategory);

// GET /api/products/:id - Получить продукт по ID
router.get('/:id', productsController.getProductById);

// POST /api/products - Создать новый продукт
router.post('/', productsController.createProduct);

// PUT /api/products/:id - Обновить продукт
router.put('/:id', productsController.updateProduct);

// DELETE /api/products/:id - Удалить продукт
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
