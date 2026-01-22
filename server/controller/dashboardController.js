import Order from "../model/order.js";
import Table from "../model/table.js";
import Menu from "../model/menu.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, total: { $sum: "$billDetails.finalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 2. Counts
    const totalOrders = await Order.countDocuments();
    const menuItemsCount = await Menu.countDocuments();
    const activeTables = await Table.countDocuments({ isActive: true }); // Simplified for now

    // 3. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customerName tableNumber billDetails.finalAmount orderStatus");

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        menuItemsCount,
        activeTables
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};