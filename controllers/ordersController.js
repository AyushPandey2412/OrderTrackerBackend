const pool = require("../db");

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET order by id
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Order not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new order
const createOrder = async (req, res) => {
  const { customer_name, order_date, total_amount, status } = req.body;
  if (!customer_name || !order_date || !total_amount || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO orders (customer_name, order_date, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [customer_name, order_date, total_amount, status]
    );
    res.status(201).json({ message: "Order created", order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE order (PUT)
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { customer_name, order_date, total_amount, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE orders SET customer_name = $1, order_date = $2, total_amount = $3, status = $4 WHERE id = $5 RETURNING *",
      [customer_name, order_date, total_amount, status, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order updated", order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PARTIAL UPDATE (PATCH)
const patchOrder = async (req, res) => {
  const { id } = req.params;
  const fields = Object.fromEntries(Object.entries(req.body).filter(([_, v]) => v !== undefined && v !== null));
  if (!Object.keys(fields).length) return res.status(400).json({ error: "No valid fields to update" });

  const setClause = Object.keys(fields).map((key, idx) => `${key} = $${idx + 1}`).join(", ");
  const values = [...Object.values(fields), id];

  try {
    const result = await pool.query(`UPDATE orders SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
    if (!result.rows.length) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order updated", order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted", order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    
    const totalOrdersResult = await pool.query("SELECT COUNT(*) FROM orders");
    const totalOrders = parseInt(totalOrdersResult.rows[0].count, 10);

    
    const totalRevenueResult = await pool.query("SELECT SUM(total_amount) FROM orders");
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].sum) || 0;

    
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `);

    
    const statusCounts = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
    };

    
    statusResult.rows.forEach((row) => {
      if (statusCounts.hasOwnProperty(row.status)) {
        statusCounts[row.status] = parseInt(row.count, 10);
      }
    });

    
    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders: statusCounts.Pending,
      shippedOrders: statusCounts.Shipped,
      deliveredOrders: statusCounts.Delivered,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  patchOrder,
  deleteOrder,
  getDashboardData,
};
