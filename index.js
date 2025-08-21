


const express = require("express");
const cors = require("cors");
const createTable = require("./init");
const insertDefaultOrders = require("./data");
const ordersRoutes = require("./routes/ordersRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/orders", ordersRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createTable();
  await insertDefaultOrders();
});
