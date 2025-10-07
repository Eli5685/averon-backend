const supabase = require('../../config/supabase');

const usersController = {
  // Получить всех пользователей
  async getAllUsers(req, res) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  },

  // Получить пользователя по ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  },

  // Получить корзину пользователя
  async getUserCart(req, res) {
    try {
      const { userId } = req.params;
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (
            id,
            name,
            price,
            photos
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Error fetching user cart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user cart'
      });
    }
  },

  // Добавить товар в корзину
  async addToCart(req, res) {
    try {
      const { userId, productId, quantity = 1, sizes = [] } = req.body;

      // Проверяем, есть ли уже этот товар в корзине
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingItem) {
        // Обновляем количество
        const { data, error } = await supabase
          .from('cart')
          .update({ 
            quantity: existingItem.quantity + quantity,
            sizes: sizes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('cart')
          .insert([{
            user_id: userId,
            product_id: productId,
            quantity: quantity,
            sizes: sizes
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add to cart'
      });
    }
  },

  // Обновить количество товара в корзине
  async updateCartItem(req, res) {
    try {
      const { cartId } = req.params;
      const { quantity, sizes } = req.body;

      const { data, error } = await supabase
        .from('cart')
        .update({ 
          quantity: quantity,
          sizes: sizes,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update cart item'
      });
    }
  },

  // Удалить товар из корзины
  async removeFromCart(req, res) {
    try {
      const { cartId } = req.params;

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove from cart'
      });
    }
  },

  // Очистить корзину пользователя
  async clearCart(req, res) {
    try {
      const { userId } = req.params;

      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cart'
      });
    }
  }
};

module.exports = usersController;
