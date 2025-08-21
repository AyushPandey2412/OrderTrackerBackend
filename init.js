const pool = require("./db");
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        order_date DATE NOT NULL,
        total_amount NUMERIC(10,2) CHECK (total_amount >= 0),
        status VARCHAR(20) CHECK (status IN ('Pending', 'Shipped', 'Delivered'))
      );
    `);
    console.log("✅ Orders table ready");
  } catch (err) {
    console.error(" Error creating table:", err);
  }
}

module.exports = createTable;
