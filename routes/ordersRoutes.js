const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
router.get("/dashboard", ordersController.getDashboardData);
router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.createOrder);
router.put("/:id", ordersController.updateOrder);
router.patch("/:id", ordersController.patchOrder);
router.delete("/:id", ordersController.deleteOrder);


module.exports = router;
