const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Services = require("../models/services");
const Order = require("../models/order");
const User = require("../models/user");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDB = await newOrder.save();
      //saving services in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDB._id },
      });
      //clearing cart
      await User.findByIdAndUpdate(id, {
        $pull : { cart : orderData._id },
      });

      return res.json({
        status: "Success",
        message: "Order Placed Successfully",
      });

    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

//oder history of an usr
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "services" },
    });
    const ordersData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: ordersData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

//get-all-orders
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "services",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: userData,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});

//updated order by admin

router.get("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error Occurred" });
  }
});
module.exports = router;