const supabase = require('../../config/supabase');

const analyticsController = {
  // Получить общую статистику
  async getDashboardStats(req, res) {
    try {
      // Общее количество пользователей
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Общее количество продуктов
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Общее количество заказов
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Общая выручка
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount');

      const totalRevenue = revenueData?.reduce((sum, order) => 
        sum + (parseFloat(order.total_amount) || 0), 0) || 0;

      // Активные пользователи за последние 7 дней
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', sevenDaysAgo.toISOString());

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
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue: totalRevenue,
          activeUsers: activeUsers || 0,
          recentOrders: recentOrders || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics'
      });
    }
  },

  // Получить статистику продаж по дням
  async getSalesChart(req, res) {
    try {
      const { days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Группируем данные по дням
      const salesByDay = {};
      data?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        if (!salesByDay[date]) {
          salesByDay[date] = {
            date: date,
            orders: 0,
            revenue: 0
          };
        }
        salesByDay[date].orders += 1;
        salesByDay[date].revenue += parseFloat(order.total_amount) || 0;
      });

      const chartData = Object.values(salesByDay);

      res.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error fetching sales chart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch sales chart data'
      });
    }
  },

  // Получить топ продуктов
  async getTopProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      // Получаем все заказы с товарами
      const { data: orders, error } = await supabase
        .from('orders')
        .select('items');

      if (error) throw error;

      // Подсчитываем количество продаж каждого товара
      const productSales = {};
      orders?.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                product_id: item.product_id,
                name: item.name || 'Unknown Product',
                total_sold: 0,
                total_revenue: 0
              };
            }
            productSales[item.product_id].total_sold += item.quantity || 1;
            productSales[item.product_id].total_revenue += 
              (item.quantity || 1) * (parseFloat(item.price) || 0);
          });
        }
      });

      // Сортируем по количеству продаж
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, parseInt(limit));

      res.json({
        success: true,
        data: topProducts
      });
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top products'
      });
    }
  },

  // Получить статистику по категориям
  async getCategoryStats(req, res) {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;

      // Подсчитываем товары по категориям
      const categoryStats = {};
      products?.forEach(product => {
        const category = product.category || 'Uncategorized';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });

      const chartData = Object.entries(categoryStats).map(([category, count]) => ({
        category,
        count
      }));

      res.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error fetching category stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch category statistics'
      });
    }
  },

  // Получить статистику пользователей
  async getUserStats(req, res) {
    try {
      // Новые пользователи за последние 30 дней
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: newUsers, error: newUsersError } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (newUsersError) throw newUsersError;

      // Группируем по дням
      const usersByDay = {};
      newUsers?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        usersByDay[date] = (usersByDay[date] || 0) + 1;
      });

      const chartData = Object.entries(usersByDay).map(([date, count]) => ({
        date,
        count
      }));

      res.json({
        success: true,
        data: chartData
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  }
};

module.exports = analyticsController;
