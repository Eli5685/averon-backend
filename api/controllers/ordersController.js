const supabase = require('../../config/supabase');

const ordersController = {
  // Получить все заказы
  async getAllOrders(req, res) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders'
      });
    }
  },

  // Получить заказ по ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order'
      });
    }
  },

  // Получить заказы пользователя
  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        count: data ? data.length : 0
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user orders'
      });
    }
  },

  // Создать новый заказ
  async createOrder(req, res) {
    try {
      const { user_id, items, total_amount } = req.body;
      
      // Генерируем номер заказа
      const orderNumber = `AV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const orderData = {
        order_number: orderNumber,
        user_id: user_id,
        status: 'processing',
        total_amount: total_amount,
        items: items,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // Очищаем корзину пользователя после создания заказа
      await supabase
        .from('cart')
        .delete()
        .eq('user_id', user_id);

      res.status(201).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  },

  // Обновить статус заказа
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updateData = {
        status: status,
        updated_at: new Date().toISOString()
      };

      // Если статус "completed", добавляем дату завершения
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update order status'
      });
    }
  },

  // Получить статистику заказов
  async getOrdersStats(req, res) {
    try {
      // Общее количество заказов
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Заказы по статусам
      const { data: statusStats } = await supabase
        .from('orders')
        .select('status')
        .then(({ data }) => {
          const stats = {};
          data?.forEach(order => {
            stats[order.status] = (stats[order.status] || 0) + 1;
          });
          return { data: stats };
        });

      // Общая сумма заказов
      const { data: totalAmountData } = await supabase
        .from('orders')
        .select('total_amount');

      const totalRevenue = totalAmountData?.reduce((sum, order) => 
        sum + (parseFloat(order.total_amount) || 0), 0) || 0;

      // Заказы за последние 30 дней
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      res.json({
        success: true,
        data: {
          totalOrders: totalOrders || 0,
          statusStats: statusStats || {},
          totalRevenue: totalRevenue,
          recentOrders: recentOrders || 0
        }
      });
    } catch (error) {
      console.error('Error fetching orders stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders statistics'
      });
    }
  }
};

module.exports = ordersController;
