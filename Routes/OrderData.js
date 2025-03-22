const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// ✅ Save order data
router.post("/OrderData", async (req, res) => {
  try {
    console.log("Incoming request:", JSON.stringify(req.body, null, 2));

    if (!req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!req.body.order_data || req.body.order_data.length === 0) {
      return res.status(400).json({ error: "Order data is required" });
    }

    let newOrder = {
      Order_date: req.body.order_date || new Date().toDateString(),
      Order_time: req.body.order_time || new Date().toLocaleTimeString(), // ✅ Fix the key
      items: req.body.order_data, // ✅ Store items inside the order object
    };

    let existingUser = await Order.findOne({ email: req.body.email });

    if (!existingUser) {
      await Order.create({
        email: req.body.email,
        order_data: [newOrder], // ✅ Wrap inside an array
      });
    } else {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: newOrder } }, // ✅ Push new order object
        { new: true }
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error", message: error.message });
  }
});

// ✅ Fetch user orders
router.post("/myOrderData", async (req, res) => {
  try {
    console.log("Fetching orders for:", req.body.email);

    let mydata = await Order.findOne({ email: req.body.email });

    if (!mydata || !Array.isArray(mydata.order_data)) {
      return res.json({ order_data: [] }); // ✅ Ensure response is always an array
    }

    console.log("Retrieved Orders:", JSON.stringify(mydata.order_data, null, 2));

    res.json({ order_data: mydata.order_data });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
