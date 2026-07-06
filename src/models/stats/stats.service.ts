import { Product } from "../Product/product.model";
import { Sale } from "../Sales/sale.model";

const getDashboardStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: 5 } }).countDocuments(),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  };
};

export const StatsService = {
  getDashboardStats,
};
