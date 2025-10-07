const supabase = require('../../config/supabase');

const productsController = {
  // Получить все продукты
  async getAllProducts(req, res) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products'
      });
    }
  },

  // Получить продукт по ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product'
      });
    }
  },

  // Поиск продуктов
  async searchProducts(req, res) {
    try {
      const { q, category } = req.query;
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }

      if (category && category !== 'Все') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search products'
      });
    }
  },

  // Получить продукты по категории
  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products by category'
      });
    }
  },

  // Создать новый продукт
  async createProduct(req, res) {
    try {
      const productData = req.body;
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create product'
      });
    }
  },

  // Обновить продукт
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update product'
      });
    }
  },

  // Удалить продукт (мягкое удаление)
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete product'
      });
    }
  }
};

module.exports = productsController;
