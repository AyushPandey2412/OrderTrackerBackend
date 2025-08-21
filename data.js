const pool = require("./db");
async function insertDefaultOrders() {
  try {
    await pool.query(`
      INSERT INTO orders (customer_name, order_date, total_amount, status)
      VALUES
        ('Alice', CURRENT_DATE, 120.50, 'Pending'),
        ('Bob', CURRENT_DATE - INTERVAL '1 day', 250.00, 'Shipped'),
        ('Charlie', CURRENT_DATE - INTERVAL '2 days', 99.99, 'Delivered'),
        ('David', CURRENT_DATE - INTERVAL '3 days', 340.75, 'Pending'),
        ('Eve', CURRENT_DATE - INTERVAL '4 days', 180.25, 'Shipped')
      ON CONFLICT DO NOTHING;
    `);
    console.log("Default orders inserted");
  } catch (err) {
    console.error("Error inserting default orders:", err);
  }
}

module.exports = insertDefaultOrders;
